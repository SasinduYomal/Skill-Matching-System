const { sequelize, DataTypes } = require('../config/db');

const ProjectSkills = sequelize.define('ProjectSkills', {
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  required_level: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['Beginner', 'Intermediate', 'Mid-level', 'Advanced', 'Expert']],
        msg: 'Required level must be one of: Beginner, Intermediate, Mid-level, Advanced, Expert'
      }
    }
  }
}, {
  tableName: 'project_skills',
  timestamps: true,
  createdAt: 'assigned_at',
  updatedAt: false
});

module.exports = ProjectSkills;