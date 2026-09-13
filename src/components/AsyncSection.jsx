export default function AsyncSection({ loading, error, isEmpty, emptyText, children }) {
  if (loading) return <div className="spinner-wrap">Loading…</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (isEmpty) return <div className="empty-state">{emptyText}</div>;
  return children;
}
