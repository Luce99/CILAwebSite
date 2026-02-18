const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NOTIFICATION_TYPES = ["pending_approval", "change_approved", "change_rejected"];

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: NOTIFICATION_TYPES,
  },
  pendingChange: {
    type: Schema.Types.ObjectId,
    ref: "PendingChange",
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
