// models/assignmentModel.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    link: {
      type: String,
      required: [true, "OneDrive submission link is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
