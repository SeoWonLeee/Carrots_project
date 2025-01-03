import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../style/Product.css";

const Product = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1));
    };


    async function createChat() {
        try {
            const formData = new FormData();
            formData.append('productId', productId);
    
            const response = await fetch("http://localhost:8080/talk", {
                method: "POST",
                headers: {
                },
                credentials: "include",
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate('/talk')
            } else {
                console.error('Chat creation failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`http://localhost:8080/products/${productId}`, {
                    method: "GET",
                });
                const data = await response.json();
                setProduct(data);
                console.log("상품 정보 : ", data); 
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        }
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (!product) return;
    
        async function fetchUsers() {
            try {
                if (!product.userId) {
                    console.error("Product에 userId가 없습니다.");
                    return;
                }
    
                const response = await fetch(`http://localhost:8080/api/users/id/${product.userId}`, {
                    method: "GET",
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log("유저 정보 :", data);
                    setUserData(data); 
                } else {
                    console.error('유저 정보를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('유저 정보를 가져오는 중 오류:', error);
            }
        }
    
        fetchUsers();
    }, [product]);



    if (loading) {
        return <div>상품 정보를 로딩 중...</div>;
    }

    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }


    if (!userData) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="product_content">
            <div className="container">
                <div className="prodct_detail-container">
                    <div className="prodct_detail">
                        <div className="product-detail-header">
                            <Link to="/" className="detail-main">홈</Link>
                            <span> &gt; </span>
                            <Link to="/buy-sell" className="detail-category">중고거래</Link>
                            <span> &gt; </span>
                            <span className="detail-title">{product.title}</span>
                        </div>

                        <div className="product_detail_image">
                            <button className="slide-btn prev-btn" onClick={handlePrev}></button>
                            <div className="slider-container">
                                <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                    {product.imageUrls.map((imageUrl, index) => (
                                        <div className="slide-image" key={index}>
                                            <img src={`http://localhost:8080/images/${imageUrl}`} alt={`product ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="slide-btn next-btn" onClick={handleNext}></button>
                            <div className="slider-dots">
                                {product.imageUrls.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        <div className="product_detail_des">
                            <div className="product_detail_des_header">
                                <div className="product_detail_des_header_title">
                                    <h2>{product.title}</h2>
                                </div>
                                <div className="product_detail_des_header_category">
                                    <Link to="/category/appliances">가전제품</Link>
                                    <span> · </span>
                                    <span>31</span>
                                    <span>초 전</span>
                                </div>
                            </div>

                            <div className="product_detail_des_price">
                                <h2>{product.price}원</h2>
                            </div>

                            <div className="product_detail_description">
                                <span className="formatted-text">
                                    {product.description}
                                </span>
                            </div>

                            <div className="product_detail_status">
                                <span>채팅 </span>
                                <span>0</span>
                                <span className="product_detail_status_eof"> · </span>

                                <span>관심 </span>
                                <span>{product.favoriteCount}</span>
                                <span className="product_detail_status_eof"> · </span>

                                <span>조회 </span>
                                <span>{product.viewCount}</span>
                            </div>

                            <div className="product_detail_action">
                                <button onClick={() => createChat()}>당근하기</button>
                            </div>
                        </div>

                        <div className="product_detail_seller">
                            <div className="product_detail_seller_profile_image">
                                <Link to="/seller/1">
                                    <img src={`http://localhost:8080/images/${userData.profileImageUrl}`} alt="Seller Profile" />
                                </Link>
                            </div>
                            <div className="product_detail_seller_info">
                                <Link to="/seller/1" className="seller-id">{userData.loginId}</Link>
                                <Link to="/region/gangnam" className="seller-region">{userData.region}</Link>
                            </div>
                            <div className="product_detail_seller_manner">
                                <div className="manner-container">
                                    <div className="manner-header">
                                        <span className="manner-temperature">{userData.manner}°C</span>
                                        <span className="manner-emoji">😊</span>
                                    </div>
                                    <div className="manner-bar">
                                        <div className="manner-bar-filled"></div>
                                    </div>
                                    <div className="manner-label">매너온도</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prodct-seller-items-container">
                    <div className="prodct-seller-items">
                        <div className="prodct-seller-items-header">
                            <div className="prodct-seller-items-header-tit">
                                <span>최당근</span>
                                <span>의 판매물품</span>
                            </div>
                            <div className="prodct-seller-items-more">
                                <Link to="/seller/1/products">더 구경하기 &gt;</Link>
                            </div>
                        </div>

                        <div className="prodct-seller-items-list">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div className="seller-item" key={item}>
                                    <Link to={`/product/${item}`}>
                                        <div className="seller-item-img-container">
                                            <img src="/img/banner1.png" alt="상품 이미지" />
                                        </div>
                                        <p className="seller-item-items-tit">상품 제목 {item}</p>
                                        <p className="seller-item-items-price">30,000원</p>
                                        <p className="seller-item-items-region">강남구</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="prodct-popular-items-container">
                    <div className="prodct-popular-items">
                        <div className="prodct-seller-items-header">
                            <div className="prodct-seller-items-header-tit">
                                <span>인기매물</span>
                            </div>
                            <div className="prodct-seller-items-more">
                                <Link to="/popular">더 구경하기 &gt;</Link>
                            </div>
                        </div>

                        <div className="prodct-seller-items-list">
                            {[7, 8, 9, 10].map((item) => (
                                <div className="seller-item" key={item}>
                                    <Link to={`/product/${item}`}>
                                        <div className="seller-item-img-container">
                                            <img src="/img/banner1.png" alt="상품 이미지" />
                                        </div>
                                        <p className="seller-item-items-tit">인기 상품 제목 {item}</p>
                                        <p className="seller-item-items-price">50,000원</p>
                                        <p className="seller-item-items-region">강남구</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product;