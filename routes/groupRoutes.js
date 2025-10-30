// routes/groupRoutes.js
import express from "express";
import {
  createGroup,
  addMember,
  getAllGroups,
  getMyGroup,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin, isStudent } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, isStudent, createGroup);
router.put("/:id/add", protect, isStudent, addMember);
router.get("/", protect, isAdmin, getAllGroups);
router.get("/my", protect, isStudent, getMyGroup);

export default router;
