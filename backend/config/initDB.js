const { sequelize } = require('./db');

// Import ALL models here
const Personnel = require('../models/Personnel');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const PersonnelSkills = require('../models/PersonnelSkills');
const ProjectSkills = require('../models/ProjectSkills');

// Set up associations
Personnel.associate({ Personnel, Skill, Project, PersonnelSkills, ProjectSkills });
Skill.associate({ Personnel, Skill, Project, PersonnelSkills, ProjectSkills });
Project.associate({ Personnel, Skill, Project, PersonnelSkills, ProjectSkills });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true }); // 🔥 REQUIRED
    console.log('✅ All models synchronized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
})();
