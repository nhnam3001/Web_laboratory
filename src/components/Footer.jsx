import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../data/content.js";
import { useSettings } from "../context/SettingsContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-about">
          <div className="footer-lab">{settings.labName}</div>
          {settings.institution && <p>{settings.institution}</p>}
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">
          © {year} {settings.labName}
          {settings.institution ? `, ${settings.institution}` : ""}. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#report-abuse">Report abuse</a>
          <span aria-hidden="true">·</span>
          <a href="#page-details">Page details</a>
        </div>
      </div>
    </footer>
  );
}
