import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const personnelApi = {
  // Get all personnel
  getAll: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PERSONNEL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching personnel:', error);
      throw error;
    }
  },

  // Get personnel by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PERSONNEL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching personnel by ID:', error);
      throw error;
    }
  },

  // Create new personnel
  create: async (personnelData) => {
    try {
      const mappedData = {
        name: personnelData.name,
        email: personnelData.email,
        department: personnelData.department || '',
        position: personnelData.position || '',
        experience_level: personnelData.experienceLevel || personnelData.experience || personnelData.experience_level || ''
      };
      
      const response = await axios.post(API_ENDPOINTS.PERSONNEL, mappedData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating personnel:', error);
      throw error;
    }
  },

  // Update personnel
  update: async (id, personnelData) => {
    try {
      const mappedData = {
        name: personnelData.name,
        email: personnelData.email,
        department: personnelData.department || '',
        position: personnelData.position || '',
        experience_level: personnelData.experienceLevel || personnelData.experience || personnelData.experience_level || ''
      };
      
      const response = await axios.put(`${API_ENDPOINTS.PERSONNEL}/${id}`, mappedData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating personnel:', error);
      throw error;
    }
  },

  // Delete personnel
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.PERSONNEL}/${id}`);
      return response.data || response.data.data;
    } catch (error) {
      console.error('Error deleting personnel:', error);
      throw error;
    }
  },

  // Get personnel with their skills
  getWithSkills: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PERSONNEL}/${id}/skills`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching personnel with skills:', error);
      throw error;
    }
  },

  // Get all personnel with their skills
  getAllWithSkills: async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PERSONNEL}/full-details`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching all personnel with skills:', error);
      throw error;
    }
  },

  // Assign skills to personnel
  assignSkills: async (personnelId, skillsData) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.PERSONNEL}/${personnelId}/skills`, {
        skills: skillsData
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning skills to personnel:', error);
      throw error;
    }
  },

  // Remove a skill from personnel
  removeSkill: async (personnelId, skillId) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.PERSONNEL}/${personnelId}/skills/${skillId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing skill from personnel:', error);
      throw error;
    }
  }
};

export default personnelApi;
