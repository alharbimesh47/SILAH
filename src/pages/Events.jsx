import { useState, useEffect } from "react";
import { api } from "../utils/api";

const STATUS_OPTIONS = ["Attending", "Maybe", "Not Attending", "No Response"];

export default function Events({ userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "" });

  useEffect(() => {
    api.get("/events")
      .then(res => { if (res.success) setEvents(res.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (eventId, newStatus) => {
  setEvents(prev =>
    prev.map(e => e._id === eventId ? { ...e, status: newStatus } : e)
  );
  try {
    await api.put(`/events/${eventId}`, { status: newStatus });
  } catch (err) {
    console.error("Failed to save:", err);
  }
};

  const handleCreateEvent = async () => {
    if (!form.title || !form.date || !form.time || !form.location) {
      alert("Please fill in all fields.");
      return;
    }
    setCreating(true);
    const res = await api.post("/events", { ...form, status: "No Response" });
    setCreating(false);

    if (res.success) {
      setEvents(prev => [...prev, res.data]);
      setShowModal(false);
      setForm({ title: "", date: "", time: "", location: "" });
    } else {
      alert(res.message || "Failed to create event.");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h2>Events</h2>
      </section>

      <section className="dashboard-card">
        <div className="section-head">
          <h3>Upcoming Events</h3>
          {userRole === "admin" && (
            <button onClick={() => setShowModal(true)}>+ Create Event</button>
          )}
        </div>

        {events.length === 0 && <p>No events yet.</p>}

        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-top">
              <h4 className="event-title">{event.title}</h4>
              <select
                value={event.status}
                onChange={(e) => updateStatus(event._id, e.target.value)}
                className={event.status === "Attending" ? "status-badge status-attending" : "status-badge"}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="event-meta">
              <span>🗓 {event.date}</span>
              <span>◷ {event.time}</span>
            </div>
            <div className="event-location">⌖ {event.location}</div>
          </div>
        ))}
      </section>

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Create New Event</h3>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Event title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Event location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                className="auth-submit-btn"
                onClick={handleCreateEvent}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Event"}
              </button>
              <button
                className="status-badge"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}