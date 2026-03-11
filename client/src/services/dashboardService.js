import api from './api';

const dashboardService = {
  async getSummary() {
    const { data } = await api.get('/dashboard/summary');
    return data;
  },
};

export default dashboardService;
