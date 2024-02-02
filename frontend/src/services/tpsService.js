// tpsService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/tps';

const tpsService = {
  fillBallots: async (tpsId, validBallots) => {
    try {
      const response = await axios.post(`${BASE_URL}/fill/${tpsId}`, validBallots, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  getAllTpsRekap: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default tpsService;
