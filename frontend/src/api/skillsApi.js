import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const skillsApi = {
  // Get all skills
  getAll: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SKILLS);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  // Get skill by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.SKILLS}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching skill by ID:', error);
      throw error;
    }
  },

  // Create new skill
  create: async (skillData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SKILLS, skillData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // Update skill
  update: async (id, skillData) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.SKILLS}/${id}`, skillData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  },

  // Delete skill
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.SKILLS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
};

export default skillsApi;