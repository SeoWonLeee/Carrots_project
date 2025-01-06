import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from './AuthContext.js';
import '../../style/LoginForm.css';

const LoginForm = () => {
    const { login } = useAuth();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(loginId, password);
    };

        return (
            <div id="login-container">
                <div className="container">
                    <div className="login-container">
                        <div className="login-logo">
                            <img src="images/logo.svg" alt="Logo" />
                        </div>

                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="loginId">아이디</label>
                                <input
                                    type="text"
                                    id="loginId"
                                    name="loginId"
                                    placeholder="아이디를 입력하세요"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>


                            <button type="submit" className="main-btn-login">
                                로그인
                            </button>

                            <div className="form-links">
                                <a href="#">비밀번호 찾기</a>
                                <a href="signup.html">회원가입</a>
                            </div>

                            <div className="social-login">
                                <div className="social-buttons">
                                    <button type="button" className="social-btn google-btn">
                                        <FontAwesomeIcon icon={faGoogle} />
                                    </button>
                                    <button type="button" className="social-btn facebook-btn">
                                        <FontAwesomeIcon icon={faFacebookF} />
                                    </button>
                                    <button type="button" className="social-btn kakao-btn">
                                        <FontAwesomeIcon icon={faComment} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    export default LoginForm;