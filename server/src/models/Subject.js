import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      minlength: [2, "Subject name must contain at least 2 characters"],
      maxlength: [80, "Subject name cannot exceed 80 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

subjectSchema.index(
  {
    user: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
