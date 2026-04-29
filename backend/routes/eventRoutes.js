const express = require("express");
const router = express.Router();

// Temporary sample events.
// Later replace this with MongoDB data.
const events = [
  {
    id: 1,
    title: "Family Reunion",
    date: "March 15, 2026",
    time: "6:00 PM",
    location: "Riyadh Grand Hall",
    status: "Attending",
  },
  {
    id: 2,
    title: "Grandmother's Birthday",
    date: "March 22, 2026",
    time: "4:00 PM",
    location: "Family Home",
    status: "Maybe",
  },
  {
    id: 3,
    title: "Weekend Gathering",
    date: "April 5, 2026",
    time: "3:00 PM",
    location: "Al-Nakheel Park",
    status: "No Response",
  },
];

// GET /api/events
// Returns all family events
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// GET /api/events/:id
// Return one event by ID
router.get("/:id", (req, res) => {
  const eventId = Number(req.params.id);
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

module.exports = router;