import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function NotFound() {
  return (
    <div className="page">
      <PageHeader title="Page not found" />
      <div className="container">
        <p>
          The page you are looking for does not exist. <Link to="/">Return home</Link>.
        </p>
      </div>
    </div>
  );
}
