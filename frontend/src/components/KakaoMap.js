import React, { useEffect, useState } from 'react';

const { kakao } = window;

const KakaoMap = ({ onSelectLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    address: {
      region1: null,
      region2: null,
      region3: null,
    }
  });

  const REST_API_KEY = '572ddcfabe510f2d407223d10c1f97fb';

  const callRegionCodeAPI = (x, y) => {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${REST_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data && data.documents && data.documents[0]) {
          const region1 = data.documents[0].region_1depth_name;
          const region2 = data.documents[0].region_2depth_name;
          const region3 = data.documents[0].region_3depth_name;

          setLocationInfo({
            address: {
              region1,
              region2,
              region3,
            }
          });
          onSelectLocation({ region1, region2, region3 }); // 선택된 지역 전달
          alert(`현재 위치의 지역: ${region1} > ${region2} > ${region3}`);
        }
      })
      .catch((error) => {
        console.error('API 요청 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const kakaoMap = new kakao.maps.Map(container, options);

    const initialPosition = new kakao.maps.LatLng(33.450701, 126.570667);
    const newMarker = new kakao.maps.Marker({
      position: initialPosition,
      draggable: true, // 마커를 드래그 가능하게 설정
    });

    newMarker.setMap(kakaoMap);

    // 드래그가 끝났을 때 새로운 위치로 주소를 업데이트
    kakao.maps.event.addListener(newMarker, 'dragend', function () {
      const newPosition = newMarker.getPosition();
      const lat = newPosition.getLat();
      const lng = newPosition.getLng();

      callRegionCodeAPI(lng, lat); // 새로운 좌표로 지역 정보 업데이트
    });

    // 초기 지오로케이션 위치 설정
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new kakao.maps.LatLng(lat, lon);

        kakaoMap.setCenter(locPosition);
        newMarker.setPosition(locPosition); // 마커 초기 위치 설정
      });
    } else {
      const locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      kakaoMap.setCenter(locPosition);
      newMarker.setPosition(locPosition);
    }

    setMarker(newMarker);
    setMap(kakaoMap);

  }, []); // 초기 마운트 시 한 번만 실행

  return (
    <div
      style={{
        width: '100%',
        display: 'inline-block',
        marginLeft: '5px',
        marginRight: '5px',
      }}
    >
      <div id="map" style={{ width: '99%', height: '500px' }}></div>

      {/* <div>
        <h3>현재 위치 정보:</h3>
        <p>지역 1: {locationInfo.address.region1}</p>
        <p>지역 2: {locationInfo.address.region2}</p>
        <p>지역 3: {locationInfo.address.region3}</p>
      </div> */}
    </div>
  );
};

export default KakaoMap;
