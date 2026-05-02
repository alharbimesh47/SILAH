import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function AdminApprovals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/pending")
      .then(res => { if (res.success) setUsers(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = (userId, decision) => {
    api.put(`/auth/approve/${userId}`, { status: decision })
      .then(res => {
        if (res.success) {
          setUsers(prev => prev.filter(u => u._id !== userId));
        }
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h2>Pending Approvals</h2>
      </section>

      <section className="dashboard-card">
        {users.length === 0 && <p>No pending users.</p>}

        {users.map(user => (
          <div key={user._id} className="event-card">
            <div className="event-top">
              <div>
                <h4 className="event-title">{user.fullName}</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>{user.email} · {user.role}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="status-badge status-attending"
                  onClick={() => handleDecision(user._id, "approved")}>
                  Approve
                </button>
                <button className="status-badge"
                  onClick={() => handleDecision(user._id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}