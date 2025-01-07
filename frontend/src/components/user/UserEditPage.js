import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/UserEditPage.css";

const UserEditPage = () => {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        email: "",
        phone: "",
        regionId: ""
    }); // 수정할 데이터 상태

    useEffect(() => {
        // 세션 스토리지에서 사용자 정보를 가져오는 함수
        const storedUser = JSON.parse(sessionStorage.getItem("userData"));

        if (storedUser) {
            setUser(storedUser);
            setFormData({
                password: "", // 초기 비밀번호는 비워둠
                email: storedUser.email || "",
                phone: storedUser.phone || "",
                regionId: storedUser.regionId || "",
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
        if (profileImage) {
            data.append("profileImage", profileImage);
        }

        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: "PUT",
                body: data,
                credentials: "include",
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // 세션 스토리지 업데이트
                const updatedUserData = {
                    ...user,
                    email: updatedUser.email,
                    profileImageUrl: updatedUser.profileImageUrl,
                };

                sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
                setUser(updatedUserData);

                alert("회원 정보가 성공적으로 수정되었습니다.");
                navigate("/");
            } else {
                console.error("Failed to update user information");
            }
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    };

    if (!user) {
        return <div>로딩 중...</div>;
    }

    return (
        <div id="user-edit-page">
            <div className="container">
                <h2>회원 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    {/* 프로필 이미지 */}
                    <div className="form-group">
                        <label htmlFor="profileImage">프로필 이미지</label>
                        <div className="profile-image-preview">
                            {profileImage ? (
                                <img
                                    src={URL.createObjectURL(profileImage)}
                                    alt="Preview"
                                    className="preview-img"
                                />
                            ) : (
                                user.profileImageUrl && (
                                    <img
                                        src={`http://localhost:8080/images/${user.profileImageUrl}`}
                                        alt="Current Profile"
                                        className="current-img"
                                    />
                                )
                            )}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* 이메일 */}
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="새 비밀번호를 입력하세요 (선택)"
                        />
                    </div>

                    {/* 지역 */}
                    <div className="form-group">
                        <label htmlFor="regionId">거주 지역</label>
                        <input
                            type="text"
                            id="regionId"
                            name="regionId"
                            value={formData.regionId}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        수정하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEditPage;
