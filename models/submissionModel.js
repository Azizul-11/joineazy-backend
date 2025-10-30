// models/submissionModel.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // student who confirmed
      required: true,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
