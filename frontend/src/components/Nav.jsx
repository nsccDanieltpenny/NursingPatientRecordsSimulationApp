import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export default function Nav() {
    const { user, logout } = useUser();
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('Harbourside Hospital');
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);

    // Listen for shiftSelected event
    useEffect(() => {
        const handleShiftChange = (event) => {
            setSelectedShift(event.detail);
        };
        window.addEventListener('shiftSelected', handleShiftChange);
        return () => window.removeEventListener('shiftSelected', handleShiftChange);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('selectedShift');
        setSelectedShift('');
        logout();
    };

    const isAdmin = user?.roles?.includes('Admin'); // Check for admin role

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            width: '100%',
            backgroundColor: '#101112',
            borderBottom: '2px solid #e94560',
            alignItems: 'center',
            position: 'relative'
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

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Shift Indicator */}
                    {selectedShift && (
                        <div style={{
                            backgroundColor: '#004780',
                            padding: '8px 20px',
                            borderRadius: '12px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0px 0px 0px 2px #0073e6',
                            border: '1px solid #003b66',
                            letterSpacing: '0.5px',
                            fontSize: '0.95rem',
                            height: '40px'
                        }}>
                            <i className="bi bi-clock" style={{ fontSize: '18px' }}></i>
                            <span>{selectedShift} Shift</span>
                        </div>
                    )}

                    {/* Unit Indicator */}
                    <div style={{
                        backgroundColor: '#004780',
                        padding: '8px 20px',
                        borderRadius: '12px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0px 0px 0px 2px #0073e6',
                        border: '1px solid #003b66',
                        letterSpacing: '0.5px',
                        fontSize: '0.95rem',
                        height: '40px'
                    }}>
                        <i className="bi bi-building" style={{ fontSize: '18px' }}></i>
                        <span>Unit: {selectedUnit}</span>
                    </div>

                    <div style={{ color: 'white' }}>{user.fullName}</div>

                    {/* MANAGEMENT DROPDOWN (For admin use ONLY) */}
                    {/* Bed 
                        Management -- For now, this links to home. Eventually there will be a bed management
                                          component for adding/removing beds. It should also correspond with the
                                          number of beds in the respective Units (campuses). So, Ivany campus is
                                          'Harbourside Hospital' which has 15 beds. Eventually, system admin can 
                                          manage beds across units.  
                        
                        Class 
                        Management -- Add/Remove students to class lists. Create classes each semester. 
                                            Eventually, the admin should be able to access a list of each 
                                            nurse's submitted assessments and filter it accordingly. This 
                                            would serve as a way to keep track of how the student is doing, and 
                                            where they may need improvement. 

                        Component 
                        Summary    --  Conditionally renders a dropdown menu for management options. if isAdmin
                                       is true, displays a button labeled "Management". 
                                       On hover, `showManagementDropdown` state is set to true, which triggers 
                                       the display of the dropdown menu containing links for 'bed management' and 
                                       'class management'.  */} 
                    {isAdmin && (
                        <div 
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setShowManagementDropdown(true)}
                            onMouseLeave={() => setShowManagementDropdown(false)}
                        >
                            <button 
                                className="btn btn-primary" 
                                style={{ 
                                    backgroundColor: '#004780',
                                    border: 'none'
                                }}
                            >
                                Management <i className="bi bi-caret-down-fill"></i>
                            </button>
                            
                            {showManagementDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: '#004780',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    zIndex: 1000,
                                    minWidth: '180px'
                                }}>
                                    <Link 
                                        to="/" 
                                        style={{
                                            display: 'block',
                                            padding: '10px 15px',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderBottom: '1px solid #003b66'
                                        }}
                                        onClick={() => setShowManagementDropdown(false)}
                                    >
                                        Bed Management
                                    </Link>
                                    <Link 
                                        to="/admin" 
                                        style={{
                                            display: 'block',
                                            padding: '10px 15px',
                                            color: 'white',
                                            textDecoration: 'none'
                                        }}
                                        onClick={() => setShowManagementDropdown(false)}
                                    >
                                        Class Management
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Log Out Button */}
                    <button 
                        className="btn btn-primary" 
                        style={{ 
                            backgroundColor: '#004780', 
                            border: 'none',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            boxShadow: '0px 0px 0px 0px #0073e6'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0px 0px 0px 2px #0073e6';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0px 0px 0px 0px #0073e6';
                            e.currentTarget.style.transform = 'none';
                        }}
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
            )}
        </nav>
    );
}