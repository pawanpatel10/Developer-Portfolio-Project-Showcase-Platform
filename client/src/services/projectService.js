import api from './api';

const projectService = {
  async getAll(params = {}) {
    const { data } = await api.get('/projects', { params });
    return data;
  },
  async getTrending() {
    const { data } = await api.get('/projects/trending');
    return data;
  },
  async getById(projectId) {
    const { data } = await api.get(`/projects/${projectId}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/projects', payload);
    return data;
  },
  async toggleLike(projectId) {
    const { data } = await api.post(`/projects/${projectId}/like`);
    return data;
  },
  async addComment(projectId, text) {
    const { data } = await api.post(`/projects/${projectId}/comments`, { text });
    return data;
  },
};

export default projectService;
