const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const equipmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null // Make it optional
    },
    
    maintenanceTeam: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
      default: null // Make it optional
    },
    
    defaultTechnician: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null // Make it optional
    },
    
    location: {
      type: String,
      default: null // Make it optional
    },
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyEndDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "under_maintenance", "scrapped"],
      default: "active",
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
    },
    maintenanceHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "MaintenanceRequest",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
