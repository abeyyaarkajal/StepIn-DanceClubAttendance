import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Users, Music } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-16 min-h-screen bg-slate-900 text-slate-50">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center space-y-6 py-16 md:py-24">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-rose-400 text-sm font-medium border border-rose-500/20">
                    <Sparkles size={16} />
                    <span>Welcome to the future of dance</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    Step<span className="text-rose-600">In</span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
                    Effortlessly manage your crew, track the rhythm, and keep everyone in sync.
                    Professional, simple, and built for dancers.
                </p>

                <div className="flex gap-4 pt-4">
                    <Link
                        to="/students"
                        className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-rose-900/50 hover:bg-rose-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        Get Started <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Features Preview */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:border-rose-500/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-rose-400 mb-4">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Crew Management</h3>
                    <p className="text-slate-300">Easily add, edit, and organize your dancers with our intuitive interface.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:border-rose-500/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 bg-rose-600/20 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                        <Music size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Beat Tracking</h3>
                    <p className="text-slate-300">Mark attendance in seconds. Who's in sync? Who's missing the beat?</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:border-rose-500/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-amber-400 mb-4">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Performance Reports</h3>
                    <p className="text-slate-300">Generate detailed monthly reports to track progress and dedication.</p>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-bold text-white">From the Team Behind StepIn</h2>
                    <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-xl">
                        <Heart className="absolute top-8 right-8 text-rose-500/10" size={120} />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-rose-600 border-4 border-slate-800 shadow-md overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
                                K
                            </div>

                            <blockquote className="text-xl text-slate-300 font-medium italic">
                                "I built StepIn with a simple mission: to make the mundane task of attendance tracking a delightful experience. Every pixel is crafted with care, just for you."
                            </blockquote>

                            <div>
                                <h4 className="text-lg font-bold text-white">Kajal Kukreja</h4>
                                <p className="text-rose-500 text-sm font-medium">Lead Developer & Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
