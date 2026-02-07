import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, CalendarCheck, BarChart3, Heart, Home, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { pathname } = useLocation();
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navItems = [
        { path: "/", label: "Home", icon: Home, public: true },
        // Admin Links
        { path: "/students", label: "Our Crew", icon: Users, roles: ['admin'] },
        { path: "/attendance", label: "The Beat", icon: CalendarCheck, roles: ['admin'] },
        { path: "/report", label: "Performance", icon: BarChart3, roles: ['admin'] },
        // Student Links
        { path: "/my-attendance", label: "My Rhythm", icon: LayoutDashboard, roles: ['student'] },
    ];

    const filteredItems = navItems.filter(item => {
        if (item.public) return true;
        if (!user) return false;
        return item.roles.includes(role);
    });

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                        <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-slate-700 shadow-lg shadow-rose-500/20">
                            <img src="/logo.jpg" alt="StepIn Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">StepIn</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex gap-1">
                            {filteredItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                                            isActive
                                                ? "bg-slate-800 text-rose-400 shadow-sm ring-1 ring-slate-700"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon size={18} className={clsx(isActive ? "text-rose-500" : "text-slate-400 group-hover:text-slate-200")} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-slate-800"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900 absolute w-full left-0 animate-fade-in shadow-2xl">
                    <div className="p-4 space-y-2">
                        {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all",
                                        isActive
                                            ? "bg-slate-800 text-rose-400 border border-slate-700"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <Icon size={20} className={clsx(isActive ? "text-rose-500" : "text-slate-500")} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}

                        <div className="pt-2 mt-2 border-t border-slate-800">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium rounded-xl bg-rose-600 text-white shadow-lg hover:bg-rose-700"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
