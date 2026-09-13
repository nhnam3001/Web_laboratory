import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import AsyncSection from "../components/AsyncSection.jsx";
import { useCollection } from "../hooks/useCollection.js";
import { useSettings } from "../context/SettingsContext.jsx";

export default function Research() {
  const { settings } = useSettings();
  const { items, loading, error } = useCollection("research");

  return (
    <div className="page">
      <PageHeader
        eyebrow="Research"
        title="Research Areas"
        subtitle={settings.researchOverview}
      />
      <div className="container">
        <section className="content-section">
          <AsyncSection
            loading={loading}
            error={error}
            isEmpty={items.length === 0}
            emptyText="No research areas added yet."
          >
            <div className="grid-cards">
              {items.map((area, i) => (
                <div className="feature-card card" key={area.id}>
                  <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              ))}
            </div>
          </AsyncSection>
        </section>

        <section className="content-section">
          <h2>Funding</h2>
          <p className="section-lead">
            Active and past grants supporting this work are listed on the{" "}
            <Link to="/research/funding">Funding</Link> page.
          </p>
        </section>
      </div>
    </div>
  );
}
