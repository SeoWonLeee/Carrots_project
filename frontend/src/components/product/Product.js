import React from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation 추가

import "../../style/Product.css";

const Product = () => {
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
                            <Link to="/product/1" className="detail-title">전기히터</Link>
                        </div>

                        <div className="product_detail_image">
                            <button className="slide-btn prev-btn">이전</button>
                            <div className="slider-container">
                                <div className="slider-track">
                                    <img src="/img/image1.jpg" alt="Product Image 1" className="slide-image" />
                                    <img src="/img/image2.jpg" alt="Product Image 2" className="slide-image" />
                                    <img src="/img/val-vesa-aZhh25l8bNQ-unsplash.jpg" alt="Product Image 3" className="slide-image" />
                                </div>
                            </div>
                            <button className="slide-btn next-btn">다음</button>
                            <div className="slider-dots"></div>
                        </div>

                        <div className="product_detail_des">
                            <div className="product_detail_des_header">
                                <div className="product_detail_des_header_title">
                                    <h2>전기히터</h2>
                                </div>
                                <div className="product_detail_des_header_category">
                                    <Link to="/category/appliances">가전제품</Link>
                                    <span> · </span>
                                    <span>31</span>
                                    <span>초 전</span>
                                </div>
                            </div>

                            <div className="product_detail_des_price">
                                <h2>35,000원</h2>
                            </div>

                            <div className="product_detail_description">
                                <span className="formatted-text">
                                    12/10 구매후 연결만해봤습니다. 실사용감 제로입니다. 새거라고 보시면 됩니다. 게임패드 하나 더 필요해서 놔뒀는데 필요없어져서 판매합니다.
                                </span>
                            </div>

                            <div className="product_detail_status">
                                <span>채팅 </span>
                                <span>0</span>
                                <span className="product_detail_status_eof"> · </span>

                                <span>관심 </span>
                                <span>0</span>
                                <span className="product_detail_status_eof"> · </span>

                                <span>조회 </span>
                                <span>0</span>
                            </div>

                            <div className="product_detail_action">
                                <button>당근하기</button>
                            </div>
                        </div>

                        <div className="product_detail_seller">
                            <div className="product_detail_seller_profile_image">
                                <Link to="/seller/1">
                                    <img src="/img/default_profile_640-bd77d547809e231cb246f9970970269851c8f0f0cb17fbbe8f6acf9fee1c3cc2.png" alt="Seller Profile" />
                                </Link>
                            </div>
                            <div className="product_detail_seller_info">
                                <Link to="/seller/1" className="seller-id">최당근</Link>
                                <Link to="/region/gangnam" className="seller-region">강남구</Link>
                            </div>
                            <div className="product_detail_seller_manner">
                                <div className="manner-container">
                                    <div className="manner-header">
                                        <span className="manner-temperature">50.3°C</span>
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