const Appointment = require("../models/Appointment");

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Patient only
const bookAppointment = async (req, res) => {
    try {
        const { department, doctorName, date, timeSlot } = req.body;

        if (!department || !doctorName || !date || !timeSlot) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const appointment = await Appointment.create({
            department,
            doctorName,
            patientName: req.user.name,
            patientId: req.user._id,
            date,
            timeSlot,
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get appointments (filtered by role)
// @route   GET /api/appointments
// @access  Patient & Doctor
const getAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === "patient") {
            // Patients see their own appointments
            appointments = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
        } else if (req.user.role === "doctor") {
            // Doctors see appointments where doctorName matches their name
            appointments = await Appointment.find({ doctorName: req.user.name }).sort({ createdAt: -1 });
        }

        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Approve or reject an appointment
// @route   PUT /api/appointments/:id
// @access  Doctor only
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Only the assigned doctor can update the status
        if (appointment.doctorName !== req.user.name) {
            return res.status(403).json({ message: "Not authorized to update this appointment" });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ message: `Appointment ${status} successfully`, appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
