const { sequelize, DataTypes } = require('../config/db');

const PersonnelSkills = sequelize.define('PersonnelSkills', {
  personnel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  proficiency_level: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['Beginner', 'Intermediate', 'Advanced', 'Expert']],
        msg: 'Proficiency level must be one of: Beginner, Intermediate, Advanced, Expert'
      }
    }
  }
}, {
  tableName: 'personnel_skills',
  timestamps: true,
  createdAt: 'assigned_at',
  updatedAt: false
});

module.exports = PersonnelSkills;