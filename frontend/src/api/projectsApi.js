import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const projectsApi = {
  // Get all projects
  getAll: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROJECTS);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PROJECTS}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  },

  // Create new project
  create: async (projectData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.PROJECTS, projectData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  update: async (id, projectData) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.PROJECTS}/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
  
  // Assign skills to project
  assignSkillsToProject: async (projectId, skillsData) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.PROJECTS}/${projectId}/skills`, {
        requiredSkills: skillsData
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning skills to project:', error);
      throw error;
    }
  }
};

export default projectsApi;