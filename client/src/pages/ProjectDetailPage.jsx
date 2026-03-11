import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentList from '../components/CommentList';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import projectService from '../services/projectService';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getById(id);
      setProject(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleLike = async () => {
    try {
      await projectService.toggleLike(id);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Login required to like this project.');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await projectService.addComment(id, commentText);
      setCommentText('');
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading project..." />;
  }

  if (error && !project) {
    return <div className="alert error-alert">{error}</div>;
  }

  const isLiked = Boolean(user && project.likes?.some((like) => like.toString() === user._id));

  return (
    <div className="stack-lg">
      {error && <div className="alert error-alert">{error}</div>}

      <section className="card detail-panel stack-md">
        <div className="project-card-top">
          <div>
            <span className="eyebrow">Project details</span>
            <h1>{project.title}</h1>
          </div>
          <span className="score-pill">Trending score {project.trendingScore}</span>
        </div>

        <p>{project.description}</p>

        <div className="tag-row">
          {project.techStack?.map((item) => (
            <span key={item} className="tag-chip">
              {item}
            </span>
          ))}
        </div>

        <div className="project-metrics">
          <span>❤️ {project.likesCount}</span>
          <span>💬 {project.commentsCount}</span>
          <span>👤 {project.userId?.name}</span>
        </div>

        <div className="button-row wrap-row">
          <a href={project.githubLink} target="_blank" rel="noreferrer" className="ghost-button">
            GitHub Repo
          </a>
          <a href={project.demoLink} target="_blank" rel="noreferrer" className="ghost-button">
            Live Demo
          </a>
          {isAuthenticated && (
            <button
              type="button"
              className={`like-button icon-button ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike project' : 'Like project'}
              title={isLiked ? 'Unlike project' : 'Like project'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="button-icon">
                <path d="M2 21h4V9H2v12Zm20-11.12c0-.97-.79-1.76-1.76-1.76h-5.55l.84-4.02.03-.28c0-.36-.15-.69-.38-.94L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h8.24c.82 0 1.53-.5 1.83-1.22l2.69-6.28c.16-.23.24-.51.24-.81V9.88Z" />
              </svg>
            </button>
          )}
        </div>
      </section>

      <section className="card stack-md">
        <div className="section-header">
          <div>
            <span className="eyebrow">Comments</span>
            <h2>Community feedback</h2>
          </div>
        </div>

        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              rows="4"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Share feedback or encouragement"
              required
            />
            <button type="submit" className="primary-button small-button" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="muted-text">Login to like or comment on this project.</p>
        )}

        <CommentList comments={project.comments} />
      </section>
    </div>
  );
};

export default ProjectDetailPage;
