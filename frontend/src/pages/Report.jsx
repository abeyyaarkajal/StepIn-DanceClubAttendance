import { useState } from "react";
import api from "../api/api";
import { FileBarChart, Calendar, Search, Download, AlertTriangle, CheckCircle } from "lucide-react";

export default function Report() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        if (!month || !year) {
            setError("Please select month and year");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.get(`/attendance/report?month=${month}&year=${year}`);
            setData(res.data.report || []);
        } catch (err) {
            setError("Could not fetch report. Please try again.");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-rose-900">Attendance Report</h1>
                    <p className="text-rose-500">View detailed attendance analytics</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm p-6 shadow-sm shadow-slate-900">
                <div className="flex-1 min-w-[200px]">
                    <label className="mb-2 block text-sm font-medium text-slate-300">Month</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full rounded-xl border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-white"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1} className="bg-slate-800">
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="mb-2 block text-sm font-medium text-slate-300">Year</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full rounded-xl border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-white"
                        />
                    </div>
                </div>

                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 font-semibold text-white transition-all shadow-md shadow-rose-900/40 hover:bg-rose-500 hover:-translate-y-0.5 disabled:opacity-70 disabled:shadow-none disabled:hover:translate-y-0"
                >
                    {loading ? "Loading..." : "Generate Report"}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
                    <AlertTriangle size={20} /> {error}
                </div>
            )}

            {data.length > 0 && (
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
                            <thead className="bg-slate-900/50 text-xs uppercase text-rose-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Student Name</th>
                                    <th className="px-6 py-4 font-semibold">Roll Number</th>
                                    <th className="px-6 py-4 font-semibold text-center">Present / Working</th>
                                    <th className="px-6 py-4 font-semibold">Attendance %</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {data.map((row) => (
                                    <tr key={row.studentId} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                                        <td className="px-6 py-4">{row.rollNumber}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-semibold text-white">{row.presentDays}</span>
                                            <span className="text-slate-500 mx-1">/</span>
                                            <span>{row.workingDays}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 rounded-full bg-slate-700 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${row.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${Math.min(row.percentage, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium text-white">{row.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${row.eligible
                                                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                                                }`}>
                                                {row.eligible ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                {row.eligible ? "In Sync ✨" : "Out of Step ⚠️"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && data.length === 0 && !error && (
                <div className="flex h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 text-center text-rose-400 bg-white/50">
                    <FileBarChart size={48} className="mb-4 text-rose-200" />
                    <p>No report generated yet</p>
                    <p className="text-sm">Select a month and year to view attendance records.</p>
                </div>
            )}
        </div>
    );
}
