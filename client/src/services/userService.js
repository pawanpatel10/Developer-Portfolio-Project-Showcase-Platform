import api from './api';

const userService = {
  async getProfile(userId) {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },
  async updateProfile(payload) {
    const { data } = await api.put('/users/profile', payload);
    return data;
  },
};

export default userService;
