import React from "react";
import apiClient from "./apiClient";
import "../../style/DeletePage.css";

const DeletePage = ({ handleDeleteAccount }) => {
  const handleDelete = async () => {
    const loginId = localStorage.getItem("loginId");

    if (!loginId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (window.confirm("정말로 계정을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/delete`, { params: { loginId } });
        alert("계정이 성공적으로 삭제되었습니다.");
        localStorage.removeItem("loginId");
        handleDeleteAccount(); // 로그아웃 또는 메인 페이지로 이동
      } catch (error) {
        console.error(error);
        alert("계정을 삭제하는 데 실패했습니다.");
      }
    }
  };

  return (
    <div className="delete-container">
      <h2>회원 탈퇴</h2>
      <p>탈퇴하면 복구할 수 없습니다. 계속 진행하시겠습니까?</p>
      <button onClick={handleDelete}>탈퇴하기</button>
    </div>
  );
};

export default DeletePage;
