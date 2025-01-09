import React from 'react';

const Schedule = ({ isOpen, onClose, onSave }) => {

    const [formData, setFormData] = React.useState({
        date: '',
        time: '',
        place: '',
      });
      
      if (!isOpen) return null;
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("저장할 데이터:", formData);
        onSave(formData);
    };
    

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>약속 설정</h2>
                <form>
                    <div style={styles.inputGroup}>
                        <label>날짜:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>시간:</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>장소:</label>
                        <input
                            type="text"
                            name="place"
                            value={formData.place}
                            onChange={handleChange}
                            placeholder="장소를 입력하세요"
                            style={styles.input}
                        />
                    </div>
                </form>
                <div style={styles.actions}>
                    <button style={styles.button} onClick={onClose}>
                        취소
                    </button>
                    <button style={styles.button} onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    actions: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
    },
};

export default Schedule;
