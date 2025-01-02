import React, { createContext, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 상태 초기화 시 localStorage에서 데이터 복원
  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsAuthenticated(true);
    }
    setIsInitialized(true); // 초기화 완료
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

        // 사용자 데이터 저장
        setIsAuthenticated(true);
        setUserData(userData);

        // localStorage에 저장
        localStorage.setItem("userData", JSON.stringify(userData));

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
      localStorage.removeItem("userData"); // localStorage에서 제거
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
