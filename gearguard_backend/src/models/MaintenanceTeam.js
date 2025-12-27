// models/MaintenanceTeam.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaintenanceTeam = sequelize.define('MaintenanceTeam', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'maintenance_teams',
    timestamps: false,
    underscored: true
  });

  return MaintenanceTeam;
};