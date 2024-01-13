// adminUserService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/admins/users';

const adminUserService = {
  createNewUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, userData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllUsersAndAdmins: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default adminUserService;
