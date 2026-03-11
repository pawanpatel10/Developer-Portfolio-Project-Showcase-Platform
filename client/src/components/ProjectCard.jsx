import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProjectCard = ({ project, onLike }) => {
  const { isAuthenticated, user } = useAuth();
  const isLiked = Boolean(user && project.likes?.some((like) => like.toString() === user._id));

  return (
    <article className="card project-card">
      <div className="project-card-top">
        <div>
          <div className="eyebrow">{project.userId?.name || 'Developer'}</div>
          <h3>{project.title}</h3>
        </div>
        <span className="score-pill">Score {project.trendingScore || 0}</span>
      </div>

      <p className="muted-text">{project.description}</p>

      <div className="tag-row">
        {project.techStack?.map((item) => (
          <span key={`${project._id}-${item}`} className="tag-chip">
            {item}
          </span>
        ))}
      </div>

      <div className="project-metrics">
        <span>❤️ {project.likesCount || 0}</span>
        <span>💬 {project.commentsCount || 0}</span>
      </div>

      <div className="project-links">
        <a href={project.githubLink} target="_blank" rel="noreferrer" className="ghost-button">
          GitHub
        </a>
        <a href={project.demoLink} target="_blank" rel="noreferrer" className="ghost-button">
          Live Demo
        </a>
        <Link to={`/projects/${project._id}`} className="primary-button small-button">
          View Details
        </Link>
      </div>

      {isAuthenticated && (
        <button
          type="button"
          className={`like-button icon-button ${isLiked ? 'active' : ''}`}
          onClick={() => onLike?.(project._id)}
          aria-label={isLiked ? 'Unlike project' : 'Like project'}
          title={isLiked ? 'Unlike project' : 'Like project'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="button-icon">
            <path d="M2 21h4V9H2v12Zm20-11.12c0-.97-.79-1.76-1.76-1.76h-5.55l.84-4.02.03-.28c0-.36-.15-.69-.38-.94L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h8.24c.82 0 1.53-.5 1.83-1.22l2.69-6.28c.16-.23.24-.51.24-.81V9.88Z" />
          </svg>
        </button>
      )}
    </article>
  );
};

export default ProjectCard;
