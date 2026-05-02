const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const newUser = await User.create({
      fullName,
      email,
      password, // ⚠️ plain text for now, we'll hash later
      role,
      status: role === "admin" ? "approved" : "pending", // admins auto-approved
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (user.status === "pending") {
      return res.status(403).json({ success: false, message: "Your account is pending admin approval." });
    }

    if (user.status === "rejected") {
      return res.status(403).json({ success: false, message: "Your account has been rejected." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/pending — admin fetches pending users
router.get("/pending", async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/approve/:id — admin approves or rejects
router.put("/approve/:id", async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/profile/:id
router.put("/profile/:id", async (req, res) => {
  try {
    const { fullName, imageUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, imageUrl },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Sync with family tree node
    const FamilyMember = require("../models/FamilyMember");
    const familyMember = await FamilyMember.findOne({ userId: user._id });
    console.log("Family member found:", familyMember);

    if (familyMember) {
      await FamilyMember.findOneAndUpdate(
        { userId: user._id },
        { imageUrl, name: fullName }
      );
      console.log("Family member updated!");
    } else {
      console.log("No family member found for userId:", user._id);
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;



