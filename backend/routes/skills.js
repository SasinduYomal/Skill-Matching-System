const express = require('express');
const router = express.Router();
const SkillsController = require('../controllers/SkillsController');

// GET all skills
router.get('/', SkillsController.getAllSkills);

// GET skill by ID
router.get('/:id', SkillsController.getSkillById);

// POST create a new skill
router.post('/', SkillsController.createSkill);

// PUT update a skill
router.put('/:id', SkillsController.updateSkill);

// DELETE a skill
router.delete('/:id', SkillsController.deleteSkill);

module.exports = router;