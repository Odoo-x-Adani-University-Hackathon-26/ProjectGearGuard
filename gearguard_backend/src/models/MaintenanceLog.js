const maintenanceLogSchema = new Schema(
  {
    maintenanceRequest: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceRequest",
      required: true,
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "assigned",
        "started",
        "completed",
        "note_added",
        "status_changed",
      ],
      required: true,
    },
    note: {
      type: String,
    },
    hoursSpent: {
      type: Number,
      min: 0,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);
