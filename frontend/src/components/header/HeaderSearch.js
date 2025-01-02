import { React, useState } from "react";
import "../../style/HeaderSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from './LocationSelector';

const HeaderSearch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(() => {
        return localStorage.getItem('selectedLocation') || '원미구';
    });
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        localStorage.setItem('selectedLocation', location);
        closeModal();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search Query:', searchQuery);
    };

    return (
        <div id="header-search">
            <div className="container">
                <div className="header-search">


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
                                onSelectLocation={handleLocationSelect}
                            />
                        )}
                    </div>

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
    )
};

export default HeaderSearch;