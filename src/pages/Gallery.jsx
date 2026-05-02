import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function Gallery({ userRole, currentUser }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [lightbox, setLightbox] = useState(null); // full screen view

  useEffect(() => {
    api.get("/gallery")
      .then(res => { if (res.success) setPhotos(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;
    setUploading(true);

    const res = await api.post("/gallery", {
      imageUrl: preview,
      uploadedBy: currentUser?.fullName || "Admin",
    });

    setUploading(false);

    if (res.success) {
      setPhotos(prev => [res.data, ...prev]);
      setPreview(null);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    const res = await api.delete(`/gallery/${photoId}`);  // need to add delete to api.js
    if (res.success) {
      setPhotos(prev => prev.filter(p => p._id !== photoId));
      if (lightbox?._id === photoId) setLightbox(null);
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h2>Gallery</h2>
        <p>Family photos and memories</p>
      </section>

      {/* Upload Section — admin only */}
      {userRole === "admin" && (
        <section className="dashboard-card" style={{ marginBottom: 24 }}>
          <div className="section-head">
            <h3>Upload Photo</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: "2px solid var(--color-border-primary)" }}
              />
            )}

            <label style={{ cursor: "pointer", padding: "10px 20px", borderRadius: 10, border: "2px dashed var(--color-border-primary)", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              {preview ? "Change Photo" : "📷 Choose Photo"}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>

            {preview && (
              <button className="auth-submit-btn" onClick={handleUpload} disabled={uploading}
                style={{ width: "auto", padding: "10px 24px" }}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}

            {preview && (
              <button className="status-badge" onClick={() => setPreview(null)}>
                Cancel
              </button>
            )}
          </div>
        </section>
      )}

      {/* Photo Grid */}
      <section className="dashboard-card">
        <div className="section-head">
          <h3>Photos</h3>
          <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>{photos.length} photos</span>
        </div>

        {loading && <p>Loading photos...</p>}
        {!loading && photos.length === 0 && <p>No photos yet.</p>}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}>
          {photos.map(photo => (
            <div key={photo._id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "1", cursor: "pointer" }}
              onClick={() => setLightbox(photo)}>
              <img
                src={photo.imageUrl}
                alt="Family photo"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {userRole === "admin" && (
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(photo._id); }}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(0,0,0,0.6)", color: "white",
                    border: "none", borderRadius: "50%", width: 28, height: 28,
                    cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox.imageUrl}
            alt="Full view"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 16, objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}