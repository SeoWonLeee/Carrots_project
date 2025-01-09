import React, { useEffect, useState, useRef } from 'react';
import "../../style/Talk.css";
import SockJS from 'sockjs-client';
import Layout from "../Layout";
import { Client } from '@stomp/stompjs';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../user/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faList, faSmile, faCalendarDays, faCarrot, faComment } from '@fortawesome/free-solid-svg-icons';
import Schedule from './Schedule';

function Talk() {
    const [user, setUser] = useState('');
    const { receiverLoginId, roomId } = useParams();
    const { userData } = useAuth();
    const myLoginId = userData?.loginId;
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const chatContainerRef = useRef(null);
    

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveModal = (scheduleData) => {
        console.log("저장할 스케줄 데이터:", scheduleData);
        const saveSchedule = async () => {
            try {
                const response = await fetch(`http://localhost:8080/schedule`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: currentChatRoom.productId,
                        sellerId: userData.id,
                        date: scheduleData.date,   // 날짜는 그대로
                        time: scheduleData.time.replace('오전 ', '').replace('오후 ', ''),
                        place: scheduleData.place, // 장소
                    }),
                });
        
                if (response.ok) {
                    const message = await response.text();
                    alert(message);
                    setIsModalOpen(false);
                } else {
                    const errorData = await response.text();
                    console.error('약속 저장 실패:', errorData);
                    alert('약속 저장에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                console.error('서버 통신 에러:', error);
            }
        };
        
        
    
        saveSchedule();
    };
    

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const navigate = useNavigate();

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const years = date.getFullYear().toString().slice(2, 4);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const isPM = hours >= 12;
        const formattedHours = isPM ? hours - 12 : hours || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const period = isPM ? '오후' : '오전';

        return `${years}/${month}/${day} ${period} ${formattedHours}:${formattedMinutes}`;
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        setIsDropdownOpen(false);
        const storedUser = sessionStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [userData]);

    useEffect(() => {
        scrollToBottom(); // 메시지가 업데이트될 때마다 호출
    }, [messages]); // messages 상태가 변경될 때 실행

    // 채팅 목록 로드
    useEffect(() => {
        async function fetchChatRooms() {
            try {
                const response = await fetch(`http://localhost:8080/talk`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log("채팅 내역", data);
                if (Array.isArray(data)) {
                    const uniqueRooms = data.filter(
                        (room, index, self) =>
                            index === self.findIndex((r) => r.chatRoomId === room.chatRoomId)
                    );
                    setChatRooms(uniqueRooms);
                } else {
                    console.error('채팅 목록이 배열이 아닙니다:', data);
                    setChatRooms([]);
                }
            } catch (error) {
                console.error('채팅 목록을 가져오는 중 오류 발생:', error);
                setChatRooms([]);
            } finally {
                setLoading(false);
            }
        }

        if (myLoginId) {
            fetchChatRooms();
        }
    }, [myLoginId, roomId]);

    useEffect(() => {
        console.log("현재 채팅방 정보 (상태 업데이트 후):", currentChatRoom); // 상태 업데이트 후 확인
    }, [currentChatRoom]);

    const fetchChatRoom = () => {
        console.log("fetchChatRoom 호출");
        const foundRoom = chatRooms.find((room) => room.chatRoomId === parseInt(roomId, 10));
        if (foundRoom) {
            console.log("현재 채팅방 정보:", foundRoom);
            setCurrentChatRoom(foundRoom);
        } else {
            console.error("채팅방을 찾을 수 없습니다:", roomId);
            setCurrentChatRoom(null);
        }
    }

    useEffect(() => {
        async function fetchChatHistory() {
            if (!roomId || chatRooms.length === 0) return;

            console.log("채팅방 변경되었음.");

            try {
                setMessages([]);

                const response = await fetch(`http://localhost:8080/talk/${roomId}`, {
                    method: 'GET',
                    credentials: 'include', // 세션 쿠키 포함
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                fetchChatRoom();
                console.log("채팅", data);

                if (Array.isArray(data)) {
                    setMessages((prevMessages) => {
                        const newMessages = data.filter(
                            (newMsg) => !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
                        );
                        return [...prevMessages, ...newMessages];
                    });
                } else {
                    console.error('채팅 내역이 배열이 아닙니다:', data);
                }
            } catch (error) {
                console.error('채팅 내역을 가져오는 중 오류 발생:', error);
            }
        }

        if (roomId && chatRooms.length > 0) {
            fetchChatHistory();
        }
    }, [roomId, chatRooms]);

    // STOMP 클라이언트 설정 및 연결
    useEffect(() => {
        if (!myLoginId) {
            console.error('사용자가 인증되지 않았습니다.');
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-endpoint'),
            onConnect: (frame) => {
                console.log('Connected to STOMP:', frame);
                setConnected(true);

                client.subscribe(`/topic/room/${roomId}`, (response) => {
                    const payload = JSON.parse(response.body);
                    setMessages((prev) => [...prev, payload]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onDisconnect: () => {
                console.log('Disconnected from STOMP');
                setConnected(false);
            },
            reconnectDelay: 5000,
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client && client.active) {
                client.deactivate();
            }
        };
    }, [myLoginId, receiverLoginId, roomId]);

    const sendMessage = () => {
        if (!stompClient || !connected) {
            alert('STOMP 연결이 되지 않았습니다.');
            return;
        }
        if (!inputText.trim()) return;

        const msgObj = {
            sender: myLoginId,
            receiver: receiverLoginId,
            message: inputText,
            timestamp: new Date().toISOString(),
        };

        stompClient.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify(msgObj),
        });

        setInputText('');
    };

    const handleRoomClick = (room) => {
        navigate(`/talk/${room.chatRoomId}`);
    };

    return (
        <Layout isChatPage={true}>
            <div id='talk'>
                <div className='container'>
                    <div className='talk'>

                        <div className='talk-side'>
                            <Link to='/talk'>

                                {user.profileImageUrl ? (
                                    <img src={`http://127.0.0.1:8080/images/${user.profileImageUrl}`} alt={user.profileImageUrl} />


                                ) : (
                                    <img src="/profile_default.png" alt="Default Profile" />
                                )}


                            </Link>
                        </div>

                        <div className='talk-list'>
                            <div className='talk-list-header'>
                                <h3>채팅 목록</h3>
                            </div>

                            {chatRooms.map((room) => (
                                <div className='talk-list-list' key={room.chatRoomId} onClick={() => handleRoomClick(room)}>
                                    <div className='talk-list-info'>
                                        <div className='user-profile'>
                                            {room.partnerProfileImage ? (
                                                <img src={`http://127.0.0.1:8080/images/${room.partnerProfileImage}`} alt={room.productName} />

                                            ) : (
                                                <img src="/profile_default.png" alt="Default Profile" />
                                            )}
                                            <div></div>
                                        </div>
                                        <div className='talk-list-sec'>
                                            <div className='line1'>
                                                <span className='user-loginId'>{room.otherUserLoginId}</span>
                                            </div>
                                            <div className='line2'>
                                                <span className='user-lastMessage'>{room.lastMessage}</span>
                                            </div>
                                        </div>

                                        <div className='tlak-list-product'>
                                            <div className='product-img'>
                                                {room.productImageURL ? (
                                                    <img src={`http://127.0.0.1:8080/images/${room.productImageURL}`} alt={room.productName} />
                                                ) : (
                                                    <img src="/default_product.jpg" alt="Default Product" />
                                                )}
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='talk-chat'>

                            {!roomId ? (
                                <div className='Empty-chat'>
                                    <FontAwesomeIcon icon={faComment} className="tool-icon" />
                                    <span>대화 상대를 선택하세요</span>
                                </div>
                            ) : (
                                loading || !currentChatRoom ? (
                                    <div>로딩 중...</div>
                                ) : (
                                    <div>
                                        <div className='talk-header'>
                                            <div className='recive-profile'>
                                                {connected ? (
                                                    <Link to={`/users/${currentChatRoom.userId}`}>
                                                    <div className='connection-profile'>
                                                        <img src={`http://127.0.0.1:8080/images/${currentChatRoom.partnerProfileImage}` || "/profile_default.png"} alt="Profile" />
                                                    </div>
                                                    </Link>
                                                ) : (
                                                    <div className='disconnection-profile'>
                                                        <img src={currentChatRoom.partnerProfileImage || "/profile_default.png"} alt="Profile" />
                                                    </div>
                                                    
                                                )}
                                            </div>

                                            <h3>{currentChatRoom.otherUserLoginId}</h3>
                                            <div className='recive-manner'>
                                                <span>{currentChatRoom.otherManner || '매너 정보 없음'}</span>
                                                <span>°C</span>
                                            </div>

                                            <div className="dropdown">
                                                <button className="menu-button" onClick={toggleDropdown}>
                                                    <span>...</span>
                                                </button>
                                                {isDropdownOpen && (
                                                    <div className="dropdown-menu">
                                                        <ul>
                                                            <li>알림음 끄기</li>
                                                            <li>대화상대 차단하기</li>
                                                            <li>채팅방 나가기</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Link to={`/product/${currentChatRoom.productId}`} className='talk-product'>
                                            <div className='talk-product-header'>
                                                <div className='product'>
                                                    <img src={`http://localhost:8080/images/${currentChatRoom.productImageURL}` || "/default_product.jpg"} alt={currentChatRoom.productTitle} />
                                                </div>

                                                <div className='talk-section'>
                                                    <div className='talk-section-1'>
                                                        <span>{currentChatRoom.productTitle}</span>
                                                    </div>

                                                    <div className='talk-section-2'>
                                                        <span>{currentChatRoom.productPrice}</span>
                                                        <span>원</span>
                                                    </div>
                                                </div>

                                                <div className='product-status'>
                                                    <span>{currentChatRoom.productStatus}</span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="chat-wrapper">
                                            <div className='produt-transaction'>
                                                <button className='transcation-date' onClick={handleOpenModal}>
                                                    <FontAwesomeIcon icon={faCalendarDays} className="tool-icon" />
                                                    <span> 약속잡기</span>
                                                </button>
                                                <button className='transcation-pay'>
                                                    <FontAwesomeIcon icon={faCarrot} className="tool-icon" />
                                                    <span> 당근페이</span>
                                                </button>
                                                <button className='transcation-plus'>
                                                    <FontAwesomeIcon icon={faImage} className="tool-icon" />
                                                    <span> 물품추가</span>
                                                </button>
                                            </div>

                                            <Schedule
                                                isOpen={isModalOpen}
                                                onClose={handleCloseModal}
                                                onSave={handleSaveModal}
                                            />

                                            <div className="chat-container" ref={chatContainerRef}>
                                                {messages.map((msg, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={
                                                            msg.sender === myLoginId
                                                                ? 'my-chat-message-wrapper'
                                                                : 'other-chat-message-wrapper'
                                                        }
                                                    >
                                                        {msg.sender !== myLoginId && (
                                                            <img
                                                                src={`http://127.0.0.1:8080/images/${currentChatRoom.partnerProfileImage}` || '/profile_default.png'}
                                                                alt="Profile"
                                                                className="profile-image"
                                                            />
                                                        )}
                                                        <div
                                                            className={
                                                                msg.sender === myLoginId
                                                                    ? 'my-chat-message'
                                                                    : 'other-chat-message'
                                                            }
                                                        >
                                                            <span className="message-text">{msg.message}</span>
                                                            <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 입력창 및 전송 버튼 */}
                                            <div className="message-input-container">
                                                <div className="message-input-wrapper">
                                                    <textarea
                                                        value={inputText}
                                                        onChange={(e) => setInputText(e.target.value)}
                                                        className="message-textarea"
                                                        placeholder="메시지를 입력하세요..."
                                                        maxLength="1000"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault(); // Shift+Enter를 제외한 Enter로 메시지 전송
                                                                sendMessage();
                                                            }
                                                        }}
                                                    ></textarea>
                                                    <div className="message-tools">
                                                        {/* 이미지 버튼 */}
                                                        <button className="tool-button">
                                                            <FontAwesomeIcon icon={faImage} className="tool-icon" />
                                                        </button>
                                                        {/* 목록 버튼 */}
                                                        <button className="tool-button">
                                                            <FontAwesomeIcon icon={faList} className="tool-icon" />
                                                        </button>
                                                        {/* 이모지 버튼 */}
                                                        <button className="tool-button">
                                                            <FontAwesomeIcon icon={faSmile} className="tool-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="message-actions">
                                                    <span className="char-count">{inputText.length}/1000</span>
                                                    <button
                                                        onClick={sendMessage}
                                                        className="send-button"
                                                        disabled={!inputText.trim()} // 빈 입력값일 경우 버튼 비활성화
                                                    >
                                                        전송
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}


export default Talk;