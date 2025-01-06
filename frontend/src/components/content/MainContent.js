import { React, useState } from "react";
import "../../style/MainContent.css";

const MainContent = () => {
    const [currentImage, setCurrentImage] = useState(0); // 현재 이미지 인덱스 상태
    const [backgroundColor, setBackgroundColor] = useState("#fff0aa"); // 배경색 상태

    const images = [
        "images/banner1.png",
        "images/banner2.png",
        "images/banner3.png"

    ];

    const backgroundColors = [
        "#fff0aa", // 배경색 1
        "#ffe2d2", // 배경색 2
        "#e3eff9"  // 배경색 3
    ];

    const changeImage = (direction) => {
        const nextImage = direction === "next"
            ? (currentImage + 1) % images.length
            : (currentImage - 1 + images.length) % images.length;

        setCurrentImage(nextImage);
        setBackgroundColor(backgroundColors[nextImage]);
    };

    return (
        <div
            id="main-content"
            style={{
                backgroundColor,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div className="container">
                <div className="image-slider">
                    <div
                        className="slider-images"
                        style={{
                            transform: `translateX(-${currentImage * 100}%)`,
                            transition: 'transform 0.0s ease-in-out',
                            display: 'flex',
                        }}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`슬라이드 이미지 ${index + 1}`}
                                className="slider-image"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ))}
                    </div>

                    <div className="slider-buttons">
                        <button className="slider-arrow prev" onClick={() => changeImage("prev")}>
                            <span></span>
                        </button>
                        <button className="slider-arrow next" onClick={() => changeImage("next")}>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContent;