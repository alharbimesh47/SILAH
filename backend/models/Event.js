const mongoose = require("mongoose");

/**
 * Event Schema
 * Defines the structure for family events (reunions, birthdays, etc.)
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Automatically removes leading/trailing whitespace
    },
    // Note: Storing date as a String for simpler formatting from the frontend, 
    // but consider Date type if you need to perform complex range queries later.
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // Sets initial value for new events; common values might be "Attending", "Pending", etc.
      default: "No Response",
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    // Useful for showing "Recently Added" events on the dashboard
    timestamps: true,
  }
);

// Export the model as "Event"
// Mongoose will look for a collection named "events" (pluralized) in MongoDB
module.exports = mongoose.model("Event", eventSchema);
