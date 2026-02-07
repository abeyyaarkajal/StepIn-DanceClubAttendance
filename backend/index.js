const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://your-frontend-name.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Dance Club Attendance API running");
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const studentRoutes = require("./routes/students");
app.use("/students", studentRoutes);
const attendanceRoutes = require("./routes/attendance");
app.use("/attendance", attendanceRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://datahead:natrajdata@attendancedatabase.hzkzpdc.mongodb.net/dance_attendance?retryWrites=true&w=majority"
        );

        console.log("✅ MongoDB connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
    }
};

startServer();