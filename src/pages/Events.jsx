// import { useState, useEffect } from "react";
// import { api } from "../utils/api";

// export default function Events({ userRole }) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     api.get("/events")
//       .then(res => {
//         if (res.success) {
//           setEvents(res.data);
//         }
//       })
//       .catch(err => setError("Failed to load events"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p>Loading events...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="dashboard-page">
//       <section className="dashboard-hero">
//         <h2>Events</h2>
//       </section>

//       <section className="dashboard-card">
//         <div className="section-head">
//           <h3>Upcoming Events</h3>
//           {userRole === "admin" && <button>Create Event</button>}
//         </div>

//         {events.length === 0 && <p>No events yet.</p>}

//         {events.map((event) => (
//           <div key={event._id} className="event-card">  {/* use _id from MongoDB */}
//             <div className="event-top">
//               <h4 className="event-title">{event.title}</h4>
//               <span className={
//                 event.status === "Attending"
//                   ? "status-badge status-attending"
//                   : "status-badge"
//               }>
//                 {event.status}
//               </span>
//             </div>

//             <div className="event-meta">
//               <span>🗓 {event.date}</span>
//               <span>◷ {event.time}</span>
//             </div>

//             <div className="event-location">⌖ {event.location}</div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { api } from "../utils/api";

const STATUS_OPTIONS = ["Attending", "Maybe", "Not Attending", "No Response"];

export default function Events({ userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events")
      .then(res => { if (res.success) setEvents(res.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (eventId, newStatus) => {
  // Update UI immediately
  setEvents(prev =>
    prev.map(e => e._id === eventId ? { ...e, status: newStatus } : e)
  );

  try {
    const res = await fetch(`http://localhost:5050/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    console.log("Saved to DB:", data); // confirm this shows success: true
  } catch (err) {
    console.error("Failed to save:", err);
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
          {userRole === "admin" && <button>Create Event</button>}
        </div>

        {events.length === 0 && <p>No events yet.</p>}

        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-top">
              <h4 className="event-title">{event.title}</h4>

              {/* Clickable status dropdown */}
              <select
                value={event.status}
                onChange={(e) => updateStatus(event._id, e.target.value)}
                className={
                  event.status === "Attending"
                    ? "status-badge status-attending"
                    : "status-badge"
                }
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
    </div>
  );
}