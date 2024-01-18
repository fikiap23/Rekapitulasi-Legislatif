import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v2/parties';

const partyService = {
  getAllParties: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        withCredentials: true,
      });

      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default partyService;
