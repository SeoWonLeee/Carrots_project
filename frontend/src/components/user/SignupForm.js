import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import "../../style/SignupForm.css";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
        passwordcheck: "",
        email: "",
        phone: "",
        birthday: "",
        regionId: "",
    });

    const [passwordError, setPasswordError] = useState(""); // 비밀번호 불일치 메시지 관리
    const navigate = useNavigate(); // useNavigate 훅 사용

    const regions = [
        { id: 1, name: "서울" },
        { id: 2, name: "부산" },
        { id: 3, name: "대구" },
        { id: 4, name: "인천" },
        { id: 5, name: "광주" },
        { id: 6, name: "울산" },
        { id: 7, name: "경기도" },
        { id: 8, name: "강원" },
        { id: 9, name: "충청북도" },
        { id: 10, name: "충청남도" },
        { id: 11, name: "전라북도" },
        { id: 12, name: "전라남도" },
        { id: 13, name: "경상북도" },
        { id: 14, name: "경상남도" },
        { id: 15, name: "제주" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "passwordcheck") {
            if (formData.password !== value) {
                setPasswordError("비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordError("");
            }
        } else if (name === "password") {
            if (formData.passwordcheck && value !== formData.passwordcheck) {
                setPasswordError("비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordError("");
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지

        if (formData.password !== formData.passwordcheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
    
        try {
            const dataToSend = {
                loginId: formData.loginId,
                password: formData.password,
                email: formData.email,
                phone: formData.phone,
                birthday: formData.birthday,
                regionId: formData.regionId,
            };

    
            const response = await axios.post(
                "http://localhost:8080/api/users",
                dataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log('회원가입 성공:', response.data);
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div id="signup-container">
            <div className="container">
                <div className="signup-container">
                    <div className="signup-logo">
                        <img src="images/logo.svg" alt="Logo" />
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="loginId">아이디</label>
                            <input
                                type="text"
                                id="loginId"
                                name="loginId"
                                placeholder="아이디를 입력하세요"
                                value={formData.loginId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="비밀번호를 입력하세요"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="passwordcheck">비밀번호 확인</label>
                            <input
                                type="password"
                                id="passwordcheck"
                                name="passwordcheck"
                                placeholder="비밀번호를 다시 입력하세요"
                                value={formData.passwordcheck}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {passwordError && (
                            <p className="error-message">{passwordError}</p>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="이메일을 입력하세요"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">전화번호</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="전화번호를 입력하세요"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthday">생년월일</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="regionId">지역</label>
                            <select
                                id="regionId"
                                name="regionId"
                                value={formData.regionId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">지역을 선택하세요</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="main-btn-login">
                            회원가입
                        </button>

                        <div className="form-links">
                            <Link to="/login">
                                이미 계정이 있으신가요? 로그인
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
