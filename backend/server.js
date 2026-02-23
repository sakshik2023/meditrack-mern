const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware — allow configured frontend origin (or all origins in dev)
app.use(
    cors({
        origin: "https://meditrack-frontend-eta.vercel.app || "*",
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "MediTrack API is running..." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
