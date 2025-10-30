// // controllers/assignmentController.js
// import Assignment from "../models/assignmentModel.js";

// // @desc Create new assignment
// // @route POST /api/assignments
// // @access Admin
// export const createAssignment = async (req, res) => {
//   try {
//     const { title, description, dueDate, link, assignedGroups } = req.body;

//     if (!title || !description || !dueDate || !link)
//       return res.status(400).json({ message: "All fields required" });

//     const assignment = await Assignment.create({
//       title,
//       description,
//       dueDate,
//       link,
//       createdBy: req.user._id,
//       assignedGroups: assignedGroups || [],
//     });

//     res.status(201).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Update assignment
// // @route PUT /api/assignments/:id
// // @access Admin
// export const updateAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.id);
//     if (!assignment)
//       return res.status(404).json({ message: "Assignment not found" });

//     Object.assign(assignment, req.body);
//     const updated = await assignment.save();
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get all assignments
// // @route GET /api/assignments
// // @access Public (Students see assigned)
// export const getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find()
//       .populate("createdBy", "name email")
//       .populate("assignedGroups", "name");
//     res.json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// controllers/assignmentController.js
import Assignment from "../models/assignmentModel.js";

// @desc Create new assignment
// @route POST /api/assignments
// @access Admin
export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, link, assignedGroups } = req.body;

    if (!title || !description || !dueDate || !link)
      return res.status(400).json({ message: "All fields required" });

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      link,
      createdBy: req.user._id, // the admin creating it
      assignedGroups: assignedGroups || [],
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update assignment
// @route PUT /api/assignments/:id
// @access Admin
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // ✅ Allow only the admin who created it to update
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this assignment" });
    }

    Object.assign(assignment, req.body);
    const updated = await assignment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all assignments
// @route GET /api/assignments
// @access Admin / Student
export const getAssignments = async (req, res) => {
  try {
    let filter = {};

    // ✅ Admins see only their own assignments
    if (req.user.role === "admin") {
      filter = { createdBy: req.user._id };
    }

    // ✅ Students see all assignments
    const assignments = await Assignment.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedGroups", "name");

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
