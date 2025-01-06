import React, { useState, useEffect } from "react";
import "../../style/Products.Module.css";
import { Link, useSearchParams } from "react-router-dom";

const Products = () => {
    const [searchResult, setSearchResult] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const regions = JSON.parse(localStorage.getItem("location"));
    const [regionData, setRegionData] = useState(null);
    const [selectedVillages, setSelectedVillages] = useState([]);
    useEffect(() => {
        console.log("상품 목록에서 지역 정보 확인 : ", regions);
    }, [regions])


    const handlePriceClick = (min, max) => {
        searchParams.set("price", `${min}__${max}`);
        setSearchParams(searchParams);
    };

    const handleApplyPrice = (min, max) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (min && max) {
            newSearchParams.set("price", `${min}__${max}`);
        } else if (min && !max) {
            const currentMin = searchParams.get("price")?.split("__")[1] || 0;
            newSearchParams.set("price", `${min}__0`);
        } else if (!min && max) {
            const currentMin = searchParams.get("price")?.split("__")[0] || 0;
            newSearchParams.set("price", `${currentMin}__${max}`);
        } else {
            newSearchParams.delete("price");
        }

        setSearchParams(newSearchParams);
    };


    const activeFilters = Array.from(searchParams.entries()).filter(
        ([key]) => key !== "search" && key !== "in" && key !== "region"
    );

    const categoryMap = {
        "1": "디지털기기",
        "2": "생활가전",
        "3": "가구/인테리어",
        "4": "생활/주방",
        "5": "유아동",
        "6": "유아도서",
        "7": "여성의류",
        "8": "여성잡화",
        "9": "남성패션/잡화",
        "10": "뷰티/미용",
        "11": "스포츠/레저",
        "12": "취미/게임/음반",
        "13": "도서",
        "14": "티켓/교환권",
        "15": "가공식품",
        "16": "건강기능식품",
        "17": "반려동물용품",
        "18": "식물",
        "19": "기타 중고물품",
        "20": "삽니다",
    };

    useEffect(() => {
        console.log("파라미터가 변경되었습니다.");

        const baseUrl = "http://localhost:8080/buy-sell/";
        const params = new URLSearchParams(searchParams);


        const urlWithParams = `${baseUrl}?${params.toString()}`;
        console.log("URL = ", urlWithParams);


        params.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        })

        fetch(urlWithParams)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                setSearchResult(data);
            })
            .catch((error) => console.error("Error fetching regions:", error));

    }, [searchParams]);


    useEffect(() => {

        console.log("호출ㅊㅊㅊㅊㅊㅊㅊㅊㅊㅊㅊㅊ");

        const fetchRegion = async () => {
            try {
                // 로컬 스토리지에서 데이터 가져오기

                const addressJSON = localStorage.getItem('location');
                const address = JSON.parse(addressJSON);

                const city = address.city;
                console.log("전송한다", city);

                const province = address.province;
                const town = address.town;
                const village = address.village;

                // 쿼리 파라미터 생성
                const params = new URLSearchParams({
                    city,
                    province,
                    town,
                    village,
                });

                // GET 요청 보내기
                const response = await fetch(`http://localhost:8080/api/regions?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // 응답 확인
                if (!response.ok) {
                    throw new Error(`서버 응답 오류: ${response.statusText}`);
                }

                // 응답 데이터 파싱
                const data = await response.json();
                console.log('서버 -> 클라이언트 지역 정보:', data);

                // 필요한 작업 수행 (예: 상태 업데이트)
                // setRegionData(data);
                setRegionData(data);
            } catch (error) {
                console.error('지역 정보를 가져오는 중 오류 발생:', error);
            }
        };

        // 함수 호출
        fetchRegion();
    }, [searchParams]);


    useEffect(() => {
        console.log("sdd", regionData);
    }, [regionData])



    // 체크박스 변경 핸들러 병합
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
    
        // 새로운 searchParams 인스턴스 생성 (불변성 유지)
        const newSearchParams = new URLSearchParams(searchParams);
    
        if (name === "region" || name === "village") {
            if (name === "region") {
                // region 선택 시 village 초기화 및 region 설정
                newSearchParams.delete("village");
                newSearchParams.set(name, value);
                setSelectedVillages([]); // selectedVillages 초기화
            } else if (name === "village") {
                // village 선택 시 기존 region 값 유지하며 설정
                const regionValue = searchParams.get("region") || "";
                const updatedRegion = regionValue.split(" ")[0]; // 기존 region 값의 첫 부분만 사용
                newSearchParams.set("region", `${updatedRegion} ${value}`); // region 값 갱신
                setSelectedVillages([value]); // selectedVillages 업데이트
            }
        } else if (name === "category") {
            // category 필터 처리
            newSearchParams.delete("category");
            if (checked) {
                newSearchParams.set(name, value);
            }
        } else if (name === "search") {
            // search 필터 처리
            if (checked) {
                newSearchParams.set(name, value);
            } else {
                newSearchParams.delete("search");
            }
        } else {
            // 기타 필터 처리
            if (checked) {
                newSearchParams.set(name, value);
            } else {
                newSearchParams.delete(name);
            }
        }
    
        // searchParams 상태 업데이트
        setSearchParams(newSearchParams);
      
    };
    


    return (
        <div id="items">
            <div className="container">
                <div className="items-header">
                    <Link to='/'>홈 </Link>
                    <p> &gt; </p>
                    <p className="items-category">중고거래</p> <br />
                    <h1>{regions.province ? regions.province : ''}</h1>
                    <h1></h1>
                    <h1>{regions.city ? regions.city : ''}</h1>
                    <h1></h1>
                    <h1>{regions.village ? regions.village : ''}</h1>
                    <h1></h1>
                    <h1>{searchParams.get('search') ? `"${searchParams.get('search')}"` : ''}</h1>
                    <h1></h1>

                    <h1>
                        {searchParams.get('search') ? `검색결과` : '중고거래'}
                    </h1>
                </div>

                <br />

                <div className="items-container">
                    <div className="items-filter">
                        <form id="filterForm">
                            <div className="filter-container">
                                <h3 className="filter-filter">필터</h3>
                                <button type="button" className="filter-init" onClick={() => setSearchParams('region'+ "=" + localStorage.getItem('locationParam'))}>초기화</button>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="on_sale"
                                        value="true"
                                        checked={searchParams.get("on_sale") === "true"}
                                        onChange={handleCheckboxChange}
                                    />
                                    거래 가능만 보기
                                </label>
                            </div>

                            <div className="filter-region-container">
                                <h3>위치</h3>
                                <li>
                                    <p className="filter-region">{regions.province}</p>
                                </li>
                                <ul>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="region"
                                            id="location1"
                                            value={localStorage.getItem('locationParam')}
                                            checked={searchParams.get("region") === searchParams.get("region")}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="location1">
                                            <span>{localStorage.getItem('locationParam')}</span>
                                        </label>
                                    </li>
                                </ul>
                                {regionData && regionData.villages && (
                                    <ul className="filter-result">
                                        <div className="filter-result-container">
                                            {regionData.villages.map((village, index) => (
                                                <li key={index} className="filter-village">
                                                    <input
                                                        type="checkbox"
                                                        name="village"
                                                        id={`village-${index}`}
                                                        value={village}
                                                        checked={searchParams.get("region")?.includes(village)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label htmlFor={`village-${index}`}>
                                                        <span>{village}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </div>
                                    </ul>
                                )}
                            </div>



                            <div className="filter-category-container">
                                <h3>카테고리</h3>

                                <ul>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_1"
                                            value="1"
                                            checked={searchParams.get("category_id") === "1"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_1">
                                            <span>디지털기기</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_2"
                                            value="2"
                                            checked={searchParams.get("category_id") === "2"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_2">
                                            <span>생활가전</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_3"
                                            value="3"
                                            checked={searchParams.get("category_id") === "3"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_3">
                                            <span>가구/인테리어</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_4"
                                            value="4"
                                            checked={searchParams.get("category_id") === "4"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_4">
                                            <span>생활/주방</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_5"
                                            value="5"
                                            checked={searchParams.get("category_id") === "5"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_5">
                                            <span>유아동</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_6"
                                            value="6"
                                            checked={searchParams.get("category_id") === "6"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_6">
                                            <span>유아도서</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_7"
                                            value="7"
                                            checked={searchParams.get("category_id") === "7"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_7">
                                            <span>여성의류</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_8"
                                            value="8"
                                            checked={searchParams.get("category_id") === "8"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_8">
                                            <span>여성잡화</span>
                                        </label>
                                    </li>
                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_9"
                                            value="9"
                                            checked={searchParams.get("category_id") === "9"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_9">
                                            <span>남성패션/잡화</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_10"
                                            value="10"
                                            checked={searchParams.get("category_id") === "10"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_10">
                                            <span>뷰티/미용</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_11"
                                            value="11"
                                            checked={searchParams.get("category_id") === "11"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_11">
                                            <span>스포츠/레저</span>
                                        </label>
                                    </li>


                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_12"
                                            value="12"
                                            checked={searchParams.get("category_id") === "12"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_12">
                                            <span>취미/게임/음반</span>
                                        </label>
                                    </li>


                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_13"
                                            value="13"
                                            checked={searchParams.get("category_id") === "13"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_13">
                                            <span>도서</span>
                                        </label>
                                    </li>


                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_14"
                                            value="14"
                                            checked={searchParams.get("category_id") === "14"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_14">
                                            <span>티켓/교환권</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_15"
                                            value="15"
                                            checked={searchParams.get("category_id") === "15"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_15">
                                            <span>가공식품</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_16"
                                            value="16"
                                            checked={searchParams.get("category_id") === "16"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_16">
                                            <span>건강기능식품</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_17"
                                            value="17"
                                            checked={searchParams.get("category_id") === "17"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_17">
                                            <span>반려동물식품</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_18"
                                            value="18"
                                            checked={searchParams.get("category_id") === "18"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_18">
                                            <span>식물</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_19"
                                            value="19"
                                            checked={searchParams.get("category_id") === "19"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_19">
                                            <span>기타 중고물품</span>
                                        </label>
                                    </li>

                                    <li className="filter-city">
                                        <input
                                            type="checkbox"
                                            name="category_id"
                                            id="category_20"
                                            value="20"
                                            checked={searchParams.get("category_id") === "20"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="category_20">
                                            <span>삽니다</span>
                                        </label>
                                    </li>
                                </ul>
                            </div>


                            <div className="filter-sort">
                                <h3>정렬</h3>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            name="sort_by"
                                            id="sort_recent"
                                            value="recent"
                                            checked={searchParams.get("sort_by") === "recent"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="sort_recent">
                                            <span>최신순</span>
                                        </label>
                                    </li>

                                    <li>
                                        <input
                                            type="checkbox"
                                            name="sort_by"
                                            id="sort_hottest"
                                            value="hottest"
                                            checked={searchParams.get("sort_by") === "hottest"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="sort_hottest">
                                            <span>인기순</span>
                                        </label>
                                    </li>
                                </ul>
                            </div>


                            <div className="filter-price">
                                <h3>가격</h3>
                                <div className="price-buttons">

                                    <button
                                        type="button"
                                        onClick={() => handlePriceClick(0, 0)}
                                    >
                                        나눔
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePriceClick(0, 5000)}
                                    >
                                        5,000원 이하
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePriceClick(0, 10000)}
                                    >
                                        10,000원 이하
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePriceClick(0, 20000)}
                                    >
                                        20,000원 이하
                                    </button>



                                </div>
                                <div className="price-range">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="0"
                                        onChange={(e) => handleApplyPrice(e.target.value, searchParams.get("maxPrice"))}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="0"
                                        onChange={(e) => handleApplyPrice(searchParams.get("minPrice"), e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div id="activeFilters">
                        {activeFilters.map(([key, value]) => (
                            <button
                                key={key}
                                className="filter-button"
                                onClick={() => {
                                    searchParams.delete(key);
                                    setSearchParams(searchParams);
                                }}
                            >

                                {
                                    key === "category_id" ? `${categoryMap[value] + ' ✕' || value + ' ✕'}` :
                                        key === "sort_by" ? (value === "hottest" ? "인기순 ✕" : "최신순 ✕") :
                                            key === "on_sale" ? "판매중 ✕" :
                                                key === "price" ?
                                                    (value === "0__0" ? "나눔 ✕" :
                                                        value === "0__5000" ? "5,000원 미만 ✕" :
                                                            value === "0__10000" ? "10,000원 미만 ✕" :
                                                                value === "0__20000" ? "20,000원 미만 ✕" :
                                                                    value.split("__").length === 2 ? `${value.split("__")[0]}원 이상 - ${value.split("__")[1]}원 이하 ✕` :
                                                                        value + " ✕") :
                                                    value + ' ✕'
                                }


                            </button>
                        ))}
                    </div>



                </div>

                <div className="items">
                    {searchResult.map((product) => (
                        <div className="item" key={product.id}>
                            <Link to={`/product/${product.productId}`}>
                                <img src={`http://localhost:8080/images/${product.productImageURL}` || "/images/mac.jpg"} alt="상품 이미지" />
                                <p className="item-title">{product.title}</p>
                                <span className="items-item-price">
                                    <p className="item-price">{product.price.toLocaleString()}</p>
                                    <p>원</p>
                                </span>
                                <p className="item-region">지역: {product.region}</p>
                            </Link>
                        </div>
                    ))}
                </div>



            </div>
        </div>
    );
};

export default Products;
