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
    },
    maintenanceTeam: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
    },
    defaultTechnician: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: String,
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
