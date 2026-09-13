import PageHeader from "../components/PageHeader.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

export default function Contact() {
  const { settings } = useSettings();

  return (
    <div className="page">
      <PageHeader
        title="Contact"
        subtitle={`Get in touch with the ${settings.labName}`}
      />
      <div className="container">
        <section className="content-section">
          <div className="contact-grid">
            {settings.address && (
              <div className="contact-item card">
                <div className="k">Address</div>
                <div className="v">{settings.address}</div>
              </div>
            )}
            {settings.phone && (
              <div className="contact-item card">
                <div className="k">Phone</div>
                <div className="v">{settings.phone}</div>
              </div>
            )}
            {settings.email && (
              <div className="contact-item card">
                <div className="k">Email</div>
                <div className="v">
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
              </div>
            )}
          </div>
          {settings.mapNote && <p className="hint" style={{ marginTop: 18 }}>{settings.mapNote}</p>}
        </section>
      </div>
    </div>
  );
}
