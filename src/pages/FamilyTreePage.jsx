import { useState, useEffect } from "react";
import FamilyTree from "../components/familyTree";
import { api } from "../utils/api";

export default function FamilyTreePage({ userRole, theme }) {
  const [showModal, setShowModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [treeNodes, setTreeNodes] = useState({});
  const [form, setForm] = useState({ userId: "", parentId: "" });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // forces tree to re-fetch

  useEffect(() => {
    if (showModal) {
      // Load available users and current tree nodes for parent selection
      api.get("/family/available-users")
        .then(res => { if (res.success) setAvailableUsers(res.data); });

      api.get("/family")
        .then(res => { if (res.success) setTreeNodes(res.data); });
    }
  }, [showModal]);

  const handleAddMember = async () => {
    if (!form.userId) return alert("Please select a user.");
    setLoading(true);

    const res = await api.post("/family", {
      userId: form.userId,
      parentId: form.parentId || null,
    });

    setLoading(false);

    if (res.success) {
      setShowModal(false);
      setForm({ userId: "", parentId: "" });
      setRefreshKey(prev => prev + 1); // re-render tree
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="section-head">
          <h2>Family Tree</h2>
          {userRole === "admin" && (
            <button onClick={() => setShowModal(true)}>+ Add Member</button>
          )}
        </div>
        <p>
          {userRole === "admin"
            ? "Admin can manage and update the family tree."
            : "Members can explore the family tree."}
        </p>
      </div>

      <div className="tree-wrapper">
        <FamilyTree theme={theme} refreshKey={refreshKey} />
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Add Member to Tree</h3>

            <div className="form-group">
              <label>Select User</label>
              <select
                value={form.userId}
                onChange={e => setForm({ ...form, userId: e.target.value })}
              >
                <option value="">-- Choose a user --</option>
                {availableUsers.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Parent Node (optional)</label>
              <select
                value={form.parentId}
                onChange={e => setForm({ ...form, parentId: e.target.value })}
              >
                <option value="">-- No parent (root) --</option>
                {Object.values(treeNodes).map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                className="auth-submit-btn"
                onClick={handleAddMember}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add to Tree"}
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