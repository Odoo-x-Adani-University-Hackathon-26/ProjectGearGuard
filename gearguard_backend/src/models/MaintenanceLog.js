// models/MaintenanceLog.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaintenanceLog = sequelize.define('MaintenanceLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    maintenanceRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'maintenance_request_id'
    },
    technicianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'technician_id'
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hoursSpent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'hours_spent'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'maintenance_logs',
    timestamps: false,
    underscored: true
  });

  return MaintenanceLog;
};