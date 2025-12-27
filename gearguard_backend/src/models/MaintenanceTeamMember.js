// models/MaintenanceTeamMember.js
const mongoose = require("mongoose");

const maintenanceTeamMemberSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "maintenance_team_members",
    timestamps: false, // same as Sequelize timestamps: false
  }
);

module.exports = mongoose.model(
  "MaintenanceTeamMember",
  maintenanceTeamMemberSchema
);
