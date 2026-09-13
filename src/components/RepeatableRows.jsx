export default function RepeatableRows({ label, hint, fields, rows, onChange }) {
  const updateRow = (idx, key, value) =>
    onChange(rows.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));

  const addRow = () =>
    onChange([...rows, Object.fromEntries(fields.map((f) => [f.key, ""]))]);

  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <div className="form-field">
      <label>
        {label} {hint && <span className="hint">— {hint}</span>}
      </label>
      <div className="repeatable-rows">
        {rows.map((row, idx) => (
          <div className="repeatable-row" key={idx}>
            {fields.map((f) => (
              <input
                key={f.key}
                type="text"
                placeholder={f.placeholder}
                value={row[f.key] ?? ""}
                onChange={(e) => updateRow(idx, f.key, e.target.value)}
              />
            ))}
            <button
              type="button"
              className="icon-btn"
              onClick={() => removeRow(idx)}
              aria-label={`Remove ${label} entry`}
            >
              ✕
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="btn secondary small" onClick={addRow}>
            + Add entry
          </button>
        </div>
      </div>
    </div>
  );
}
