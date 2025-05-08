import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export default function Nav() {
    const { user, logout } = useUser();
    const [selectedShift, setSelectedShift] = useState('');

    // Listen for shiftSelected event and update state
    useEffect(() => {
        const handleShiftChange = (event) => {
            setSelectedShift(event.detail);
            window.removeEventListener('shiftSelected', handleShiftChange);
        };

        window.addEventListener('shiftSelected', handleShiftChange);

        return () => {
            window.removeEventListener('shiftSelected', handleShiftChange);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('selectedShift');
        setSelectedShift('');
        logout();
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            width: '100%',
            backgroundColor: '#101112',
            borderBottom: '2px solid #e94560',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {user && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/" className="btn btn-primary" style={{ backgroundColor: '#004780' }}>
                            Patients
                        </Link>
                        <Link to="/api/patients/create" className="btn btn-primary" style={{ backgroundColor: '#004780' }}>
                            Intake Form
                        </Link>
                    </div>
                )}
            </div>

            {user && selectedShift && (
                <div style={{
                    backgroundColor: '#004780',
                    padding: '8px 20px',
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #003b66',
                    letterSpacing: '0.5px',
                    marginRight: '20px',
                    fontSize: '0.95rem'
                }}>
                    <i className="bi bi-clock" style={{ fontSize: '18px' }}></i>
                    <span>{selectedShift} Shift</span>
                </div>
            )}

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: 'white' }}>{user.fullName}</div>
                    <div
                        style={{
                            color: 'grey',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                        onClick={handleLogout}
                    >
                        Log out
                    </div>
                </div>
            )}
        </nav>
    );
}
