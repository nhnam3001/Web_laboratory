import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import ImageField from "../../components/ImageField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSettings } from "../../context/SettingsContext.jsx";

const FIELDS = [
  { key: "labName", label: "Lab name", group: "Identity" },
  { key: "shortName", label: "Short name (navbar)", group: "Identity" },
  { key: "institution", label: "Institution", group: "Identity", full: true },
  { key: "tagline", label: "Tagline (home hero)", group: "Identity", full: true },
  { key: "intro", label: "About the lab", group: "Identity", type: "textarea", full: true },
  {
    key: "researchOverview",
    label: "Research page intro",
    group: "Identity",
    type: "textarea",
    full: true,
  },
  { key: "email", label: "Email", group: "Contact" },
  { key: "phone", label: "Phone", group: "Contact" },
  { key: "address", label: "Address", group: "Contact", type: "textarea", full: true },
  { key: "mapNote", label: "Directions note", group: "Contact", full: true },
];

const GROUPS = ["Identity", "Contact"];

const IMAGE_FIELDS = [
  {
    key: "heroImageUrl",
    label: "Home banner image",
    hint: "background of the big header on the home page",
  },
  {
    key: "aboutImageUrl",
    label: "About section image",
    hint: "shown next to the 'About the lab' text",
  },
];

export default function SettingsAdmin() {
  const { settings, reload } = useSettings();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(settings);
  const [pendingFiles, setPendingFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      for (const [key, file] of Object.entries(pendingFiles)) {
        if (file) payload[key] = (await api.uploadPhoto(file, token)).url;
      }
      await api.updateSettings(payload, token);
      setPendingFiles({});
      await reload();
      setSaved(true);
    } catch (err) {
      if (err.message.includes("Invalid or expired token")) {
        logout();
        navigate("/login");
        return;
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Site Settings</h1>
          <p>Lab name, intro text and contact details shown across the public site</p>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {saved && <div className="alert success">Settings saved.</div>}

      <form className="admin-panel admin-panel-pad" onSubmit={handleSubmit}>
        {GROUPS.map((group) => (
          <fieldset key={group}>
            <legend>{group}</legend>
            <div className="form-row">
              {FIELDS.filter((f) => f.group === group && !f.full).map((f) => (
                <div className="form-field" key={f.key}>
                  <label htmlFor={f.key}>{f.label}</label>
                  <input
                    id={f.key}
                    type="text"
                    value={form[f.key] ?? ""}
                    onChange={setField(f.key)}
                  />
                </div>
              ))}
            </div>
            {FIELDS.filter((f) => f.group === group && f.full).map((f) => (
              <div className="form-field" key={f.key}>
                <label htmlFor={f.key}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea id={f.key} value={form[f.key] ?? ""} onChange={setField(f.key)} />
                ) : (
                  <input
                    id={f.key}
                    type="text"
                    value={form[f.key] ?? ""}
                    onChange={setField(f.key)}
                  />
                )}
              </div>
            ))}
          </fieldset>
        ))}

        <fieldset>
          <legend>Home page images</legend>
          {IMAGE_FIELDS.map((f) => (
            <ImageField
              key={f.key}
              label={f.label}
              hint={f.hint}
              wide
              url={form[f.key]}
              file={pendingFiles[f.key]}
              onSelect={(file) => {
                setPendingFiles((p) => ({ ...p, [f.key]: file }));
                setSaved(false);
              }}
              onRemove={() => {
                setPendingFiles((p) => ({ ...p, [f.key]: null }));
                setForm((s) => ({ ...s, [f.key]: "" }));
                setSaved(false);
              }}
            />
          ))}
        </fieldset>

        <div className="btn-row">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </>
  );
}
