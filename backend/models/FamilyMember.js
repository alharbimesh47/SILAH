const mongoose = require("mongoose");

/**
 * FamilyMember Schema
 * Designed for building a hierarchical family tree structure.
 */
const familyMemberSchema = new mongoose.Schema({
  // Unique identifier for the tree node (often used by frontend tree libraries)
  nodeId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Link to a User account if the family member has registered for the app
  // This allows the tree to pull 'real' profile data or link to a dashboard
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },

  name: { 
    type: String, 
    required: true 
  },

  // URL for the profile picture (can be a placeholder or a cloud storage link)
  imageUrl: { 
    type: String, 
    default: "" 
  },

  // Array of nodeIds representing this person's children
  // This enables "Top-Down" traversal of the tree
  childrenIds: [{ 
    type: String 
  }],

  // Reference to the parent's nodeId
  // This enables "Bottom-Up" traversal (finding ancestors)
  parentId: { 
    type: String, 
    default: null 
  },
}, { 
  // Automatically manages 'createdAt' and 'updatedAt'
  timestamps: true 
});

/**
 * Model Export
 * Represents a single node within the global family hierarchy.
 */
module.exports = mongoose.model("FamilyMember", familyMemberSchema);
