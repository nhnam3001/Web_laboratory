import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, resolveAsset } from "../../api/client.js";
import ImageField from "../../components/ImageField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollection } from "../../hooks/useCollection.js";
import { COLLECTION_SCHEMAS } from "../../data/adminSchemas.js";

function FieldInput({ field, value, onChange }) {
  const common = {
    id: field.key,
    value: value ?? "",
    onChange: (e) => onChange(field.key, e.target.value),
    placeholder: field.placeholder,
    required: field.required,
  };

  if (field.type === "textarea") return <textarea {...common} />;
  if (field.type === "select") {
    return (
      <select {...common}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  return <input type={field.type === "date" ? "date" : field.type} {...common} />;
}

export default function CollectionAdmin({ collection }) {
  const schema = COLLECTION_SCHEMAS[collection];
  const { items, loading, error, reload } = useCollection(collection);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [draft, setDraft] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleAuthError = (err) => {
    if (err.message.includes("Invalid or expired token")) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  };

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const closeForm = () => {
    setDraft(null);
    setPendingFiles({});
  };

  const startCreate = () => {
    setFormError(null);
    setPendingFiles({});
    setDraft({ ...schema.defaults });
  };

  const startEdit = (item) => {
    setFormError(null);
    setPendingFiles({});
    setDraft({ ...schema.defaults, ...item });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      const payload = { ...draft };
      for (const [key, file] of Object.entries(pendingFiles)) {
        if (file) payload[key] = (await api.uploadPhoto(file, token)).url;
      }

      if (payload.id) {
        await api.update(collection, payload.id, payload, token);
      } else {
        await api.create(collection, payload, token);
      }
      closeForm();
      await reload();
    } catch (err) {
      if (!handleAuthError(err)) setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (item) => {
    const label = item.title || item.name || "this entry";
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api.remove(collection, item.id, token);
      await reload();
    } catch (err) {
      if (!handleAuthError(err)) setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const fieldOf = (key) => schema.fields.find((f) => f.key === key);
  const columnLabel = (key) => fieldOf(key)?.label ?? key;
  const firstTextColumn = schema.columns.find((c) => fieldOf(c)?.type !== "image");

  const cellValue = (item, key) => {
    const field = fieldOf(key);
    if (field?.type === "select") {
      return field.options.find((o) => o.value === item[key])?.label ?? item[key];
    }
    return item[key];
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{schema.label}</h1>
          <p>
            {items.length} {items.length === 1 ? "entry" : "entries"} · shown on the public site
          </p>
        </div>
        {!draft && (
          <button type="button" className="btn" onClick={startCreate}>
            + Add {schema.singular}
          </button>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}

      {draft && (
        <div className="admin-panel admin-panel-pad" style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: "1.05rem" }}>
            {draft.id ? `Edit ${schema.singular}` : `New ${schema.singular}`}
          </h2>
          {formError && <div className="alert error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              {schema.fields
                .filter((f) => !f.full)
                .map((f) => (
                  <div className="form-field" key={f.key}>
                    <label htmlFor={f.key}>
                      {f.label} {f.hint && <span className="hint">— {f.hint}</span>}
                    </label>
                    <FieldInput field={f} value={draft[f.key]} onChange={setField} />
                  </div>
                ))}
            </div>

            {schema.fields
              .filter((f) => f.full)
              .map((f) =>
                f.type === "image" ? (
                  <ImageField
                    key={f.key}
                    label={f.label}
                    hint={f.hint}
                    wide={f.wide}
                    url={draft[f.key]}
                    file={pendingFiles[f.key]}
                    onSelect={(file) =>
                      setPendingFiles((p) => ({ ...p, [f.key]: file }))
                    }
                    onRemove={() => {
                      setPendingFiles((p) => ({ ...p, [f.key]: null }));
                      setField(f.key, "");
                    }}
                  />
                ) : (
                  <div className="form-field" key={f.key}>
                    <label htmlFor={f.key}>
                      {f.label} {f.hint && <span className="hint">— {f.hint}</span>}
                    </label>
                    <FieldInput field={f} value={draft[f.key]} onChange={setField} />
                  </div>
                )
              )}

            <div className="btn-row">
              <button type="submit" className="btn" disabled={busy}>
                {busy ? "Saving…" : draft.id ? "Save changes" : "Create"}
              </button>
              <button type="button" className="btn secondary" onClick={closeForm} disabled={busy}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-panel">
        {loading ? (
          <div className="spinner-wrap">Loading…</div>
        ) : items.length === 0 ? (
          <div className="spinner-wrap">No entries yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  {schema.columns.map((c) => (
                    <th key={c}>{columnLabel(c)}</th>
                  ))}
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {schema.columns.map((c) => {
                      if (fieldOf(c)?.type === "image") {
                        const src = resolveAsset(item[c]);
                        return (
                          <td key={c} style={{ width: 76 }}>
                            {src ? (
                              <img src={src} alt="" className="table-thumb" />
                            ) : (
                              <span className="hint">—</span>
                            )}
                          </td>
                        );
                      }
                      return (
                        <td key={c} className={c === firstTextColumn ? "cell-strong" : "cell-truncate"}>
                          {cellValue(item, c) || "—"}
                        </td>
                      );
                    })}
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn secondary small"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn danger small"
                          onClick={() => handleDelete(item)}
                          disabled={busy}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
