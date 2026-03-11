import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import projectService from '../services/projectService';

const initialFilters = { search: '', tech: '', tag: '' };

const HomePage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [projects, setProjects] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (activeFilters = initialFilters) => {
    try {
      setLoading(true);
      setError('');
      const [projectsData, trendingData] = await Promise.all([
        projectService.getAll(activeFilters),
        projectService.getTrending(),
      ]);
      setProjects(projectsData);
      setTrendingProjects(trendingData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchData(initialFilters);
  };

  const handleLike = async (projectId) => {
    try {
      await projectService.toggleLike(projectId);
      fetchData(filters);
    } catch (err) {
      setError(err.response?.data?.message || 'Login required to like projects.');
    }
  };

  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  return (
    <div className="stack-lg">
      <section className="hero card hero-panel">
        <div>
          <span className="eyebrow">Resume-grade MERN project</span>
          <h1>Showcase developer work with profiles, projects, feedback, and trending rankings.</h1>
          <p>
            DevLink combines profile discovery, searchable project listings, likes, comments, and a
            trending feed in one portfolio platform.
          </p>
        </div>
      </section>

      <SearchBar filters={filters} onChange={handleChange} onSubmit={handleSubmit} onReset={handleReset} />

      {error && <div className="alert error-alert">{error}</div>}

      <section className="stack-md">
        <div className="section-header">
          <div>
            <span className="eyebrow">Trending</span>
            <h2>Top ranked projects</h2>
          </div>
        </div>
        {trendingProjects.length ? (
          <div className="grid two-grid">
            {trendingProjects.map((project) => (
              <ProjectCard key={project._id} project={project} onLike={handleLike} />
            ))}
          </div>
        ) : (
          <EmptyState title="No trending projects yet" description="Add projects and interactions to generate rankings." />
        )}
      </section>

      <section className="stack-md">
        <div className="section-header">
          <div>
            <span className="eyebrow">Explore</span>
            <h2>Latest project submissions</h2>
          </div>
        </div>
        {projects.length ? (
          <div className="grid two-grid">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} onLike={handleLike} />
            ))}
          </div>
        ) : (
          <EmptyState title="No projects match the filters" description="Try a different tag or search phrase." />
        )}
      </section>
    </div>
  );
};

export default HomePage;
