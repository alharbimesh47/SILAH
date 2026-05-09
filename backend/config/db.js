const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using Mongoose.
 * This function is designed to be called once during server startup.
 */
async function connectDB() {
  try {
    // 1. Check for Environment Variable
    // Safety check: Prevents the app from crashing if the connection string is missing.
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI not found. Database not connected yet.");
      return;
    }

    // 2. Attempt Connection
    // 'await' ensures the script waits for a successful handshake before moving forward.
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("MongoDB connected");
  } catch (error) {
    // 3. Error Handling
    // Logs the specific reason for failure (e.g., wrong password, network timeout).
    console.error("MongoDB connection failed:", error.message);
    
    // Optional: In production, you might want to exit the process if the DB is critical
    // process.exit(1);
  }
}

module.exports = connectDB;
// const mongoose = require("mongoose");
// async function connectDB() {
//   try {
//     if (!process.env.MONGO_URI) {
//       console.log("MONGO_URI not found. Database not connected yet.");
//       return;
//     }
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;