import { React, useState, useEffect } from "react";
import "../../style/Mypage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faCartShopping, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

const UserPage = () => {
    const [mannerTemperature, setMannerTemperature] = useState(0); // 매너온도 상태
    const [user, setUser] = useState(null);

    const [userSellHistory, setUserSellHistory] = useState(null);

    const [isMannerOpen, setIsMannerOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isSellOpen, setIsSellOpen] = useState(false);
    const [isBuywOpen, setIsBuywOpen] = useState(false);
    const [isFavOpen, setIsFavOpen] = useState(false);

    const toggleManner = () => setIsMannerOpen(!isMannerOpen);
    const toggleReview = () => setIsReviewOpen(!isReviewOpen);
    const toggleSell = () => setIsSellOpen(!isSellOpen);
    const toggleBuy = () => setIsBuywOpen(!isBuywOpen);
    const toggleFav = () => setIsFavOpen(!isFavOpen);


    useEffect(() => {
        async function fetchUserSellHistory() {
            try {

                const response = await fetch(`http://localhost:8080/products/user/${user.id}`, {
                    method: "GET",
                    headers: {
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserSellHistory(data);
                    console.log(data);
                } else {
                    console.error('Chat creation failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchUserSellHistory();
    }, [isSellOpen]);



    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                    headers: {
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    console.log(data);
                } else {
                    console.error('Chat creation failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchUserInfo();
    }, [])



    useEffect(() => {
        if (user) {
            setMannerTemperature(user.manner || 0);
        }
    }, [user]);



    const calculateBarWidth = () => {
        const maxTemperature = 99;
        const minTemperature = 0;
        const widthPercentage = ((mannerTemperature - minTemperature) / (maxTemperature - minTemperature)) * 99;

        return Math.min(Math.max(widthPercentage, 0), 99);
    };


    if (!user) {
        <div> 로딩중 </div>
        return;
    }

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
                                    <img src={`http://localhost:8080/images/${user.profileImageUrl}`}>
                                    </img>
                            </div>
                        </div>

                        <div className="user-info-profile">

                            <div className="user-info-section1">
                                <span className="user-info-loginId">{user.loginId}</span>
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
                            </div>
                        </div>

                        <div className="user-info-exc">

                        </div>
                    </div>

                    {/* <div className="user-transaction-wrap">


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
                    </div> */}

                    {/* <div className="user-list-wrap">
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
                    </div> */}


                    <div className="user-list-wrap">
                        <ul>

                            <li onClick={toggleSell} className="list-item">
                                <span>판매내역</span>
                                <span className={`list-arrow ${isSellOpen ? 'open' : ''}`}></span>
                            </li>
                            <div className={`slide-content ${isSellOpen ? "open" : ""}`}>
                                {userSellHistory && userSellHistory.length > 0 ? (
                                    userSellHistory.map((product) => (
                                        <Link to={`/product/${product.id}`} className="slide-item">
                                        <div className="sell-item" key={product.id}>
                                            <div className="sell-item-img">
                                                <img
                                                    src={`http://localhost:8080/images/${product.image}`}
                                                    alt={product.title}
                                                />
                                            </div>
                                            <div className="sell-item-info">
                                                <h4 className="sell-item-title">{product.title}</h4>
                                                <p className="sell-item-price">{product.price}원</p>
                                                <p className="sell-item-views">조회수: {product.viewCount}</p>
                                            </div>
                                        </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>판매 내역이 없습니다.</p>
                                )}
                            </div>

                            <li onClick={toggleManner} className="list-item">
                                <span>받은 매너 평가</span>
                                <span className={`list-arrow ${isMannerOpen ? 'open' : ''}`}></span>
                            </li>
                            <div className={`slide-content ${isMannerOpen ? 'open' : ''}`}>
                                <p>매너 평가 내용이 여기에 표시됩니다.</p>
                            </div>

                            <li onClick={toggleReview} className="list-item">
                                <span>받은 거래 후기</span>
                                <span className={`list-arrow ${isReviewOpen ? 'open' : ''}`}></span>
                            </li>
                            <div className={`slide-content ${isReviewOpen ? 'open' : ''}`}>
                                <p>거래 후기 내용이 여기에 표시됩니다.</p>
                            </div>
                        </ul>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default UserPage;