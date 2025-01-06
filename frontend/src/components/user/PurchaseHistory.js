import React from "react";

const PurchaseHistory = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>구매 내역이 없습니다.</p>;
  }

  return (
    <div>
      <h2>구매 내역</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>가격: {item.price}원</p>
            <p>구매 날짜: {item.purchaseDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseHistory;
