import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, Search, User, Phone, Hash, Loader2, Edit, Trash2, X, Save } from "lucide-react";
import clsx from "clsx";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        rollNumber: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/students");
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            if (editingId) {
                await api.put(`/students/${editingId}`, form);
            } else {
                await api.post("/students", form);
            }
            setForm({ name: "", phone: "", rollNumber: "" });
            setEditingId(null);
            fetchStudents();
        } catch (error) {
            console.error("Failed to save student", error);
            setError(error.response?.data?.error || "Failed to save student. Please check your inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (student) => {
        setForm({
            name: student.name,
            phone: student.phone,
            rollNumber: student.rollNumber,
        });
        setEditingId(student._id);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setForm({ name: "", phone: "", rollNumber: "" });
        setEditingId(null);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error("Failed to delete student", error);
            alert("Failed to delete student");
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber.includes(search)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Our Crew</h1>
                    <p className="text-slate-400">Manage your dance squad and enrollments</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Add Student Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className={clsx(
                                    "flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm",
                                    editingId ? "bg-amber-500" : "bg-rose-600"
                                )}>
                                    {editingId ? <Edit size={20} /> : <Plus size={20} />}
                                </div>
                                <h2 className="text-xl font-semibold text-white">
                                    {editingId ? "Edit Dancer" : "Add a New Dancer"}
                                </h2>
                            </div>
                            {editingId && (
                                <button onClick={handleCancelEdit} className="text-rose-400 hover:text-rose-600 transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        className="w-full rounded-xl border border-slate-600 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all bg-slate-900/50 text-white placeholder-slate-500"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        className="w-full rounded-xl border border-slate-600 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all bg-slate-900/50 text-white placeholder-slate-500"
                                        placeholder="1234567890"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Roll Number</label>
                                <div className="relative">
                                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        className="w-full rounded-xl border border-slate-600 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all bg-slate-900/50 text-white placeholder-slate-500"
                                        placeholder="ROLL123"
                                        value={form.rollNumber}
                                        onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={clsx(
                                    "mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-pink-200 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5",
                                    editingId ? "bg-amber-400 hover:bg-amber-500" : "bg-pink-500 hover:bg-pink-600"
                                )}
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18} /> : <Plus size={18} />)}
                                {editingId ? "Update Student" : "Add Student"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Students List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-white placeholder-slate-500"
                            placeholder="Search students by name or roll number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex h-40 items-center justify-center text-rose-400">
                            <Loader2 className="animate-spin mr-2" /> Loading students...
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-12 text-center text-slate-500 bg-slate-800/30">
                            <User size={48} className="mb-4 text-slate-600" />
                            <p>No students found</p>
                            <p className="text-sm">Try adjusting your search or add a new student.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {filteredStudents.map((student) => (
                                <div key={student._id} className={clsx(
                                    "group relative flex items-start gap-4 rounded-xl border bg-slate-800/80 p-4 transition-all duration-300",
                                    editingId === student._id
                                        ? "border-amber-500/50 ring-2 ring-amber-500/20 shadow-lg"
                                        : "border-slate-700 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-900/20 hover:-translate-y-1"
                                )}>
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-rose-400">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white group-hover:text-rose-400 transition-colors">{student.name}</h3>
                                        <p className="text-sm text-slate-400">{student.rollNumber}</p>
                                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                                            <Phone size={12} /> {student.phone}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(student)}
                                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition"
                                            title="Edit Student"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student._id)}
                                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                                            title="Delete Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
