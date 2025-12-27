const maintenanceRequestSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
      required: true,
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    requestType: {
      type: String,
      enum: ["corrective", "preventive"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "scrap",
      ],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    scheduledDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: [
      {
        content: String,
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    partsUsed: [
      {
        name: String,
        quantity: Number,
        cost: Number,
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
maintenanceRequestSchema.index({ status: 1, priority: -1 });
maintenanceRequestSchema.index({ equipment: 1, createdAt: -1 });
maintenanceRequestSchema.index({ technician: 1, status: 1 });

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
