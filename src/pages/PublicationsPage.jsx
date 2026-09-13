import PageHeader from "../components/PageHeader.jsx";
import AsyncSection from "../components/AsyncSection.jsx";
import { useCollection } from "../hooks/useCollection.js";

export default function PublicationsPage({ type, title }) {
  const { items, loading, error } = useCollection("publications", { type });

  return (
    <div className="page">
      <PageHeader eyebrow="Publications" title={title} />
      <div className="container">
        <section className="content-section">
          <AsyncSection
            loading={loading}
            error={error}
            isEmpty={items.length === 0}
            emptyText="No entries added yet."
          >
            <div className="card card-pad">
              {items.map((item) => (
                <div className="pub-item" key={item.id}>
                  <div className="pub-year">{item.year}</div>
                  <div>
                    <p className="pub-title">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </p>
                    <p className="pub-meta">
                      {item.authors}
                      {item.authors && item.venue ? " · " : ""}
                      {item.venue}
                    </p>
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
