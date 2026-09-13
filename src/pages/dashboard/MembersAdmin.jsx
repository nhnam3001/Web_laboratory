import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, resolveAsset } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollection } from "../../hooks/useCollection.js";
import { MEMBER_CATEGORIES } from "../../data/content.js";

const CATEGORY_LABEL = Object.fromEntries(
  MEMBER_CATEGORIES.map((c) => [c.value, c.label])
);

export default function MembersAdmin() {
  const { items, loading, error, reload } = useCollection("members");
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete "${member.name}"? This cannot be undone.`)) return;
    setBusyId(member.id);
    setActionError(null);
    try {
      await api.remove("members", member.id, token);
      await reload();
    } catch (err) {
      if (err.message.includes("Invalid or expired token")) {
        logout();
        navigate("/login");
        return;
      }
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Members</h1>
          <p>
            {items.length} {items.length === 1 ? "profile" : "profiles"} · group leader, alumni
            and visiting members
          </p>
        </div>
        <Link to="/dashboard/members/new" className="btn">
          + Add member
        </Link>
      </div>

      {actionError && <div className="alert error">{actionError}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <div className="spinner-wrap">Loading…</div>
        ) : items.length === 0 ? (
          <div className="spinner-wrap">No members yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Position / Period</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => {
                  const photo = resolveAsset(m.photoUrl);
                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          {photo ? (
                            <img
                              src={photo}
                              alt=""
                              className="avatar"
                              style={{ width: 34, height: 34 }}
                            />
                          ) : (
                            <div
                              className="avatar avatar-placeholder"
                              style={{ width: 34, height: 34, fontSize: "0.85rem" }}
                            >
                              {m.name?.[0] ?? "?"}
                            </div>
                          )}
                          <span className="cell-strong">{m.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge">{CATEGORY_LABEL[m.category] ?? m.category}</span>
                      </td>
                      <td className="cell-truncate">{m.position || m.period || "—"}</td>
                      <td>
                        <div className="row-actions">
                          <Link
                            to={`/dashboard/members/${m.id}/edit`}
                            className="btn secondary small"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn danger small"
                            disabled={busyId === m.id}
                            onClick={() => handleDelete(m)}
                          >
                            {busyId === m.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
