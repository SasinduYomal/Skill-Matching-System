const express = require('express');
const router = express.Router();
const PersonnelController = require('../controllers/PersonnelController');

// GET all personnel
router.get('/', PersonnelController.getAllPersonnel);

// GET all personnel with skills
router.get('/full-details', PersonnelController.getAllPersonnelWithSkills);

// GET personnel by ID
router.get('/:id', PersonnelController.getPersonnelById);

// CREATE personnel
router.post('/', PersonnelController.createPersonnel);

// UPDATE personnel
router.put('/:id', PersonnelController.updatePersonnel);

// DELETE personnel
router.delete('/:id', PersonnelController.deletePersonnel);

// GET personnel skills
router.get('/:id/skills', PersonnelController.getPersonnelWithSkills);

// ASSIGN skills
router.post('/:id/skills', PersonnelController.assignSkillsToPersonnel);

// REMOVE skill
router.delete('/:personnelId/skills/:skillId', PersonnelController.removeSkillFromPersonnel);

module.exports = router;
