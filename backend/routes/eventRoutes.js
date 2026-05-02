const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  try {
    const { title, date, time, location, status } = req.body;

    const newEvent = await Event.create({
      title,
      date,
      time,
      location,
      status,
    });

    res.status(201).json({
      success: true,
      data: newEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
});

module.exports = router;