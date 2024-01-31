import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/rekap';

const rekapService = {
  getAllDistrictsWithRekapVotes: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/districts`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllRekapBallots: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default rekapService;
