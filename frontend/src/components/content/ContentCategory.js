import React from 'react';
import '../../style/ContentCategory.css';

const ContentCategory = () => {
    return (
        <div id="contents">
            <div class="container">
                <div class="content1">
                    <h2>인기 카테고리</h2>
                    <div class="pop-category">
                        <a href=""><img src="images/mac.jpg" alt="" />
                            <p>디지털기기</p>
                        </a>
                        <a href=""><img src="images/main2.png" alt="" />
                            <p>생활가전</p>
                        </a>
                        <a href=""><img src="images/main3.png" alt="" />
                            <p>가구/인테리어</p>
                        </a>
                        <a href=""><img src="images/main4.png" alt="" />
                            <p>생활/주방</p>
                        </a>
                        <a href=""><img src="images/main6.png" alt="" />
                            <p>유아동</p>
                        </a>
                        <a href=""><img src="images/main7.png" alt="" />
                            <p>유아도서</p>
                        </a>
                        <a href=""><img src="images/main8.png" alt="" />
                            <p>여성의류</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentCategory;
