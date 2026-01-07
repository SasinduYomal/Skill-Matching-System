const Project = require('../models/Project');
const Skill = require('../models/Skill');

const ProjectsController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const Skill = require('../models/Skill');
      const projects = await Project.findAll({
        include: [{
          model: Skill,
          as: 'requiredSkills',
          through: { attributes: ['required_level', 'assigned_at'] },
          required: false // This ensures all projects are returned even if they don't have skills
        }]
      });
      res.json({ data: projects });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get project by ID
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ data: project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    try {
      const { name, description, status, start_date, end_date } = req.body;
      
      // Validation
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      
      const newProject = await Project.create({ name, description, status, start_date, end_date });
      res.status(201).json({ data: newProject, message: 'Project created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update project
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, status, start_date, end_date } = req.body;
      
      // Validation
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      
      const [updatedRowsCount] = await Project.update({ name, description, status, start_date, end_date }, { where: { id } });
      
      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const updatedProject = await Project.findByPk(id);
      res.json({ data: updatedProject, message: 'Project updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRowsCount = await Project.destroy({ where: { id } });
      
      if (deletedRowsCount === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET - Get project with its required skills
  getProjectWithSkills: async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [{
          model: Skill,
          as: 'requiredSkills',
          through: { attributes: ['required_level', 'assigned_at'] } // Include the junction table attributes
        }]
      });
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // POST - Assign skills to project
  assignSkillsToProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { requiredSkills } = req.body; // Array of { skill_id, required_level }
      
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Validate requiredSkills array
      if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        return res.status(400).json({ message: 'Required skills must be a non-empty array' });
      }
      
      // Assign skills with required levels
      for (const skill of requiredSkills) {
        // Verify the skill exists before adding it
        const skillExists = await Skill.findByPk(skill.skill_id);
        if (!skillExists) {
          return res.status(400).json({ message: `Skill with ID ${skill.skill_id} does not exist` });
        }
        
        // Use direct database insert instead of association method
        const [record, created] = await require('../models/ProjectSkills').findOrCreate({
          where: {
            project_id: project.id,
            skill_id: skill.skill_id
          },
          defaults: {
            project_id: project.id,
            skill_id: skill.skill_id,
            required_level: skill.required_level
          }
        });
        
        if (!created) {
          // If record already exists, update it
          await record.update({ required_level: skill.required_level });
        }
      }
      
      res.status(200).json({ message: 'Skills assigned to project successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // DELETE - Remove a specific skill from project
  removeSkillFromProject: async (req, res) => {
    try {
      const { projectId, skillId } = req.params;
      
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      await project.removeSkill(skillId);
      
      res.status(200).json({ message: 'Skill removed from project successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ProjectsController;