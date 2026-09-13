import { useEffect, useState } from "react";
import { resolveAsset } from "../api/client.js";

export default function ImageField({ label, hint, url, file, onSelect, onRemove, wide }) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const next = URL.createObjectURL(file);
    setObjectUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  const preview = objectUrl ?? resolveAsset(url);

  return (
    <div className="form-field">
      <label>
        {label} {hint && <span className="hint">— {hint}</span>}
      </label>
      <div className="image-field">
        {preview ? (
          <img src={preview} alt="" className={wide ? "image-preview wide" : "image-preview"} />
        ) : (
          <div className={wide ? "image-preview wide is-empty" : "image-preview is-empty"}>
            No image
          </div>
        )}
        <div className="image-field-controls">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
          />
          {preview && (
            <button type="button" className="btn secondary small" onClick={onRemove}>
              Remove image
            </button>
          )}
          {file && <span className="hint">New image will be uploaded when you save.</span>}
        </div>
      </div>
    </div>
  );
}
