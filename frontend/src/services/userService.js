// authService.js
import axios from 'axios';

const BASE_URL = 'localhost:3000/api/v2/users';

const authService = {
  createNewUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default authService;
