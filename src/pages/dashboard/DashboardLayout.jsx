import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSettings } from "../../context/SettingsContext.jsx";
import "./Dashboard.css";

const SECTIONS = [
  { to: "/dashboard/members", label: "Members" },
  { to: "/dashboard/news", label: "News" },
  { to: "/dashboard/research", label: "Research Areas" },
  { to: "/dashboard/funding", label: "Funding" },
  { to: "/dashboard/publications", label: "Publications" },
  { to: "/dashboard/settings", label: "Site Settings" },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">
            <span className="admin-badge">Admin</span>
            <span className="admin-lab">{settings.shortName || settings.labName}</span>
          </div>
          <div className="btn-row">
            <Link to="/" className="btn secondary small">
              View site
            </Link>
            <button type="button" className="btn small" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav>
            {SECTIONS.map((s) => (
              <NavLink key={s.to} to={s.to} className="admin-nav-link">
                {s.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
