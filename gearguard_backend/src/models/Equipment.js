// models/Equipment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Equipment = sequelize.define('Equipment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      unique: true,
      field: 'serial_number'
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'department_id'
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'owner_id'
    },
    maintenanceTeamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'maintenance_team_id'
    },
    defaultTechnicianId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'default_technician_id'
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'purchase_date'
    },
    warrantyEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'warranty_end_date'
    },
    status: {
      type: DataTypes.ENUM('active', 'scrapped'),
      defaultValue: 'active'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'equipment',
    timestamps: false,
    underscored: true
  });

  return Equipment;
};