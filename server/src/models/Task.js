import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must contain at least 2 characters"],
      maxlength: [120, "Task title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "Status must be pending or completed",
      },
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({
  user: 1,
  deadline: 1,
});

taskSchema.index({
  user: 1,
  status: 1,
});

taskSchema.index({
  user: 1,
  subject: 1,
});

taskSchema.pre("save", function () {
  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status === "pending") {
    this.completedAt = null;
  }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
