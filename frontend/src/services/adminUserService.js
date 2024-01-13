import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/admins/users';

const adminUserService = {
  createNewUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, userData, {
        withCredentials: true, // Include cookies in the request
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllUsersAndAdmins: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`, {
        withCredentials: true, // Include cookies in the request
      });
      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default adminUserService;
