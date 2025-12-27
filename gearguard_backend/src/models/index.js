// models/index.js or your main setup file
const setupAssociations = (models) => {
  const {
    User,
    Department,
    MaintenanceTeam,
    MaintenanceTeamMember,
    Equipment,
    MaintenanceRequest,
    MaintenanceLog,
    Notification,
  } = models;

  // User associations
  User.hasMany(MaintenanceTeamMember, { foreignKey: "userId" });
  User.hasMany(Equipment, { foreignKey: "ownerId", as: "ownedEquipment" });
  User.hasMany(Equipment, {
    foreignKey: "defaultTechnicianId",
    as: "assignedEquipment",
  });
  User.hasMany(MaintenanceRequest, {
    foreignKey: "technicianId",
    as: "assignedRequests",
  });
  User.hasMany(MaintenanceRequest, {
    foreignKey: "createdBy",
    as: "createdRequests",
  });
  User.hasMany(MaintenanceLog, { foreignKey: "technicianId" });
  User.hasMany(Notification, { foreignKey: "userId" });

  // Department associations
  Department.hasMany(Equipment, { foreignKey: "departmentId" });
  Equipment.belongsTo(Department, { foreignKey: "departmentId" });

  // MaintenanceTeam associations
  MaintenanceTeam.hasMany(MaintenanceTeamMember, { foreignKey: "teamId" });
  MaintenanceTeam.hasMany(Equipment, { foreignKey: "maintenanceTeamId" });
  MaintenanceTeam.hasMany(MaintenanceRequest, { foreignKey: "teamId" });

  MaintenanceTeamMember.belongsTo(MaintenanceTeam, { foreignKey: "teamId" });
  MaintenanceTeamMember.belongsTo(User, { foreignKey: "userId" });

  // Equipment associations
  Equipment.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
  Equipment.belongsTo(User, {
    foreignKey: "defaultTechnicianId",
    as: "defaultTechnician",
  });
  Equipment.belongsTo(MaintenanceTeam, { foreignKey: "maintenanceTeamId" });
  Equipment.hasMany(MaintenanceRequest, { foreignKey: "equipmentId" });

  // MaintenanceRequest associations
  MaintenanceRequest.belongsTo(Equipment, { foreignKey: "equipmentId" });
  MaintenanceRequest.belongsTo(MaintenanceTeam, { foreignKey: "teamId" });
  MaintenanceRequest.belongsTo(User, {
    foreignKey: "technicianId",
    as: "technician",
  });
  MaintenanceRequest.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  });
  MaintenanceRequest.hasMany(MaintenanceLog, {
    foreignKey: "maintenanceRequestId",
  });

  // MaintenanceLog associations
  MaintenanceLog.belongsTo(MaintenanceRequest, {
    foreignKey: "maintenanceRequestId",
  });
  MaintenanceLog.belongsTo(User, { foreignKey: "technicianId" });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: "userId" });
};

module.exports = setupAssociations;
