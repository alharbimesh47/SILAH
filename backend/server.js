const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// --- Import Database Connection & Route Handlers ---
const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const familyRoutes = require("./routes/familyRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// --- Middleware Configuration ---

// Enable Cross-Origin Resource Sharing (allows your frontend to talk to this API)
app.use(cors());

/** * Body Parsers:
 * We set the limit to 10mb to accommodate Base64 image uploads in the Gallery.
 * Without this, large image strings would trigger a 'Payload Too Large' error.
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Establish connection to MongoDB
connectDB();

// --- API Routes ---

// Health check route to verify the API is online
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SILAH API is running",
  });
});

/**
 * Route Delegation:
 * Each module is prefixed with /api/ to keep the namespace clean.
 */
app.use("/api/test", testRoutes);
app.use("/api/events", eventRoutes);    // Handles RSVP and event scheduling
app.use("/api/auth", authRoutes);        // Handles Login and Registration
app.use("/api/family", familyRoutes);    // Handles Member profiles and Tree data
app.use("/api/gallery", galleryRoutes);  // Handles Photo uploads and retrieval

// --- Server Startup ---

// Define the port from environment variables or default to 5050
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
