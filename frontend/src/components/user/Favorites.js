import React from "react";

const Favorites = ({ data }) => {
  if (!Array.isArray(data)) {
    return <p>관심 상품 데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          <p>가격: {item.price}원</p>
        </li>
      ))}
    </ul>
  );
};

export default Favorites;
