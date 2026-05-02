const express = require("express");
const router = express.Router();
const FamilyMember = require("../models/FamilyMember");
const User = require("../models/User");

// GET /api/family — all nodes formatted for the tree
router.get("/", async (req, res) => {
  try {
    const members = await FamilyMember.find();
    const nodes = {};
    members.forEach(m => {
      nodes[m.nodeId] = {
        id: m.nodeId,
        name: m.name,
        imageUrl: m.imageUrl,
        childrenIds: m.childrenIds,
        userId: m.userId,
        parentId: m.parentId,
      };
    });
    res.status(200).json({ success: true, data: nodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/family/available-users — approved users not yet in the tree
router.get("/available-users", async (req, res) => {
  try {
    const membersInTree = await FamilyMember.find({ userId: { $ne: null } }).select("userId");
    const usedUserIds = membersInTree.map(m => m.userId.toString());

    const availableUsers = await User.find({
      status: "approved",
      _id: { $nin: usedUserIds },
    }).select("fullName email");

    res.status(200).json({ success: true, data: availableUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/family — add a user to the tree
router.post("/", async (req, res) => {
  try {
    const { userId, parentId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate a unique nodeId
    const nodeId = new Date().getTime().toString();

    const member = await FamilyMember.create({
      nodeId,
      userId: user._id,
      name: user.fullName,
      imageUrl: user.imageUrl || "",
      childrenIds: [],
      parentId: parentId || null,
    });

    // Add to parent's childrenIds
    if (parentId) {
      await FamilyMember.findOneAndUpdate(
        { nodeId: parentId },
        { $push: { childrenIds: nodeId } }
      );
    }

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/family/:nodeId
router.delete("/:nodeId", async (req, res) => {
  try {
    await FamilyMember.findOneAndDelete({ nodeId: req.params.nodeId });
    await FamilyMember.updateMany(
      { childrenIds: req.params.nodeId },
      { $pull: { childrenIds: req.params.nodeId } }
    );
    res.status(200).json({ success: true, message: "Member removed from tree" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;