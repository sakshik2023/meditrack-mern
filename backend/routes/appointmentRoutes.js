const express = require("express");
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// POST /api/appointments - Patient only
router.post("/", protect, restrictTo("patient"), bookAppointment);

// GET /api/appointments - Patient & Doctor
router.get("/", protect, restrictTo("patient", "doctor"), getAppointments);

// PUT /api/appointments/:id - Doctor only
router.put("/:id", protect, restrictTo("doctor"), updateAppointmentStatus);

module.exports = router;
