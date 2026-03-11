import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ProjectCard from '../components/ProjectCard';
import userService from '../services/userService';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile(userId);
        setProfile(data.user);
        setProjects(data.projects);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (error) {
    return <div className="alert error-alert">{error}</div>;
  }

  return (
    <div className="stack-lg">
      <section className="card profile-panel">
        <img src={profile.avatar} alt={profile.name} className="avatar-lg" />
        <div className="stack-sm">
          <span className="eyebrow">Developer profile</span>
          <h1>{profile.name}</h1>
          <p>{profile.bio || 'No bio added yet.'}</p>
          <div className="tag-row">
            {profile.skills?.length ? (
              profile.skills.map((skill) => (
                <span key={skill} className="tag-chip">
                  {skill}
                </span>
              ))
            ) : (
              <span className="muted-text">No skills added.</span>
            )}
          </div>
          <div className="button-row wrap-row">
            {profile.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="ghost-button">
                GitHub
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="ghost-button">
                LinkedIn
              </a>
            )}
            {profile.socialLinks?.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="ghost-button">
                Website
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="stack-md">
        <div className="section-header">
          <div>
            <span className="eyebrow">Portfolio</span>
            <h2>Published projects</h2>
          </div>
        </div>
        {projects.length ? (
          <div className="grid two-grid">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState title="No public projects" description="This developer has not published any projects yet." />
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
