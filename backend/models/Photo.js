const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true }, // user fullName
}, { timestamps: true });

module.exports = mongoose.model("Photo", photoSchema);