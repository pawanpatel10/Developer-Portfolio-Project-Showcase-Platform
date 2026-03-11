import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import projectService from '../services/projectService';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError('');
      const project = await projectService.create(payload);
      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stack-md">
      <section className="section-header">
        <div>
          <span className="eyebrow">Publish</span>
          <h1>Add a new project</h1>
        </div>
      </section>
      {error && <div className="alert error-alert">{error}</div>}
      <ProjectForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default CreateProjectPage;
