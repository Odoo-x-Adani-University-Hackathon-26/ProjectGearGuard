// models/MaintenanceTeamMember.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaintenanceTeamMember = sequelize.define('MaintenanceTeamMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'team_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  }, {
    tableName: 'maintenance_team_members',
    timestamps: false,
    underscored: true
  });

  return MaintenanceTeamMember;
};