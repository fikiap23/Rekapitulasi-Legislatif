// adminDistrictService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/admins/districts';

const adminDistrictService = {
  createNewDistrict: async (districtData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, districtData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  createMultipleDistricts: async (districtsData) => {
    try {
      const response = await axios.post(`${BASE_URL}/multiple`, districtsData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  createMultipleDistrictsByRegency: async (regencyId, districtsData) => {
    try {
      const response = await axios.post(`${BASE_URL}/multiple/${regencyId}`, districtsData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

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

export default adminDistrictService;
