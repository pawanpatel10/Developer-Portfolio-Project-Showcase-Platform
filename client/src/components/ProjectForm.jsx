import { useState } from 'react';

const ProjectForm = ({ onSubmit, submitting = false }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    tags: '',
    githubLink: '',
    demoLink: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      techStack: form.techStack.split(',').map((item) => item.trim()).filter(Boolean),
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label>
        Project title
        <input type="text" name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" rows="5" value={form.description} onChange={handleChange} required />
      </label>
      <label>
        Tech stack
        <input
          type="text"
          name="techStack"
          placeholder="React, Node.js, MongoDB"
          value={form.techStack}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Tags
        <input
          type="text"
          name="tags"
          placeholder="Full Stack, API, AI"
          value={form.tags}
          onChange={handleChange}
        />
      </label>
      <label>
        GitHub link
        <input type="url" name="githubLink" value={form.githubLink} onChange={handleChange} required />
      </label>
      <label>
        Live demo link
        <input type="url" name="demoLink" value={form.demoLink} onChange={handleChange} required />
      </label>
      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Saving...' : 'Publish Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
