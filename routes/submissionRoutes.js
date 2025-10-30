// routes/submissionRoutes.js
import express from "express";
import {
  confirmSubmission,
  getAllSubmissions,
  getSubmissionsByAssignment,
  getMyGroupSubmission,
  getSubmissionStats,
} from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin, isStudent } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student Routes
router.post("/confirm", protect, isStudent, confirmSubmission);
router.get("/my/:assignmentId", protect, isStudent, getMyGroupSubmission);

// Admin Routes
router.get("/", protect, isAdmin, getAllSubmissions);
router.get("/assignment/:id", protect, isAdmin, getSubmissionsByAssignment);
router.get("/analytics", protect, isAdmin, getSubmissionStats);

export default router;
