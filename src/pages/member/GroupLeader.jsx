import PageHeader from "../../components/PageHeader.jsx";
import ProfileCard from "../../components/ProfileCard.jsx";
import InfoSection from "../../components/InfoSection.jsx";
import AsyncSection from "../../components/AsyncSection.jsx";
import { useCollection } from "../../hooks/useCollection.js";

export default function GroupLeader() {
  const { items, loading, error } = useCollection("members", { category: "group-leader" });
  const leader = items[0];

  return (
    <div className="page">
      <PageHeader eyebrow="Member" title="Group Leader" />
      <div className="container">
        <AsyncSection
          loading={loading}
          error={error}
          isEmpty={!leader}
          emptyText="No group leader profile has been added yet."
        >
          {leader && <LeaderProfile leader={leader} />}
        </AsyncSection>
      </div>
    </div>
  );
}

function LeaderProfile({ leader }) {
  const education = leader.education ?? [];
  const experience = leader.experience ?? [];
  const researchFields = leader.researchFields ?? [];
  const academicActivities = leader.academicActivities ?? [];

  return (
    <>
      <ProfileCard member={leader} />

      <InfoSection title="Education" empty={education.length === 0}>
        <div className="timeline">
          {education.map((ed, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-period">{ed.period}</div>
              <div className="timeline-body">
                <strong>{ed.school}</strong>
                <div className="sub">{ed.degree}</div>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Experience" empty={experience.length === 0}>
        <div className="timeline">
          {experience.map((ex, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-period">{ex.period}</div>
              <div className="timeline-body">
                <strong>{ex.title}</strong>
                <div className="sub">{ex.org}</div>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Research Field" empty={researchFields.length === 0}>
        <ul className="list-plain">
          {researchFields.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Academic Activity" empty={academicActivities.length === 0}>
        <ul className="list-plain">
          {academicActivities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Ph.D. Thesis Title" empty={!leader.phdThesis}>
        <p>{leader.phdThesis}</p>
      </InfoSection>

      <InfoSection title="Master Thesis Title" empty={!leader.masterThesis}>
        <p>{leader.masterThesis}</p>
      </InfoSection>
    </>
  );
}
