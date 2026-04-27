import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
// @ts-ignore 
import { refreshToken } from '@/api/authServices';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const login = (accessToken, refreshToken, pk) => {
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('myId', pk);
    };
    const logout = () => {
        setToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('myId');
    };
    const refreshAuthToken = async () => {
        const currentRefreshToken = localStorage.getItem('refreshToken');
        if (!currentRefreshToken) {
            logout();
            return;
        }
        await refreshToken(currentRefreshToken, (data) => {
            const newAccessToken = data.accessToken || data.access;
            const newRefreshToken = data.refreshToken || data.refresh;
            if (newAccessToken) {
                setToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);
            }
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
        });
    };
    useEffect(() => {
        if (!token)
            return;
        // Cada 1 minuto
        // TODO: Estaría bien hacerlo sólo cuando falla el token de acceso
        const REFRESH_INTERVAL = 1 * 60 * 1000;
        const intervalId = setInterval(() => {
            refreshAuthToken();
        }, REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, [token]);
    return (_jsx(AuthContext.Provider, { value: { token, login, logout, refreshAuthToken, isAuthenticated: !!token }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
