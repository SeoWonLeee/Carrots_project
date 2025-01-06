import React from "react";

const SalesHistory = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>판매 내역이 없습니다.</p>;
  }

  return (
    <div>
      <h2>판매 내역</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>가격: {item.price}원</p>
            <p>상태: {item.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesHistory;
