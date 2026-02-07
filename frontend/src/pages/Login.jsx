import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function Login() {
    const [role, setRole] = useState('student'); // 'student' or 'admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await login(username, password, role);
        setLoading(false);

        if (res.success) {
            if (role === 'admin') {
                navigate('/students');
            } else {
                navigate('/my-attendance');
            }
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-900/50 border border-white/10 overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-slate-300">Login to access your dashboard</p>
                    </div>

                    {/* Role Toggles */}
                    <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-700">
                        <button
                            onClick={() => setRole('student')}
                            className={clsx(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                                role === 'student' ? "bg-slate-700 text-rose-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            Dancer
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={clsx(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                                role === 'admin' ? "bg-slate-700 text-rose-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">
                                    {role === 'admin' ? 'Username' : 'Roll Number'}
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-slate-900/80 transition-all text-white placeholder-slate-500"
                                        placeholder={role === 'admin' ? "Enter username" : "Enter your roll number"}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-slate-900/80 transition-all text-white placeholder-slate-500"
                                        placeholder="Enter password"
                                    />
                                </div>
                                {role === 'student' && (
                                    <p className="mt-1 text-xs text-slate-400">Default password is your Roll Number</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-rose-900/40 hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Login <ArrowRight size={20} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
