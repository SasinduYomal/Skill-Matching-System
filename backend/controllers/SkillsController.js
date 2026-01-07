const Skill = require('../models/Skill');

const SkillsController = {

  // Get all skills
  getAllSkills: async (req, res) => {
    try {
      const skills = await Skill.findAll();
      res.json({ data: skills, count: skills.length }); // ✅ return array in data property (consistent format)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get skill by ID
  getSkillById: async (req, res) => {
    try {
      const { id } = req.params;
      const skill = await Skill.findByPk(id);

      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }

      res.json({ data: skill });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Create a new skill
  createSkill: async (req, res) => {
    try {
      const { name, category, description } = req.body;

      // ✅ Correct validation
      if (!name || !category) {
        return res.status(400).json({ error: 'Skill name and category are required' });
      }

      const newSkill = await Skill.create({
        skillName: name,
        category,
        description
      });

      res.status(201).json({ data: newSkill });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Update a skill
  updateSkill: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, description } = req.body;

      if (!name || !category) {
        return res.status(400).json({ error: 'Skill name and category are required' });
      }

      const [updatedRowsCount] = await Skill.update(
        { skillName: name, category, description },
        { where: { id } }
      );

      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: 'Skill not found' });
      }

      const updatedSkill = await Skill.findByPk(id);
      res.json({ data: updatedSkill });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a skill
  deleteSkill: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRowsCount = await Skill.destroy({ where: { id } });

      if (deletedRowsCount === 0) {
        return res.status(404).json({ error: 'Skill not found' });
      }

      res.json({ data: { message: 'Skill deleted successfully' } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SkillsController;
