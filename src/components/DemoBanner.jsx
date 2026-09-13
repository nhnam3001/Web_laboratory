import { useState } from "react";
import { IS_DEMO } from "../api/client.js";
import { DEMO_CREDENTIALS, resetDemoData } from "../api/demoStore.js";
import "./DemoBanner.css";

export default function DemoBanner() {
  const [hidden, setHidden] = useState(false);

  if (!IS_DEMO || hidden) return null;

  const handleReset = () => {
    if (!window.confirm("Discard your demo changes and restore the original content?")) return;
    resetDemoData();
    window.location.reload();
  };

  return (
    <div className="demo-banner">
      <div className="demo-banner-inner">
        <span className="demo-tag">Demo</span>
        <p>
          Try the admin dashboard: press <kbd>Ctrl</kbd>+<kbd>A</kbd> and sign in with{" "}
          <strong>{DEMO_CREDENTIALS.username}</strong> /{" "}
          <strong>{DEMO_CREDENTIALS.password}</strong>. Anything you change is saved only in
          your own browser — other visitors are not affected.
        </p>
        <div className="demo-banner-actions">
          <button type="button" className="btn secondary small" onClick={handleReset}>
            Reset demo
          </button>
          <button
            type="button"
            className="demo-close"
            onClick={() => setHidden(true)}
            aria-label="Hide demo notice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
