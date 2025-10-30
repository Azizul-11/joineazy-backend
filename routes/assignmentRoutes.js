// routes/assignmentRoutes.js
import express from "express";
import {
  createAssignment,
  updateAssignment,
  getAssignments,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createAssignment);
router.put("/:id", protect, isAdmin, updateAssignment);
router.get("/", protect, getAssignments);

export default router;
