const { sequelize, DataTypes } = require('../config/db');

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING },
  start_date: { type: DataTypes.DATEONLY },
  end_date: { type: DataTypes.DATEONLY }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define the association
Project.associate = function(models) {
  Project.belongsToMany(models.Skill, {
    through: models.ProjectSkills,
    foreignKey: 'project_id',
    otherKey: 'skill_id',
    as: 'requiredSkills'
  });
};

module.exports = Project;
