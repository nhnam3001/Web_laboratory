import PageHeader from "../components/PageHeader.jsx";
import AsyncSection from "../components/AsyncSection.jsx";
import { useCollection } from "../hooks/useCollection.js";

export default function Funding() {
  const { items, loading, error } = useCollection("funding");

  return (
    <div className="page">
      <PageHeader
        eyebrow="Research"
        title="Funding"
        subtitle="Grants and projects supporting the lab's research"
      />
      <div className="container">
        <section className="content-section">
          <AsyncSection
            loading={loading}
            error={error}
            isEmpty={items.length === 0}
            emptyText="No funding entries added yet."
          >
            <div className="card card-pad timeline">
              {items.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <div className="timeline-period">{item.period}</div>
                  <div className="timeline-body">
                    <strong>{item.title}</strong>
                    <div className="sub">
                      {item.agency}
                      {item.role ? ` — ${item.role}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AsyncSection>
        </section>
      </div>
    </div>
  );
}
