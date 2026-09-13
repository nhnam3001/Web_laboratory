export default function InfoSection({ title, empty = false, emptyText = "No information available yet.", children }) {
  return (
    <section className="content-section">
      <h2>{title}</h2>
      {empty ? <p className="hint">{emptyText}</p> : children}
    </section>
  );
}
