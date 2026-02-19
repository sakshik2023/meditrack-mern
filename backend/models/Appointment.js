const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        department: {
            type: String,
            required: true,
            enum: [
                "Cardiology",
                "Dermatology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "Psychiatry",
                "Radiology",
                "General Medicine",
                "ENT",
                "Ophthalmology",
            ],
        },
        doctorName: { type: String, required: true, trim: true },
        patientName: { type: String, required: true, trim: true },
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
