import { React, useState } from "react";
import "../../style/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div id="header">
            <div className="container">
                <div className="header">

                    <div className="header-nav">
                        <div className="header-logo">
                            <Link to='/'>
                                <img src="images/logo.svg" />
                            </Link>
                        </div>


                        <div className="header-category">
                            <ul>
                                <li><Link to='/'>중고거래</Link></li>
                                <li><Link to='/'>부동산</Link></li>
                                <li><Link to='/'>알바</Link></li>
                                <li><Link to='/'>동네업체</Link></li>
                                <li><Link to='/'>생활모임</Link></li>
                                <li><Link to='/'>모임</Link></li>
                            </ul>
                        </div>


                        <div className="header-user-nav">

                            {true ? (
                                <>
                                    <Link onClick={toggleDropdown}>
                                        <div className="header-user-profile">
                                            <div className="header-user-profile-img">
                                                <img src="/images/profile_default.png" />
                                            </div>
                                            <div className="header-user-profile-loginId">
                                                <span className="header-loginId">매누</span>
                                                <div className="user-menu"></div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="header-user-dropdown">
                                        {isDropdownOpen && (
                                            <div className="dropdown-menu">
                                                <ul>
                                                    <li>마이페이지</li>
                                                    <li>물건 판매하기</li>
                                                    <li>나의 채팅방</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to='/' className="header-user-login-btn">
                                        로그인
                                    </Link>

                                    <Link to='/' className="header-user-signup-btn">
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Header;