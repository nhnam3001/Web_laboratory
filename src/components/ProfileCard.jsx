import { resolveAsset } from "../api/client.js";
import "./ProfileCard.css";

export default function ProfileCard({ member }) {
  const photo = resolveAsset(member.photoUrl);

  return (
    <div className="profile-card card">
      {photo ? (
        <img src={photo} alt={member.name} className="profile-avatar" />
      ) : (
        <div className="profile-avatar avatar-placeholder" aria-hidden="true">
          {member.name?.[0] ?? "?"}
        </div>
      )}

      <div className="profile-details">
        <h2 className="profile-name">
          {member.name}
          {member.degree ? `, ${member.degree}` : ""}
        </h2>
        {member.position && <p className="profile-position">{member.position}</p>}
        {member.affiliation && <p className="profile-affiliation">{member.affiliation}</p>}
        {member.secondaryRole && (
          <p className="profile-secondary-role">{member.secondaryRole}</p>
        )}

        <dl className="profile-contact">
          {member.phone && (
            <>
              <dt>Tel.</dt>
              <dd>{member.phone}</dd>
            </>
          )}
          {member.fax && (
            <>
              <dt>Fax.</dt>
              <dd>{member.fax}</dd>
            </>
          )}
          {member.email && (
            <>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${member.email}`}>{member.email}</a>
              </dd>
            </>
          )}
          {member.website && (
            <>
              <dt>Website</dt>
              <dd>
                <a href={member.website} target="_blank" rel="noreferrer">
                  {member.website}
                </a>
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
