const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success", "maintenance"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ["maintenance_request", "equipment", "user"],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of unread notifications
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
