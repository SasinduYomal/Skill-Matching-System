const { sequelize, DataTypes } = require('../config/db');

const Skill = sequelize.define('Skill', {
  skillName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'skills',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Associations
Skill.associate = function(models) {
  Skill.belongsToMany(models.Personnel, {
    through: models.PersonnelSkills,
    foreignKey: 'skill_id',
    otherKey: 'personnel_id',
    as: 'personnel'
  });

  Skill.belongsToMany(models.Project, {
    through: models.ProjectSkills,
    foreignKey: 'skill_id',
    otherKey: 'project_id',
    as: 'projects'
  });
};

module.exports = Skill;
