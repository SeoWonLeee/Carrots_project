import React, { useState } from 'react';
import '../../style/LocationSelector.css';

function LocationSelector({ onClose, onSelectLocation }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const REST_API_KEY = '572ddcfabe510f2d407223d10c1f97fb';

    const searchLocations = async (query) => {
        if (!query) {
            setLocations([]);
            return;
        }

        setIsLoading(true);
        setNoResults(false);
        try {
            const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `KakaoAK ${REST_API_KEY}`,
                },
            });
            const data = await response.json();

            if (data.documents && data.documents.length > 0) {
                setLocations(data.documents);
            } else {
                setNoResults(true);
            }
        } catch (error) {
            console.error('서버 요청 오류:', error);
            setNoResults(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);
        searchLocations(query);

        console.log("지역정보 : ", locations);
    };

    // 모달 백드롭 클릭 시 모달 닫기
    const handleBackdropClick = () => {
        onClose();
    };

    // 모달 내부 클릭 시 이벤트 전파 방지
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal" onClick={handleModalClick}>
                <h2>지역 선택</h2>
                {/* 검색 입력 필드 */}
                <input
                    type="text"
                    placeholder="지역이나 동네로 검색하기"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {isLoading && <p>로딩 중...</p>} {/* 로딩 중일 때 표시 */}
                <ul className="location-list">
                    {/* 검색 결과 표시 */}
                    {noResults ? (
                        <li className="no-results">결과가 없습니다</li>
                    ) : (
                        locations.map((location, index) => (
                            <li
                                key={index}
                                onClick={() => onSelectLocation(location.address_name)}
                                className="location-item"
                            >
                                {location.address_name}
                            </li>
                        ))
                    )}
                </ul>
                <button onClick={onClose} className="close-button">닫기</button>
            </div>
        </div>
    );
}

export default LocationSelector;
