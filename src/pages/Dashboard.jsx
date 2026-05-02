import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function Dashboard({ userRole }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/events"),
      api.get("/gallery"),
    ]).then(([eventsRes, galleryRes]) => {
      if (eventsRes.success) setEvents(eventsRes.data.slice(0, 3));
      if (galleryRes.success) setPhotos(galleryRes.data.slice(0, 4)); // latest 4
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-card">
          <div className="section-head">
            <h3>Upcoming Events</h3>
            <button className="link-btn" onClick={() => navigate("/events")}>
              View All
            </button>
          </div>

          {loading && <p>Loading events...</p>}
          {!loading && events.length === 0 && <p>No upcoming events.</p>}

          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-top">
                <h4 className="event-title">{event.title}</h4>
                <span className={event.status === "Attending" ? "status-badge status-attending" : "status-badge"}>
                  {event.status}
                </span>
              </div>
              <div className="event-meta">
                <span>🗓 {event.date}</span>
                <span>◷ {event.time}</span>
              </div>
              <div className="event-location">⌖ {event.location}</div>
            </div>
          ))}

          <div className="helper-strip">
            → Click event card to view details and update RSVP
          </div>
        </div>

        <div>
          <div className="dashboard-card" style={{ marginBottom: "24px" }}>
            <div className="section-head">
              <h3>Gallery</h3>
              <button className="link-btn" onClick={() => navigate("/gallery")}>
                View All
              </button>
            </div>

            <div className="gallery-grid">
              {loading && [0,1,2,3].map(i => (
                <div key={i} className="gallery-box">🖼</div>
              ))}

              {!loading && photos.length === 0 && (
                <p style={{ gridColumn: "span 2", color: "var(--color-text-secondary)", fontSize: 14 }}>
                  No photos yet.
                </p>
              )}

              {photos.map(photo => (
                <div
                  key={photo._id}
                  className="gallery-box"
                  onClick={() => navigate("/gallery")}
                  style={{ cursor: "pointer", padding: 0, overflow: "hidden" }}
                >
                  <img
                    src={photo.imageUrl}
                    alt="Family"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ))}
            </div>

            <div className="gallery-footer">Recent family photos</div>
          </div>

          <div className="dashboard-card">
            <div className="section-head">
              <h3>Quick Links</h3>
            </div>
            <div className="quick-links">
              <button onClick={() => navigate("/family-tree")}>Family Tree</button>
              <button onClick={() => navigate("/messages")}>Messages</button>
              <button onClick={() => navigate("/announcements")}>Announcements</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}