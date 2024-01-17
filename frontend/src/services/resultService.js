import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v2/result';

const resultService = {
  fillBallots: async (villageId, validBallots) => {
    try {
      const response = await axios.post(`${BASE_URL}/validBallots/${villageId}`, validBallots, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default resultService;
