const express = require('express');
const router = express.Router();
const ProjectsController = require('../controllers/ProjectsController');

// GET all projects
router.get('/', ProjectsController.getAllProjects);

// GET project by ID
router.get('/:id', ProjectsController.getProjectById);

// POST create a new project
router.post('/', ProjectsController.createProject);

// PUT update project
router.put('/:id', ProjectsController.updateProject);

// DELETE project
router.delete('/:id', ProjectsController.deleteProject);

// GET project with its required skills
router.get('/:id/skills', ProjectsController.getProjectWithSkills);

// POST assign skills to project
router.post('/:id/skills', ProjectsController.assignSkillsToProject);

// DELETE remove a specific skill from project
router.delete('/:projectId/skills/:skillId', ProjectsController.removeSkillFromProject);

module.exports = router;