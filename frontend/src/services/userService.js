// authService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v2/users';

const userService = {
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
      console.log('get all users');
      const response = await axios.get(`${BASE_URL}`, {
        withCredentials: true,
      });

      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default userService;
