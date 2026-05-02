import { useState } from "react";
import { api } from "../utils/api";
import defaultProfile from "../assets/profilePicture.png";

export default function Profile({ currentUser, userRole, onProfileUpdate }) {
  const [imagePreview, setImagePreview] = useState(currentUser?.imageUrl || "");
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    const res = await api.put(`/auth/profile/${currentUser._id}`, {
      fullName,
      imageUrl: imagePreview,
    });

    setSaving(false);

    if (res.success) {
      setSuccess(true);
      onProfileUpdate(res.data); // update currentUser in App.jsx
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h2>Profile</h2>
        <p>Account information</p>
      </section>

      <section className="dashboard-card">

        {/* Profile Image */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <img
            src={imagePreview || defaultProfile}
            alt="Profile"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--color-border-primary)" }}
          />
          <label style={{ cursor: "pointer", color: "var(--color-accent)", fontWeight: 600, fontSize: 14 }}>
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        {/* Email (read-only) */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={currentUser?.email || ""}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        {/* Role (read-only) */}
        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={userRole === "admin" ? "Admin" : "Member"}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        {success && <p style={{ color: "green", fontWeight: 600 }}>Profile updated successfully!</p>}

        <button className="auth-submit-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>
    </div>
  );
}