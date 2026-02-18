const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CHANGE_TYPES = ["price", "stock", "promotion"];
const CHANGE_STATUSES = ["pending", "approved", "rejected"];

const pendingChangeSchema = new Schema(
  {
    changeType: {
      type: String,
      required: true,
      enum: CHANGE_TYPES,
    },
    producto: {
      type: Schema.Types.ObjectId,
      ref: "producto",
      required: true,
    },
    proposedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: CHANGE_STATUSES,
      default: "pending",
    },
    oldValue: {
      type: Number,
      required: true,
    },
    newValue: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingChange", pendingChangeSchema);
