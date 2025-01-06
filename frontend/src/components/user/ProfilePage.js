import React, { useState } from "react";
import apiClient from "./apiClient";
import "../../style/ProfilePage.css";

const ProfilePage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginId = localStorage.getItem("loginId");

    if (!loginId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("email", email);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await apiClient.put(
        `/users/update/${loginId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("프로필이 성공적으로 업데이트되었습니다!");
    } catch (error) {
      console.error(error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="profile-container">
      <h2>프로필 변경</h2>
      <form onSubmit={handleSubmit}>
        <label>전화번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호 입력"
        />
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
        />
        <label>프로필 사진</label>
        <input
          type="file"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />
        <button type="submit">저장</button>
      </form>
    </div>
  );
};

export default ProfilePage;
