const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // linked user
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  childrenIds: [{ type: String }],
  parentId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("FamilyMember", familyMemberSchema);