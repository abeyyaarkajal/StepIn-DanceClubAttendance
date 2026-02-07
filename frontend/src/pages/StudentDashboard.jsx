import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Calendar, CheckCircle2, XCircle, Loader2, User } from 'lucide-react';
import clsx from 'clsx';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/attendance/student/${user.id}?month=${month}&year=${year}`);
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchStats();
    }, [user, month, year]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center text-rose-400">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/50 border border-white/10">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-rose-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800 shadow-lg">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Hello, {user?.name}</h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <User size={16} /> Roll No: {user?.rollNumber}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm">
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-transparent outline-none text-white font-medium cursor-pointer"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-slate-800 text-white">
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-transparent outline-none text-white font-medium cursor-pointer"
                >
                    <option value={2024} className="bg-slate-800 text-white">2024</option>
                    <option value={2025} className="bg-slate-800 text-white">2025</option>
                    <option value={2026} className="bg-slate-800 text-white">2026</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <p className="text-rose-400 text-sm font-medium mb-2">Attendance</p>
                    <div className="text-4xl font-bold text-white">
                        {stats?.percentage || 0}%
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className={clsx("h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]", (stats?.percentage || 0) >= 75 ? "bg-emerald-500 text-emerald-500" : "bg-rose-500 text-rose-500")}
                            style={{ width: `${stats?.percentage || 0}%` }}
                        />
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">In Sync</p>
                        <p className="text-2xl font-bold text-white">{stats?.present || 0}</p>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Missed Steps</p>
                        <p className="text-2xl font-bold text-white">{stats?.absent || 0}</p>
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/10 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Rhythm History</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {stats?.history?.length > 0 ? (
                        stats.history.map((record) => (
                            <div key={record.date} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-slate-500" />
                                    <span className="text-slate-200 font-medium">
                                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                                    record.status === 'PRESENT'
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                )}>
                                    {record.status === 'PRESENT' ? 'In Sync' : 'Out'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">No moves recorded this month.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
