// adminDistrictService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v2/districts';

const districtService = {
  getAllDistricts: async () => {
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

export default districtService;
