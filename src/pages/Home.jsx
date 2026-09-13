import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext.jsx";
import { useCollection } from "../hooks/useCollection.js";
import { resolveAsset } from "../api/client.js";

export default function Home() {
  const { settings } = useSettings();
  const { items: research } = useCollection("research");
  const { items: news } = useCollection("news");
  const { items: members } = useCollection("members");
  const { items: publications } = useCollection("publications");

  const heroImage = resolveAsset(settings.heroImageUrl);
  const aboutImage = resolveAsset(settings.aboutImageUrl);
  const latestNews = news.slice(0, 3);

  return (
    <div className="page">
      <section
        className={`hero${heroImage ? " has-image" : ""}`}
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      >
        <div className="container">
          <span className="eyebrow">{settings.institution}</span>
          <h1>{settings.labName}</h1>
          <p>{settings.tagline}</p>
          <div className="btn-row">
            <Link to="/research" className="btn">
              Explore our research
            </Link>
            <Link to="/member/group-leader" className="btn secondary">
              Meet the team
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="stat-row">
          <div className="stat card">
            <div className="value">{research.length}</div>
            <div className="label">Research areas</div>
          </div>
          <div className="stat card">
            <div className="value">{members.length}</div>
            <div className="label">Members & alumni</div>
          </div>
          <div className="stat card">
            <div className="value">{publications.length}</div>
            <div className="label">Publications</div>
          </div>
        </div>

        <section className="content-section">
          <h2>About the lab</h2>
          <div className={aboutImage ? "about-split" : undefined}>
            <p className="section-lead">{settings.intro}</p>
            {aboutImage && <img src={aboutImage} alt="" className="about-image" />}
          </div>
        </section>

        {research.length > 0 && (
          <section className="content-section">
            <h2>Research highlights</h2>
            <div className="grid-cards">
              {research.slice(0, 3).map((area, i) => (
                <div className="feature-card card" key={area.id}>
                  <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {latestNews.length > 0 && (
          <section className="content-section">
            <h2>Latest news</h2>
            <div className="news-teasers">
              {latestNews.map((item) => {
                const image = resolveAsset(item.imageUrl);
                return (
                  <article className="news-teaser card" key={item.id}>
                    {image ? (
                      <img src={image} alt="" className="news-teaser-image" />
                    ) : (
                      <div className="news-teaser-image is-empty" aria-hidden="true" />
                    )}
                    <div className="news-teaser-body">
                      <div className="news-date">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link to="/news" className="btn secondary small">
              All news →
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
