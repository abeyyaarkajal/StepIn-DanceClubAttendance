import { useEffect, useState } from "react";
import api from "../api/api";
import { Calendar, User, Check, X, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [statusMap, setStatusMap] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/students");
            setStudents(res.data);
            // Initialize status map with 'PRESENT' by default or empty? 
            // Let's keep it empty to force manual selection or add a 'Mark All Present' button.
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleStatusChange = (studentId, status) => {
        setStatusMap(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const markAll = (status) => {
        const newMap = {};
        students.forEach(s => {
            newMap[s._id] = status;
        });
        setStatusMap(newMap);
    };

    const submitAttendance = async () => {
        if (!date) {
            setMessage({ type: 'error', text: "Please select a date" });
            return;
        }

        const statsToSubmit = Object.entries(statusMap);
        if (statsToSubmit.length === 0) {
            setMessage({ type: 'error', text: "Please mark attendance for at least one student" });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            // Using Promise.all for parallel requests
            await Promise.all(
                statsToSubmit.map(([studentId, status]) =>
                    api.post("/attendance/mark", {
                        studentId,
                        date,
                        status,
                    })
                )
            );

            setMessage({ type: 'success', text: "Attendance marked successfully!" });
            // Optional: clear status map or keep it? Keeping it shows state.
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || "Error marking attendance. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Who Stepped In Today?</h1>
                    <p className="text-slate-400">Record daily attendance for the squad</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm p-2 rounded-xl border border-white/10 shadow-sm">
                    <Calendar className="text-rose-500 ml-2" size={20} />
                    <input
                        type="date"
                        className="border-none bg-transparent outline-none text-white font-medium color-scheme-dark"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {message && (
                <div className={clsx(
                    "p-4 rounded-xl flex items-center gap-3",
                    message.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800/50">
                    <h2 className="font-semibold text-slate-200">The Crew ({students.length})</h2>
                    <div className="flex w-full sm:w-auto gap-2">
                        <button
                            onClick={() => markAll('PRESENT')}
                            className="flex-1 sm:flex-none px-3 py-2 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition text-center"
                        >
                            All In Sync
                        </button>
                        <button
                            onClick={() => markAll('ABSENT')}
                            className="flex-1 sm:flex-none px-3 py-2 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition text-center"
                        >
                            Stage Empty
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-40 items-center justify-center text-rose-400">
                        <Loader2 className="animate-spin mr-2" /> Loading students...
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700/50">
                        {students.map((student) => {
                            const status = statusMap[student._id];
                            return (
                                <div key={student._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-rose-400 font-medium text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{student.name}</p>
                                            <p className="text-xs text-slate-400">{student.rollNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleStatusChange(student._id, 'PRESENT')}
                                            className={clsx(
                                                "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                                status === 'PRESENT'
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/20"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400"
                                            )}
                                        >
                                            <Check size={16} /> Present
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(student._id, 'ABSENT')}
                                            className={clsx(
                                                "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                                status === 'ABSENT'
                                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400 ring-1 ring-rose-500/20"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-400"
                                            )}
                                        >
                                            <X size={16} /> Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="sticky bottom-4 flex justify-end">
                <button
                    onClick={submitAttendance}
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Mark the Beat ✔️
                </button>
            </div>
        </div>
    );
}
