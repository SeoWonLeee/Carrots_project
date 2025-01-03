import React, { createContext, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserData = sessionStorage.getItem("userData");
        if (savedUserData) {
            setUserData(JSON.parse(savedUserData));
            setIsAuthenticated(true);
        }
        setIsInitialized(true);
    }, []);

    const login = async (loginId, password) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                { loginId, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.status === "SUCCESS") {
                const userData = {
                    id: response.data.id,
                    loginId: response.data.loginId,
                    email: response.data.email,
                    profileImageUrl: response.data.profileImageUrl,
                    region: response.data.region,
                    phone: response.data.phone,
                    createdAt: response.data.createdAt,
                    failedLoginAttemptsCount: response.data.failedLoginAttemptsCount,
                };

                setIsAuthenticated(true);
                setUserData(userData);
                sessionStorage.setItem("userData", JSON.stringify(userData));
                alert("로그인 성공");
                navigate("/");
            } else {
                alert(response.data.message || "로그인 실패");
            }
        } catch (error) {
            console.error("로그인 실패 : ", error.response?.data?.message || error.message);
            alert("로그인 실패");
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUserData(null);
            sessionStorage.removeItem("userData");
            navigate("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ userData, isAuthenticated, isInitialized, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
