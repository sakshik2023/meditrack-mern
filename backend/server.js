const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // your frontend
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "DocTracker API is running..." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
