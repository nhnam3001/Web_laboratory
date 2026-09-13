import PageHeader from "../components/PageHeader.jsx";
import AsyncSection from "../components/AsyncSection.jsx";
import { useCollection } from "../hooks/useCollection.js";
import { resolveAsset } from "../api/client.js";

export default function News() {
  const { items, loading, error } = useCollection("news");

  return (
    <div className="page">
      <PageHeader title="News" subtitle="Latest updates and announcements from the lab" />
      <div className="container">
        <AsyncSection
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyText="No news posted yet."
        >
          {items.map((item) => {
            const image = resolveAsset(item.imageUrl);
            return (
              <article
                className={`news-item card${image ? " has-image" : ""}`}
                key={item.id}
              >
                {image && <img src={image} alt="" className="news-image" />}
                <div className="news-body">
                  <div className="news-date">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </AsyncSection>
      </div>
    </div>
  );
}
