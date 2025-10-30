// controllers/submissionController.js
import Submission from "../models/submissionModel.js";
import Assignment from "../models/assignmentModel.js";
import Group from "../models/groupModel.js";

// @desc Confirm submission by group member
// @route POST /api/submissions/confirm
// @access Student
export const confirmSubmission = async (req, res) => {
  try {
    const { assignmentId, groupId } = req.body;

    if (!assignmentId || !groupId)
      return res.status(400).json({ message: "Assignment and group required" });

    // Verify group membership
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(req.user._id))
      return res.status(403).json({ message: "Not a member of this group" });

    // Check existing submission
    const existing = await Submission.findOne({
      assignment: assignmentId,
      group: groupId,
    });

    if (existing && existing.isSubmitted)
      return res
        .status(400)
        .json({ message: "Submission already confirmed" });

    let submission;
    if (existing) {
      existing.isSubmitted = true;
      existing.submittedAt = new Date();
      existing.confirmedBy = req.user._id;
      submission = await existing.save();
    } else {
      submission = await Submission.create({
        assignment: assignmentId,
        group: groupId,
        confirmedBy: req.user._id,
        isSubmitted: true,
        submittedAt: new Date(),
      });
    }

    res.status(201).json({
      message: "Submission confirmed successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all submissions (Admin)
// @route GET /api/submissions
// @access Admin
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignment", "title dueDate")
      .populate("group", "name")
      .populate("confirmedBy", "name email");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get submissions by assignment (Admin)
// @route GET /api/submissions/assignment/:id
// @access Admin
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.id,
    })
      .populate("group", "name members")
      .populate("confirmedBy", "name email");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my group’s submission status (Student)
// @route GET /api/submissions/my/:assignmentId
// @access Student
export const getMyGroupSubmission = async (req, res) => {
  try {
    const group = await Group.findOne({ members: req.user._id });
    if (!group) return res.status(404).json({ message: "No group found" });

    const submission = await Submission.findOne({
      group: group._id,
      assignment: req.params.assignmentId,
    });

    if (!submission)
      return res.json({
        isSubmitted: false,
        message: "Not submitted yet",
      });

    res.json({
      isSubmitted: submission.isSubmitted,
      submittedAt: submission.submittedAt,
      confirmedBy: submission.confirmedBy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Basic analytics: submission count per assignment
// @route GET /api/submissions/analytics
// @access Admin
export const getSubmissionStats = async (req, res) => {
  try {
    const stats = await Submission.aggregate([
      { $match: { isSubmitted: true } },
      { $group: { _id: "$assignment", total: { $sum: 1 } } },
    ]);

    const populated = await Assignment.populate(stats, {
      path: "_id",
      select: "title dueDate",
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
