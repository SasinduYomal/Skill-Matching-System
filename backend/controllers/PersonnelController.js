const Personnel = require('../models/Personnel');
const Skill = require('../models/Skill');

// GET all
exports.getAllPersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.findAll();
    res.json({ data: personnel, count: personnel.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by ID
exports.getPersonnelById = async (req, res) => {
  try {
    const person = await Personnel.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createPersonnel = async (req, res) => {
  try {
    const { name, email, department, position, experience_level } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const person = await Personnel.create({
      name,
      email,
      department,
      position,
      experience_level
    });

    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updatePersonnel = async (req, res) => {
  try {
    const person = await Personnel.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }

    const { name, email, department, position, experience_level } = req.body;
    await person.update({
      name,
      email,
      department,
      position,
      experience_level
    });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deletePersonnel = async (req, res) => {
  try {
    const person = await Personnel.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }

    await person.destroy();
    res.json({ message: 'Personnel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET personnel with skills
exports.getPersonnelWithSkills = async (req, res) => {
  try {
    const person = await Personnel.findByPk(req.params.id, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: ['proficiency_level', 'assigned_at'] },
        required: false // This ensures personnel is returned even if they don't have skills
      }]
    });

    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }

    res.json({ data: person });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all with skills
exports.getAllPersonnelWithSkills = async (req, res) => {
  try {
    const personnel = await Personnel.findAll({
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: ['proficiency_level', 'assigned_at'] },
        required: false // This ensures all personnel are returned even if they don't have skills
      }]
    });
    res.json({ data: personnel, count: personnel.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN skills
exports.assignSkillsToPersonnel = async (req, res) => {
  try {
    const { skills } = req.body; // Array of { skill_id, proficiency_level }
    const person = await Personnel.findByPk(req.params.id);

    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }

    // Validate skills array
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: 'Skills must be a non-empty array' });
    }

    // Clear existing skills for this personnel
    await require('../models/PersonnelSkills').destroy({
      where: { personnel_id: req.params.id }
    });
    
    // Add new skills with proficiency levels
    for (const skill of skills) {
      await require('../models/PersonnelSkills').create({
        personnel_id: req.params.id,
        skill_id: skill.skill_id,
        proficiency_level: skill.proficiency_level || 'Beginner'
      });
    }
    res.json({ message: 'Skills assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE skill
exports.removeSkillFromPersonnel = async (req, res) => {
  try {
    const { personnelId, skillId } = req.params;
    const person = await Personnel.findByPk(personnelId);

    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }

    // Use direct database deletion instead of association method
    const PersonnelSkills = require('../models/PersonnelSkills');
    await PersonnelSkills.destroy({
      where: {
        personnel_id: personnelId,
        skill_id: skillId
      }
    });
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
