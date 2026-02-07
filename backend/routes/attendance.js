const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Students");
const { isWeekend, getWorkingDays } = require("../utils/dateUtils");
const router = express.Router();

// 📝 Mark attendance
router.post("/mark", async (req, res) => {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (isWeekend(date)) {
        return res.status(400).json({
            error: "Attendance cannot be marked on weekends",
        });
    }

    try {
        const student = await Student.findById(studentId);
        if (!student || !student.isActive) {
            return res.status(404).json({ error: "Invalid or inactive student" });
        }

        const attendance = await Attendance.create({
            studentId,
            date,
            status,
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/report", async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required" });
    }

    const workingDays = getWorkingDays(Number(month), Number(year));

    const students = await Student.find({ isActive: true });

    const report = [];

    for (const student of students) {
        const attendanceCount = await Attendance.countDocuments({
            studentId: student._id,
            status: "PRESENT",
            date: {
                $gte: new Date(year, month - 1, 1),
                $lte: new Date(year, month, 0),
            },
        });

        const percentage = workingDays
            ? Math.round((attendanceCount / workingDays) * 100)
            : 0;

        report.push({
            studentId: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            presentDays: attendanceCount,
            workingDays,
            percentage,
            eligible: percentage >= 60,
        });
    }

    res.json({
        month,
        year,
        report,
    });
});

// Get attendance for a specific student
router.get("/student/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const { month, year } = req.query; // Optional filters

        if (!month || !year) {
            // Default to current month if not provided
            // But for consistency with frontend, let's require or default there.
            // Let's rely on frontend sending it.
            return res.status(400).json({ error: "Month and year are required" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendanceRecords = await Attendance.find({
            studentId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
        const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;

        // Calculate working days (excluding weekends) up to today or end of month
        // This is a simplified calculation. Ideally, we should count distinct dates marked for *any* student or follow a calendar.
        // Re-using getWorkingDays utility
        const totalWorkingDays = getWorkingDays(Number(month), Number(year));

        const percentage = totalWorkingDays > 0
            ? Math.round((presentCount / totalWorkingDays) * 100)
            : 0;

        res.json({
            present: presentCount,
            absent: absentCount,
            percentage,
            totalWorkingDays,
            history: attendanceRecords.map(r => ({
                date: r.date,
                status: r.status
            }))
        });

    } catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;