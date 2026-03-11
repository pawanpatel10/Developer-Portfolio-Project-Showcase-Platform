import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const initialState = useMemo(
    () => ({
      name: user.name || '',
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
      avatar: user.avatar || '',
      github: user.socialLinks?.github || '',
      linkedin: user.socialLinks?.linkedin || '',
      twitter: user.socialLinks?.twitter || '',
      website: user.socialLinks?.website || '',
    }),
    [user]
  );
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const updatedUser = await userService.updateProfile({
        name: form.name,
        bio: form.bio,
        avatar: form.avatar,
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
        socialLinks: {
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
          website: form.website,
        },
      });
      updateUser(updatedUser);
      navigate(`/users/${updatedUser._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div>
        <span className="eyebrow">Profile settings</span>
        <h1>Edit developer profile</h1>
      </div>
      {error && <div className="alert error-alert">{error}</div>}
      <label>
        Name
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Bio
        <textarea name="bio" rows="5" value={form.bio} onChange={handleChange} />
      </label>
      <label>
        Skills
        <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
      </label>
      <label>
        Avatar URL
        <input type="url" name="avatar" value={form.avatar} onChange={handleChange} />
      </label>
      <label>
        GitHub
        <input type="url" name="github" value={form.github} onChange={handleChange} />
      </label>
      <label>
        LinkedIn
        <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
      </label>
      <label>
        Twitter
        <input type="url" name="twitter" value={form.twitter} onChange={handleChange} />
      </label>
      <label>
        Website
        <input type="url" name="website" value={form.website} onChange={handleChange} />
      </label>
      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Saving changes...' : 'Save profile'}
      </button>
    </form>
  );
};

export default EditProfilePage;
