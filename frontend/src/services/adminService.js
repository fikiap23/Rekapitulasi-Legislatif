// adminService.js
import axios from 'axios';

const BASE_URL = 'http://your-api-base-url'; // Replace with your actual API base URL

const adminService = {
  createNewUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/createNewUser`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewParty: async (partyData) => {
    try {
      const response = await axios.post(`${BASE_URL}/createNewParty`, partyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getAllParties: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllParties`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewVillage: async (villageData) => {
    try {
      const response = await axios.post(`${BASE_URL}/createNewVillage`, villageData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewDistrict: async (districtData) => {
    try {
      const response = await axios.post(`${BASE_URL}/createNewDistrict`, districtData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createNewRegency: async (regencyData) => {
    try {
      const response = await axios.post(`${BASE_URL}/createNewRegency`, regencyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default adminService;
