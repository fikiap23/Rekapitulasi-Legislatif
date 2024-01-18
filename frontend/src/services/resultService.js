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
  getAllBallots: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllBallotsByDistrictId: async (districtId) => {
    try {
      const response = await axios.get(`${BASE_URL}/district/${districtId}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getAllDistricts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/districts`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  getAllVillagesByDistrict: async (districtId) => {
    try {
      const response = await axios.get(`${BASE_URL}/villages/${districtId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  getVillageByVillageId: async (villageId) => {
    try {
      const response = await axios.get(`${BASE_URL}/village/${villageId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};

export default resultService;
