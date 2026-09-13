import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RepeatableRows from "../../components/RepeatableRows.jsx";
import ImageField from "../../components/ImageField.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { MEMBER_CATEGORIES } from "../../data/content.js";

const EMPTY_MEMBER = {
  category: "group-leader",
  name: "",
  degree: "",
  photoUrl: "",
  position: "",
  affiliation: "",
  secondaryRole: "",
  phone: "",
  fax: "",
  email: "",
  website: "",
  education: [],
  experience: [],
  researchFields: [],
  academicActivities: [],
  phdThesis: "",
  masterThesis: "",
  period: "",
  currentPosition: "",
};

const linesToList = (text) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function MemberForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [form, setForm] = useState(EMPTY_MEMBER);
  const [researchFieldsText, setResearchFieldsText] = useState("");
  const [academicActivitiesText, setAcademicActivitiesText] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const member = await api.get("members", id);
        setForm({ ...EMPTY_MEMBER, ...member });
        setResearchFieldsText((member.researchFields ?? []).join("\n"));
        setAcademicActivitiesText((member.academicActivities ?? []).join("\n"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let photoUrl = form.photoUrl;
      if (photoFile) {
        photoUrl = (await api.uploadPhoto(photoFile, token)).url;
      }

      const payload = {
        ...form,
        photoUrl,
        researchFields: linesToList(researchFieldsText),
        academicActivities: linesToList(academicActivitiesText),
      };

      if (isEdit) {
        await api.update("members", id, payload, token);
      } else {
        await api.create("members", payload, token);
      }
      navigate("/dashboard/members");
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

  if (loading) return <div className="spinner-wrap">Loading…</div>;

  const isLeader = form.category === "group-leader";

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Edit member" : "Add member"}</h1>
          <p>Profile details shown on the public Member pages</p>
        </div>
      </div>

      <form className="admin-panel admin-panel-pad" onSubmit={handleSubmit}>
        {error && <div className="alert error">{error}</div>}

        <fieldset>
          <legend>Basic</legend>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={setField("category")}>
                {MEMBER_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="name">Full name *</label>
              <input id="name" type="text" required value={form.name} onChange={setField("name")} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="degree">Degree</label>
              <input
                id="degree"
                type="text"
                placeholder="Ph.D., M.S., …"
                value={form.degree}
                onChange={setField("degree")}
              />
            </div>
            <ImageField
              label="Photo"
              url={form.photoUrl}
              file={photoFile}
              onSelect={setPhotoFile}
              onRemove={() => {
                setPhotoFile(null);
                setForm((f) => ({ ...f, photoUrl: "" }));
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="position">Position / Title</label>
            <input id="position" type="text" value={form.position} onChange={setField("position")} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="affiliation">Affiliation</label>
              <input
                id="affiliation"
                type="text"
                value={form.affiliation}
                onChange={setField("affiliation")}
              />
            </div>
            <div className="form-field">
              <label htmlFor="secondaryRole">Secondary role</label>
              <input
                id="secondaryRole"
                type="text"
                placeholder="e.g. Vice director, …"
                value={form.secondaryRole}
                onChange={setField("secondaryRole")}
              />
            </div>
          </div>

          {!isLeader && (
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="period">
                  Period <span className="hint">e.g. 2020 - 2023</span>
                </label>
                <input id="period" type="text" value={form.period} onChange={setField("period")} />
              </div>
              <div className="form-field">
                <label htmlFor="currentPosition">Current position</label>
                <input
                  id="currentPosition"
                  type="text"
                  value={form.currentPosition}
                  onChange={setField("currentPosition")}
                />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>Contact</legend>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={form.phone} onChange={setField("phone")} />
            </div>
            <div className="form-field">
              <label htmlFor="fax">Fax</label>
              <input id="fax" type="text" value={form.fax} onChange={setField("fax")} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={setField("email")} />
            </div>
            <div className="form-field">
              <label htmlFor="website">Website</label>
              <input id="website" type="url" value={form.website} onChange={setField("website")} />
            </div>
          </div>
        </fieldset>

        {isLeader && (
          <fieldset>
            <legend>Full profile</legend>
            <RepeatableRows
              label="Education"
              hint="Period / School / Degree"
              fields={[
                { key: "period", placeholder: "2010" },
                { key: "school", placeholder: "School name" },
                { key: "degree", placeholder: "Degree" },
              ]}
              rows={form.education}
              onChange={(rows) => setForm((f) => ({ ...f, education: rows }))}
            />

            <RepeatableRows
              label="Experience"
              hint="Period / Title / Organization"
              fields={[
                { key: "period", placeholder: "2020 - Present" },
                { key: "title", placeholder: "Job title" },
                { key: "org", placeholder: "Organization" },
              ]}
              rows={form.experience}
              onChange={(rows) => setForm((f) => ({ ...f, experience: rows }))}
            />

            <div className="form-field">
              <label htmlFor="researchFields">
                Research field <span className="hint">one item per line</span>
              </label>
              <textarea
                id="researchFields"
                value={researchFieldsText}
                onChange={(e) => setResearchFieldsText(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="academicActivities">
                Academic activity <span className="hint">one item per line</span>
              </label>
              <textarea
                id="academicActivities"
                value={academicActivitiesText}
                onChange={(e) => setAcademicActivitiesText(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="phdThesis">Ph.D. thesis title</label>
                <input
                  id="phdThesis"
                  type="text"
                  value={form.phdThesis}
                  onChange={setField("phdThesis")}
                />
              </div>
              <div className="form-field">
                <label htmlFor="masterThesis">Master thesis title</label>
                <input
                  id="masterThesis"
                  type="text"
                  value={form.masterThesis}
                  onChange={setField("masterThesis")}
                />
              </div>
            </div>
          </fieldset>
        )}

        <div className="btn-row">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create member"}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/dashboard/members")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
