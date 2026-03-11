import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="card empty-state narrow-card">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="primary-button small-button">
        Back to homepage
      </Link>
    </section>
  );
};

export default NotFoundPage;
