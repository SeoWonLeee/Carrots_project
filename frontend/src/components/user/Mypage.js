import { React, useState, useEffect } from "react";
import "../../style/Mypage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faCartShopping, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

const Mypage = () => {
    const [mannerTemperature, setMannerTemperature] = useState(0); // 매너온도 상태

    useEffect(() => {
        setMannerTemperature(36.5);
    }, []);

    const calculateBarWidth = () => {
        const maxTemperature = 99;
        const minTemperature = 0;
        const widthPercentage = ((mannerTemperature - minTemperature) / (maxTemperature - minTemperature)) * 99;

        return Math.min(Math.max(widthPercentage, 0), 99);
    };
    return (
        <div id="mypage">
            <div className="container">
                <div className="mypage">

                    <div className="mypage-header">
                        <span></span>
                    </div>

                    <div className="user-info-wrap">
                        <div className="user-info-profile-img">
                            <div className="user-profile-img">
                                <Link to='/'>
                                    <img src="images/profile_default.png">
                                    </img>
                                </Link>
                            </div>
                        </div>

                        <div className="user-info-profile">

                            <div className="user-info-section1">
                                <span className="user-info-loginId">userA</span>
                            </div>

                            <div className="user-info-section2">
                                <span className="user-info-sec2">매너온도</span>
                                <div className="manner-container">
                                    <div className="manner-header">
                                        <span className="manner-temperature">{mannerTemperature.toFixed(1)}°C</span>
                                        <span className="manner-emoji">{mannerTemperature >= 36.5 ? "😊" : "😐"}</span>
                                        <div className="basic-temperature">첫 온도 36.5°C</div>
                                        <div className="basic-temperature-icon"></div>
                                    </div>
                                    <div className="manner-bar">
                                        <div
                                            className="manner-bar-filled"
                                            style={{
                                                width: `${calculateBarWidth()}%`,
                                                backgroundColor: mannerTemperature >= 36.5 ? "#4caf50" : "#f44336",
                                            }}
                                        ></div>
                                    </div>
                                    <div className="manner-label"></div>
                                </div>
                            </div>
                            <div className="user-info-section3">
                                <button>
                                    <span>프로필 수정</span>
                                </button>
                            </div>
                        </div>

                        <div className="user-info-exc">

                        </div>
                    </div>

                    <div className="user-transaction-wrap">


                        <div className="user-sell-history">
                            <Link>
                                <div className="user-sell-icon">
                                    <FontAwesomeIcon icon={faShop} className="sell-icon" />
                                </div>
                                <div className="user-icon-text">판매내역</div>
                            </Link>
                        </div>

                        <div className="user-buy-history">
                            <Link>
                                <div className="user-buy-icon">
                                    <FontAwesomeIcon icon={faCartShopping} className="buy-icon" />
                                </div>
                                <div className="user-icon-text">구매내역</div>
                            </Link>
                        </div>
                        <div className="user-like-history">
                            <Link>
                                <div className="user-like-icon">
                                    <FontAwesomeIcon icon={faHandHoldingHeart} className="like-icon" />
                                </div>
                                <div className="user-icon-text">관심내역</div>
                            </Link>
                        </div>
                    </div>

                    <div className="user-list-wrap">
                        <ul>
                            <Link>
                                <li>
                                    <span>받은 매너 평가</span>
                                    <span className="list-arrow"></span>
                                </li>
                            </Link>
                            <Link>
                                <li>
                                    <span>받은 거래 후기</span>
                                    <span className="list-arrow"></span>
                                </li>
                            </Link>
                        </ul>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Mypage;