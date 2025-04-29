import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';

export default function Nav() {
    const { user, logout } = useUser();
    const selectedShift = sessionStorage.getItem('selectedShift');

    const handleLogout = () => {
        //clears shift on logout
        sessionStorage.removeItem('selectedShift');
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

            {/* Only show if user is logged in AND shift is selected */}
            {user && selectedShift && (
                    <div style={{
                        backgroundColor: '#2a2d30',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        color: 'white'
                    }}>
                        Current Shift: {selectedShift}
                    </div>
                )}

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: 'white' }}>{user.fullName}</div>
                    <div 
                        style={{ 
                            color: 'grey', 
                            fontSize: '0.8rem', 
                            cursor: 'pointer',
                            ':hover': { color: 'white' }
                        }} 
                        onClick={logout}
                    >
                        Log out
                    </div>
                </div>
            )}
        </nav>
    );
}