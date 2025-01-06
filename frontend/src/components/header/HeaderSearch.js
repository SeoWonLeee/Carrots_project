import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../../style/HeaderSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from './LocationSelector';

const HeaderSearch = () => {
    // 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [locationObject, setLocationObject] = useState('원미구');
    const [locationparm, setLocationparm] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();



    const [selectedLocation, setSelectedLocation] = useState(() => {
        return localStorage.getItem('location') || '원미구';
    });

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("region", localStorage.getItem("locationParam"));
        navigate(`/?${newParams.toString()}`);
    }, [])

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLocationSelect = (location) => {
        localStorage.clear();

        const addressParts = location.split(" ");
        const locationObject = {
            province: addressParts[0] || null,
            city: addressParts[1] || null,
            town: addressParts[2] || null,
            village: addressParts[3] || null,
        };

        console.log("선택된 지역 = ", location);
        console.log("2222선택된 지역 = ", locationObject);


        if (locationObject.village) {
            location = `${locationObject.town} ${locationObject.village}`;
        }
        else if (locationObject.town) {
            location = `${locationObject.city} ${locationObject.town}`;
        }
        else if (locationObject.city) {
            location = `${locationObject.province} ${locationObject.city}`;
        }
        else {
            location = `${locationObject.province}`;
        }

        setLocationparm(location);

        localStorage.setItem('location', JSON.stringify(locationObject));
        localStorage.setItem('locationParam', location);

        setSelectedLocation(location);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("region", location);
        setSearchParams(newParams);

        closeModal();
    };

    useEffect(() => {
        const addressParts = selectedLocation.split(" ");
        setLocationObject({
            province: addressParts[0],
            city: addressParts[1],
            town: addressParts[2],
            village: addressParts[3],
        });
    }, [selectedLocation])



    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const trimmedQuery = searchQuery.trim();

        if (location.pathname.startsWith("/buy-sell")) {
            const newParams = new URLSearchParams(searchParams);
            if (trimmedQuery) {
                newParams.set("search", trimmedQuery);
                newParams.set("region", searchParams.get("region"));
            } else {
                newParams.delete("query");
            }
            setSearchParams(newParams);
        } else {
            const newParams = new URLSearchParams();
            if (trimmedQuery) {
                newParams.set("search", trimmedQuery);
                newParams.set("region", localStorage.getItem("locationParam"));

            }
            navigate(`/buy-sell/?${newParams.toString()}`);
        }
    };

    function getLocationFromLocalStorage() {
        const savedLocation = localStorage.getItem('location');

        if (savedLocation) {
            const locationObject = JSON.parse(savedLocation);

            if (locationObject.village) {
                return `${locationObject.town} ${locationObject.village}`;
            }
            else if (locationObject.town) {
                return `${locationObject.city} ${locationObject.town}`;
            }
            else {
                return `${locationObject.province} ${locationObject.city}`;
            }
        } else {
            return '지역 정보 없음';
        }
    }

    useEffect(() => {

        if (location.pathname === '/maps') { // /maps 경로에서는 navigate 실행 안 함
            navigate("/maps");
        }

        const initialQuery = searchParams.get("query") || '';
        setSearchQuery(initialQuery);

        const initialLocation = searchParams.get("location") || getLocationFromLocalStorage();
        setSelectedLocation(initialLocation);

    }, [searchParams]);

    return (
        <div id="header-search">
            <div className="container">
                <div className="header-search">

                    {/* 지역 선택 버튼 */}
                    <div className="user-location">
                        <button type="button" onClick={openModal} className="user-location">
                            <div className="location-text">
                                <FontAwesomeIcon icon={faLocationDot} className="icon" />
                                <span className="location-text">{selectedLocation}</span>
                                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                            </div>
                        </button>
                        {isModalOpen && (
                            <Modal
                                onClose={closeModal}
                                onSelectLocation={handleLocationSelect} // 지역 선택시 호출되는 함수
                            />
                        )}
                    </div>

                    {/* 검색 폼 */}
                    <form className="header-search-form" onSubmit={handleSearchSubmit}>
                        <div className="product-category-select">
                            <select className="product-category-dropdown" name="category" aria-label="카테고리 선택" defaultValue="중고거래">
                                <option value="중고거래">중고거래</option>
                                <option value="동네업체">동네업체</option>
                                <option value="알바">알바</option>
                                <option value="중고차">중고차</option>
                                <option value="부동산">부동산</option>
                            </select>
                        </div>

                        <span className="split">|</span>

                        <div className="prudct-search-bar">
                            <input
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어를 입력해주세요."
                                aria-label="검색어 입력"
                            />
                            <button type="submit" className="search-button">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </form>

                    <div className="header-search-keyword">
                        <div className="keyword-search-container">
                            <span className="keyword-label">인기 검색어</span>
                            <ul className="keyword-list">
                                <li><a href="#">아이폰</a></li>
                                <li><a href="#">의자</a></li>
                                <li><a href="#">자전거</a></li>
                                <li><a href="#">컴퓨터</a></li>
                                <li><a href="#">책상</a></li>
                                <li><a href="#">소파</a></li>
                                <li><a href="#">원피스</a></li>
                                <li><a href="#">전기자전거</a></li>
                                <li><a href="#">식탁</a></li>
                                <li><a href="#">모니터</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeaderSearch;
