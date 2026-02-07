import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;
