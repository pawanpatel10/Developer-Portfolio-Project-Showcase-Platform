import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import useAuth from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import projectService from '../services/projectService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const [summaryData, projectData] = await Promise.all([
        dashboardService.getSummary(),
        projectService.getAll({ userId: user._id }),
      ]);
      setSummary(summaryData);
      setProjects(projectData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user._id]);

  const handleLike = async (projectId) => {
    await projectService.toggleLike(projectId);
    loadDashboard();
  };

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="stack-lg">
      <section className="hero card subhero-panel">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>{user.name}&apos;s creator overview</h1>
          <p>Track your activity, showcase impact, and keep your profile updated.</p>
        </div>
        <div className="button-row">
          <Link to="/projects/new" className="primary-button small-button">
            Add new project
          </Link>
          <Link to="/profile/edit" className="ghost-button">
            Edit profile
          </Link>
        </div>
      </section>

      {error && <div className="alert error-alert">{error}</div>}

      <section className="grid three-grid">
        <StatCard label="Total Projects" value={summary?.totalProjects || 0} accent="#38bdf8" />
        <StatCard label="Total Likes" value={summary?.totalLikes || 0} accent="#f472b6" />
        <StatCard label="Total Comments" value={summary?.totalComments || 0} accent="#a78bfa" />
      </section>

      <section className="stack-md">
        <div className="section-header">
          <div>
            <span className="eyebrow">Your work</span>
            <h2>Projects you have published</h2>
          </div>
        </div>
        {projects.length ? (
          <div className="grid two-grid">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} onLike={handleLike} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects yet"
            description="Publish your first project to start building your public portfolio."
          />
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
