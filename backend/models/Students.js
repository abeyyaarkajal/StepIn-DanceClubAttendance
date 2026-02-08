const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Kept for potential future use or if other parts import it, though not used here anymore.

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Invalid phone number, must be 10 digits"],
    },
    password: {
        type: String,
        default: function () {
            return this.rollNumber;
        }
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook removed as per user request to store passwords in plain text

module.exports = mongoose.model("Student", studentSchema);