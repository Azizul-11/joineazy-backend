// controllers/groupController.js
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";

// @desc Create a new group
// @route POST /api/groups
// @access Student
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) return res.status(400).json({ message: "Group name required" });

    // const existing = await Group.findOne({ name });
    const existing = await Group.findOne({ name: new RegExp(`^${name}$`, "i") });

    if (existing)
      return res.status(400).json({ message: "Group name already taken" });
    
    const group = await Group.create({
      name,
      createdBy: req.user._id,
      members: members ? [...new Set([req.user._id, ...members])] : [req.user._id],
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add member to group
// @route PUT /api/groups/:id/add
// @access Student
// export const addMember = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const userToAdd = await User.findOne({ email });
//     if (!userToAdd)
//       return res.status(404).json({ message: "User not found" });

//     const group = await Group.findById(req.params.id);
//     if (!group) return res.status(404).json({ message: "Group not found" });

//     if (!group.members.includes(req.user._id))
//       return res.status(403).json({ message: "Not authorized" });

//     if (group.members.includes(userToAdd._id))
//       return res.status(400).json({ message: "User already in group" });

//     group.members.push(userToAdd._id);
//     await group.save();

//     res.json({ message: "Member added", group });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @desc Add member to group
// @route PUT /api/groups/:id/add
// @access Student
export const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check if user exists
    const userToAdd = await User.findOne({ email });
    if (!userToAdd)
      return res.status(404).json({ message: "User not found" });

    // 2️⃣ Get group by ID
    const group = await Group.findById(req.params.id);
    if (!group)
      return res.status(404).json({ message: "Group not found" });

    // 3️⃣ Ensure logged-in user is in that group (authorization)
    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );
    if (!isMember)
      return res.status(403).json({ message: "Not authorized, not in this group" });

    // 4️⃣ Prevent adding same member again
    const alreadyExists = group.members.some(
      (memberId) => memberId.toString() === userToAdd._id.toString()
    );
    if (alreadyExists)
      return res.status(400).json({ message: "User already in group" });

    // 5️⃣ Add new member
    group.members.push(userToAdd._id);
    await group.save();

    // 6️⃣ Populate to return updated data
    const updatedGroup = await Group.findById(group._id).populate(
      "members",
      "name email"
    );

    res.json({ message: "Member added", group: updatedGroup });
  } catch (error) {
    console.error("Error in addMember:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc Get all groups (Admin only)
// @route GET /api/groups
// @access Admin
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's group
// @route GET /api/groups/my
// @access Student
export const getMyGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ members: req.user._id }).populate(
      "members",
      "name email"
    );
    if (!group) return res.status(404).json({ message: "No group found" });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
