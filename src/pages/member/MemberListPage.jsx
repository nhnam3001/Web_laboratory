import PageHeader from "../../components/PageHeader.jsx";
import AsyncSection from "../../components/AsyncSection.jsx";
import { useCollection } from "../../hooks/useCollection.js";
import { resolveAsset } from "../../api/client.js";

export default function MemberListPage({ category, title, subtitle }) {
  const { items, loading, error } = useCollection("members", { category });

  return (
    <div className="page">
      <PageHeader eyebrow="Member" title={title} subtitle={subtitle} />
      <div className="container">
        <AsyncSection
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyText="No members in this category yet."
        >
          <div className="member-grid">
            {items.map((m) => {
              const photo = resolveAsset(m.photoUrl);
              return (
                <div className="member-card card" key={m.id}>
                  {photo ? (
                    <img src={photo} alt={m.name} className="avatar avatar-sm" />
                  ) : (
                    <div className="avatar avatar-sm avatar-placeholder">
                      {m.name?.[0] ?? "?"}
                    </div>
                  )}
                  <div>
                    <h3>
                      {m.name}
                      {m.degree ? `, ${m.degree}` : ""}
                    </h3>
                    {m.period && <p className="period">{m.period}</p>}
                    {(m.currentPosition || m.position) && (
                      <p className="position">{m.currentPosition || m.position}</p>
                    )}
                    {m.affiliation && <p className="position">{m.affiliation}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </AsyncSection>
      </div>
    </div>
  );
}
