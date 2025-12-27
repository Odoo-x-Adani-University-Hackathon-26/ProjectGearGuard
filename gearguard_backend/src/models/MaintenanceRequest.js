// models/MaintenanceRequest.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    equipmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'equipment_id'
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'team_id'
    },
    technicianId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'technician_id'
    },
    requestType: {
      type: DataTypes.ENUM('corrective', 'preventive'),
      allowNull: false,
      field: 'request_type'
    },
    status: {
      type: DataTypes.ENUM('new', 'in_progress', 'repaired', 'scrap'),
      defaultValue: 'new'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'scheduled_date'
    },
    durationHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'duration_hours'
    },
    isOverdue: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_overdue'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'maintenance_requests',
    timestamps: false,
    underscored: true
  });

  return MaintenanceRequest;
};