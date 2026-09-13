import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { IS_DEMO } from "../api/client.js";
import { DEMO_CREDENTIALS } from "../api/demoStore.js";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-mark">{(settings.shortName || "L").charAt(0)}</div>
        <h1>Administrator sign in</h1>
        <p className="login-sub">{settings.labName}</p>

        {IS_DEMO && (
          <div className="login-demo-hint">
            Demo sign-in: <strong>{DEMO_CREDENTIALS.username}</strong> /{" "}
            <strong>{DEMO_CREDENTIALS.password}</strong>
            <span>Your changes stay in this browser only.</span>
          </div>
        )}

        {error && <div className="alert error">{error}</div>}

        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="btn login-submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <Link to="/" className="login-back">
          ← Back to the site
        </Link>
      </form>
    </div>
  );
}
