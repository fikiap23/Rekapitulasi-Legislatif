// adminService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/admins';

const adminService = {
  createNewUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewParty: async (partyData) => {
    try {
      const response = await axios.post(`${BASE_URL}/parties`, partyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getAllParties: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/parties/all`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewVillage: async (villageData) => {
    try {
      const response = await axios.post(`${BASE_URL}/villages`, villageData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewDistrict: async (districtData) => {
    try {
      const response = await axios.post(`${BASE_URL}/districts`, districtData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewRegency: async (regencyData) => {
    try {
      const response = await axios.post(`${BASE_URL}/regencies`, regencyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default adminService;
