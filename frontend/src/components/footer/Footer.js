import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../../style/Footer.css';

const Footer = () => {
    return (
        <div id="footer">
            <div className="footer">

                <div className="footer-banner"> 
                    <img src="images/824fdb98f187c532ca3a045c92329cafe4d8899a-1184x1098.webp" alt="" />
                </div>

                <div className="container">

                    <div className="footer-banner-content">
                        <h1>당근에서 가까운 이웃과 함께해요.</h1>
                        <h2>지금 바로 시작하기</h2>
                        <Link to="/login"> 시작하기 </Link>
                    </div>

                    <div className="footer-nav">
                        <div className="footer-logo">
                            <img src="/images/logo.svg" />
                        </div>

                        <div className="footer-category">
                            <ul>
                                <p>회사</p>
                                <li><a href="">회사소개</a></li>
                                <li><a href="">당근페이</a></li>
                                <li><a href="">팀문화</a></li>
                                <li><a href="">서비스 소개</a></li>
                                <li><a href="">블로그</a></li>
                                <li><a href="">채용</a></li>
                            </ul>

                            <ul>
                                <p>탐색
                                </p>
                                <li><a href="">중고 거래</a></li>
                                <li><a href="">부동산</a></li>
                                <li><a href="">중고차</a></li>
                                <li><a href="">알바</a></li>
                                <li><a href="">동네업체</a></li>
                                <li><a href="">동네생활</a></li>
                                <li><a href="">모임</a></li>
                                <li><a href="">채팅하기</a></li>
                                <li><a href="">이웃</a></li>
                            </ul>

                            <ul>
                                <p>비즈니스
                                </p>
                                <li><a href="">당근 비즈니스</a></li>
                                <li><a href="">제휴 문의</a></li>
                                <li><a href="">광고 문의</a></li>
                            </ul>

                            <ul>
                                <p>팀원
                                </p>
                                <li><a href="">이정훈</a></li>
                                <li><a href="">이서원</a></li>
                                <li><a href="">성현아</a></li>
                                <li><a href="">최민우</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-info">
                        <p>&copy; 2024 당근마켓 클론사이트</p>
                        <ul class="footer-links">
                            <li><a href="#">이용약관</a></li>
                            <li><a href="#">개인정보처리방침</a></li>
                            <li><a href="#">문의하기</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Footer;