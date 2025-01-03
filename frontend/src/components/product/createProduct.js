import React, { useState } from "react";
import "../../style/createProduct.css";

const CreateProduct = () => {
    const [product, setProduct] = useState({
        title: "",
        categoryId: "",
        description: "",
        price: "",
        regionId: "",
        images: []  // 이미지 상태를 product 객체 안으로 이동
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("이미지는 최대 5개까지 업로드 가능합니다.");
        } else {
            setProduct((prev) => ({
                ...prev,
                images: files,  // images 상태를 product.images로 수정
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // product 객체의 데이터를 formData에 추가
        Object.entries(product).forEach(([key, value]) => {
            if (key !== "images") { // images는 제외하고 추가
                formData.append(key, value);
            }
        });
    
        // 이미지 파일들을 formData에 추가
        Array.from(product.images).forEach((image) => {
            formData.append("images", image); // images로 여러 파일을 첨부
        });
    
        try {
            const response = await fetch("http://localhost:8080/products", {
                method: "POST",
                body: formData,
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.text(); // ResponseEntity의 메시지 읽기
                alert("상품 등록 성공: " + data);
                console.log("서버 응답:", data);
            } else {
                console.error("상품 등록 실패:", response.statusText);
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    
        console.log("상품 등록:", product);
    };

    return (
        <div className="create-container">
            <div className="login-logo" style={{ marginLeft: "150px" }}>
                <a href="/main">
                    <img
                        src="/images/logo.svg"
                        alt="당근마켓 로고"
                    />
                </a>
            </div>
            <form className="product-form" onSubmit={handleSubmit}>
                {/* 상품 이미지 업로드 */}
                <div className="form-group">
                    <label>상품 이미지</label>
                    <div
                        className="image-preview"
                        id="image-preview"
                        onClick={() => document.getElementById("product-image").click()}
                    >
                        {product.images.length > 0 ? (
                            product.images.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    style={{ width: "50px", height: "50px", margin: "5px" }}
                                />
                            ))
                        ) : (
                            <p>이미지를 추가하려면 클릭하세요</p>
                        )}
                    </div>
                    <input
                        type="file"
                        id="product-image"
                        name="product-image"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                    <small>이미지는 최대 5개까지 업로드 가능합니다.</small>
                </div>

                {/* 상품 제목 */}
                <div className="form-group">
                    <label htmlFor="product-title">상품 제목</label>
                    <input
                        type="text"
                        id="product-title"
                        name="title"
                        placeholder="상품 제목을 입력하세요"
                        value={product.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 상품 카테고리 */}
                <div className="form-group">
                    <label htmlFor="product-category">카테고리</label>
                    <select
                        id="product-category"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">카테고리를 선택하세요</option>
                        <option value="1">디지털기기</option>
                        <option value="2">가전제품</option>
                        <option value="3">의류</option>
                        <option value="4">생활용품</option>
                        <option value="5">기타</option>
                    </select>
                </div>

                {/* 상품 설명 */}
                <div className="form-group">
                    <label htmlFor="product-description">상품 설명</label>
                    <textarea
                        id="product-description"
                        name="description"
                        rows="5"
                        placeholder="상품에 대해 설명해주세요"
                        value={product.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                {/* 상품 가격 */}
                <div className="form-group">
                    <label htmlFor="product-price">가격</label>
                    <input
                        type="number"
                        id="product-price"
                        name="price"
                        placeholder="상품 가격을 입력하세요"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                    <small>가격은 숫자로 입력해주세요. (예: 10000)</small>
                </div>

                {/* 상품 위치 */}
                <div className="form-group">
                    <label htmlFor="product-location">거래 위치</label>
                    <input
                        type="text"
                        id="product-location"
                        name="regionId"
                        placeholder="거래 위치를 입력하세요"
                        value={product.regionId}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 제출 버튼 */}
                <div className="form-group">
                    <button type="submit" className="btn-submit">
                        상품 등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
