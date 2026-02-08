const mongoose = require("mongoose");
const Student = require("./models/Students");

(async () => {
    try {
        await mongoose.connect("mongodb+srv://datahead:natrajdata@attendancedatabase.hzkzpdc.mongodb.net/dance_attendance?retryWrites=true&w=majority");
        console.log("Connected to DB");

        const students = await Student.find({});
        console.log(`Found ${students.length} students. Reseting passwords to roll numbers...`);

        let count = 0;
        for (const s of students) {
            // We want to force the password to be the roll number.
            // Since we removed the pre-save hook, saving it as plain text should work.
            // However, we need to make sure we mark it as modified if it's currently hashed.

            if (s.password !== s.rollNumber) {
                s.password = s.rollNumber;
                await s.save();
                count++;
            }
        }

        console.log(`Reset ${count} passwords.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
