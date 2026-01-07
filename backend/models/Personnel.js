const { sequelize, DataTypes } = require('../config/db');

const Personnel = sequelize.define('Personnel', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false }, // Removed unique constraint temporarily to fix MySQL index issue
  department: DataTypes.STRING,
  position: DataTypes.STRING,
  experience_level: DataTypes.STRING
}, {
  tableName: 'personnel',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define the association
Personnel.associate = function(models) {
  Personnel.belongsToMany(models.Skill, {
    through: models.PersonnelSkills,
    foreignKey: 'personnel_id',
    otherKey: 'skill_id',
    as: 'skills'
  });
};

module.exports = Personnel;
