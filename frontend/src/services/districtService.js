import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/districts';

const districtService = {
  getAllDistricts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        withCredentials: true, // Include cookies in the request
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getDetailDistrictById: async (districtId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${districtId}`, {
        withCredentials: true, // Include cookies in the request
      });
      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default districtService;
