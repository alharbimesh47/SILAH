const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SILAH API is running",
  });
});

app.use("/api/test", testRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});