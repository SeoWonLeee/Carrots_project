import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProfilePage from "./ProfilePage";
import PasswordPage from "./PasswordPage";
import DeletePage from "./DeletePage";
import SalesHistory from "./SalesHistory";
import PurchaseHistory from "./PurchaseHistory";
import Favorites from "./Favorites";
import "../../style/MyPages.css";
import apiClient from "./apiClient";
import productsApiClient from "./productsApiClient";
import sellingProductsApiClient from "./sellingProductsApiClient";

const MyPagee = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchUserInfo = async () => {
      try {



        
        const loginId = sessionStorage.getItem("userData");
        if (!loginId) {
          alert("로그인이 필요합니다.ddddddddd");
          navigate("/login");
          return;
        }

        const response = await apiClient.get(`/ ${1}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        alert("사용자 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userInfo) {
      fetchProductsByStatus(null);
    }
  }, [userInfo]);
  // 계정 삭제 처리
  const handleDeleteAccount = async () => {
    const loginId = sessionStorage.getItem("loginId");

    if (!loginId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (window.confirm("정말로 계정을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/delete`, { params: { loginId } });
        alert("계정이 성공적으로 삭제되었습니다.");
        sessionStorage.removeItem("loginId");
        navigate("/");
      } catch (error) {
        console.error("계정 삭제 중 오류 발생:", error);
        alert("계정을 삭제하는 데 실패했습니다.");
      }
    }

    if (!loginId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (window.confirm("정말로 계정을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/delete`, { params: { loginId } });
        alert("계정이 성공적으로 삭제되었습니다.");
        sessionStorage.removeItem("loginId");
        navigate("/");
      } catch (error) {
        console.error("계정 삭제 중 오류 발생:", error);
        alert("계정을 삭제하는 데 실패했습니다.");
      }
    }
  };

  const handleMenuClick = async (menu) => {
    setSelectedMenu(menu);
    const userId = userInfo?.id;

    try {
      let response;
      if (menu === "판매내역") {
        response = await productsApiClient.get(`/1 `); // 판매내역
      } else if (menu === "구매내역") {
        response = await sellingProductsApiClient.get(
          `/history/purchase/${userId}`
        );
      } else if (menu === "관심상품") {
        response = await productsApiClient.get(`/1 /favorites`); // 관심상품
      }

      setData(response.data.favorites || response.data || []);
    } catch (error) {
      console.error(`${menu} 데이터를 가져오는 데 실패했습니다.`, error);
      alert(`${menu} 데이터를 가져오는 데 실패했습니다.`);
    }
  };

  const fetchProductsByStatus = async (status) => {
    const userId = userInfo?.id;
    try {
      const url = status
        ? `/users/${userId}/status?status=${status}` // 상태별 조회
        : `/users/${userId}`; // 전체 조회
      const response = await productsApiClient.get(url);
      console.log("응답 데이터 구조:", response.data); // 데이터 구조 확인
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("상품 데이터를 가져오는 데 실패했습니다.", error);
      alert("상품 데이터를 가져오는 데 실패했습니다.");
    }
  };

  const handleFilterClick = (status) => {
    setSelectedStatus(status);
    setVisibleCount(4); // `더 보기`를 초기화
    fetchProductsByStatus(status);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const renderProducts = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p>상품이 없습니다.</p>;
    }

    return (
      <ul>
        {data.slice(0, visibleCount).map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>가격: {item.price}원</p>
            <p>상태: {item.status}</p>
          </li>
        ))}
        {visibleCount < data.length && (
          <button className="load-more-btn" onClick={handleLoadMore}>
            더 보기
          </button>
        )}
      </ul>
    ); 
  };

  const renderMenuContent = () => {
    if (selectedMenu === "판매내역") {
      return renderProducts();
    }
    if (selectedMenu === "구매내역") {
      return <PurchaseHistory data={data} />;
    }
    if (selectedMenu === "관심상품") {
      return <Favorites data={data} />;
    }
    return null;
  };

  const renderBottomPanelContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <ProfilePage apiClient={apiClient} />;
      case "password":
        return <PasswordPage apiClient={apiClient} />;
      case "delete":
        return <DeletePage handleDeleteAccount={handleDeleteAccount} />;
      default:
        return null;
    }
  };

  const isSidePanelMenu = ["판매내역", "구매내역", "관심상품"].includes(
    selectedMenu
  );

  const isBottomPanelMenu = ["profile", "password", "delete"].includes(
    selectedMenu
  );

  const closeOverlay = () => setSelectedMenu(null);

  if (loading) return <p>Loading...</p>;
  if (!userInfo) return <p>사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="mypage-container">
      {/* 좌측 배너 */}
      <div className="sidebar">
        <h1>마이페이지</h1>
        <div className="menu-section">
          <h2>나의 거래</h2>
          <ul className="trade-menu">
            <li onClick={() => handleMenuClick("판매내역")}>판매내역</li>
            <li onClick={() => handleMenuClick("구매내역")}>구매내역</li>
            <li onClick={() => handleMenuClick("관심상품")}>관심상품</li>
          </ul>
        </div>
        <hr />
        <div className="menu-section info-menu">
          <h2>내 정보</h2>
          <ul>
            <li onClick={() => setSelectedMenu("profile")}>프로필 변경</li>
            <li onClick={() => setSelectedMenu("password")}>비밀번호 변경</li>
            <li onClick={() => setSelectedMenu("delete")}>회원 탈퇴</li>
          </ul>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <div className="mypage-header">
          <div className="profile-section">
            <img
              src={
                userInfo.profileImageUrl || "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-info">
              <h2 className="username">{userInfo.loginId}</h2>
              <p className="manner-score">
                매너온도:{" "}
                <span className="score">{userInfo.mannerTemperature}°C</span>
              </p>
            </div>
          </div>
        </div>
        <div className="transaction-section">
          <h2>내 상품</h2>
          <div className="product-buttons">
            <button
              className={`product-btn ${
                selectedStatus === null ? "active" : ""
              }`}
              onClick={() => handleFilterClick(null)}
            >
              전체
            </button>
            <button
              className={`product-btn ${
                selectedStatus === "ON_SALE" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("ON_SALE")}
            >
              판매중
            </button>
            <button
              className={`product-btn ${
                selectedStatus === "RESERVED" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("RESERVED")}
            >
              예약중
            </button>
            <button
              className={`product-btn ${
                selectedStatus === "SOLD_OUT" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("SOLD_OUT")}
            >
              판매완료
            </button>
          </div>
          {/* 데이터 렌더링 */}
          <div className="product-list">{renderProducts()}</div>
        </div>
      </div>

      {/* 동적 콘텐츠 영역 */}
      <div
        id="dynamic-overlay"
        className={`dynamic-overlay ${
          isSidePanelMenu || isBottomPanelMenu ? "visible" : ""
        }`}
        onClick={closeOverlay}
      >
        {isSidePanelMenu && (
          <div
            id="dynamic-content"
            className={`dynamic-content side-panel ${
              isSidePanelMenu ? "visible" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dynamic-header">
              <button
                id="close-dynamic-content"
                className="close-btn"
                onClick={closeOverlay}
              >
                ×
              </button>
              <h2 className="dynamic-title">{selectedMenu}</h2>
              <div className="dynamic-body">{renderMenuContent()}</div>
            </div>
          </div>
        )}
        {isBottomPanelMenu && (
          <div
            id="dynamic-content"
            className={`dynamic-content bottom-panel ${
              isBottomPanelMenu ? "visible" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dynamic-header">
              <button
                id="close-dynamic-content"
                className="close-btn"
                onClick={closeOverlay}
              >
                ×
              </button>
              <div className="dynamic-body">{renderBottomPanelContent()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPagee;
