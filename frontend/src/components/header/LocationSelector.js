import React from 'react';
import '../../style/LocationSelector.css';

function LocationSelector({ onClose, onSelectLocation }) {
    const locations = ['원미구', '강남구', '종로구', '해운대구', '중구'];

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>지역 선택</h2>
                <ul className="location-list">
                    {locations.map((location, index) => (
                        <li
                            key={index}
                            onClick={() => onSelectLocation(location)}
                            className="location-item"
                        >
                            {location}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} className="close-button">닫기</button>
            </div>
        </div>
    );
}

export default LocationSelector;
