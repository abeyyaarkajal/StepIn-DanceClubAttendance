import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');
        const savedUser = localStorage.getItem('user');

        if (token && savedRole && savedUser) {
            setRole(savedRole);
            setUser(JSON.parse(savedUser));
            // Set default headers for axios
            // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
            // Note: If you have an interceptor in api.js, ensure it reads from localStorage
        }
        setLoading(false);
    }, []);

    const login = async (username, password, selectedRole) => {
        try {
            const res = await api.post('/auth/login', { username, password, role: selectedRole });
            const { token, role, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setRole(role);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
