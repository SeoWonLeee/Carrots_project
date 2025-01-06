import React, { useState } from "react";
import apiClient from "./apiClient";
import "../../style/PasswordPage.css";

const PasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginId = localStorage.getItem("loginId");

    if (!loginId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", newPassword);

      const response = await apiClient.put(
        `/users/update/${loginId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("비밀번호가 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error(error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="password-container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        <label>현재 비밀번호</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
        />
        <label>새 비밀번호</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 확인"
        />
        <button type="submit">변경</button>
      </form>
    </div>
  );
};

export default PasswordPage;
