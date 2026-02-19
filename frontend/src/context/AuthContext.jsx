import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('meditrack_token');
        const storedUser = localStorage.getItem('meditrack_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post('/api/auth/login', { email, password });
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('meditrack_token', newToken);
        localStorage.setItem('meditrack_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return newUser;
    };

    const register = async (name, email, password, role) => {
        const res = await axiosInstance.post('/api/auth/register', { name, email, password, role });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('meditrack_token');
        localStorage.removeItem('meditrack_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
