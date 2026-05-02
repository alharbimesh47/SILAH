const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");

// GET /api/gallery
router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/gallery
router.post("/", async (req, res) => {
  try {
    const { imageUrl, uploadedBy } = req.body;
    const photo = await Photo.create({ imageUrl, uploadedBy });
    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/gallery/:id
router.delete("/:id", async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Photo deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;