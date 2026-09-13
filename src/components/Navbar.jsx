import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../data/content.js";
import { useSettings } from "../context/SettingsContext.jsx";
import "./Navbar.css";

function DesktopItem({ item }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!item.children) {
    return (
      <NavLink to={item.to} className="nav-link" end={item.to === "/"}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div
      className="nav-item-dropdown"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 130);
      }}
    >
      <button
        type="button"
        className={`nav-link nav-link-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <span className="caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className="dropdown-link"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <NavLink to={item.to} className="mobile-link" onClick={onNavigate} end={item.to === "/"}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div className="mobile-group">
      <button
        type="button"
        className="mobile-link mobile-link-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <span className="caret" aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="mobile-submenu">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className="mobile-sublink"
              onClick={onNavigate}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const initials = (settings.shortName || settings.labName || "L").trim().charAt(0);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">{initials}</span>
          <span className="brand-text">
            <span className="brand-name">{settings.shortName || settings.labName}</span>
            {settings.institution && (
              <span className="brand-sub">{settings.institution}</span>
            )}
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <DesktopItem key={item.label} item={item} />
          ))}
        </nav>

        <button
          type="button"
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className="nav-mobile" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <MobileItem
              key={item.label}
              item={item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </div>
      )}
    </header>
  );
}
