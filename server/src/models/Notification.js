import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    type: {
      type: String,
      enum: ["deadline"],
      default: "deadline",
    },

    message: {
      type: String,
      required: true,
      maxlength: 250,
    },

    dueAt: {
      type: Date,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index(
  {
    user: 1,
    task: 1,
    type: 1,
  },
  {
    unique: true,
  },
);

notificationSchema.index({
  user: 1,
  read: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
