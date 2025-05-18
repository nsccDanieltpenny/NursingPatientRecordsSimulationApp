import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useCallback, memo, useState, useEffect, useMemo } from 'react';

const ShiftIndicator = memo(({ selectedShift, styles }) => (
  <div style={styles.indicator}>
    <i className="bi bi-clock" style={{ fontSize: '18px' }}></i>
    <span>{selectedShift} Shift</span>
  </div>
));

const UnitIndicator = memo(({ selectedUnit, styles }) => (
  <div style={styles.indicator}>
    <i className="bi bi-building" style={{ fontSize: '18px' }}></i>
    <span>Unit: {selectedUnit}</span>
  </div>
));

const ManagementDropdown = memo(({ onClose }) => (
  <div style={{
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#004780',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000,
    minWidth: '180px',
    '@media (max-width: 768px)': {
      position: 'static',
      width: '100%',
      marginTop: '5px'
    }
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
      onClick={onClose}
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
      onClick={onClose}
    >
      Class Management
    </Link>
  </div>
));

const Nav = memo(function Nav() {
    const { user, logout } = useUser();
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('Harbourside Hospital');
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Listen for shiftSelected event
    useEffect(() => {
        const handleShiftChange = (event) => {
            setSelectedShift(event.detail);
        };
        window.addEventListener('shiftSelected', handleShiftChange);
        return () => window.removeEventListener('shiftSelected', handleShiftChange);
    }, []);

    // Added useCallback to hold value of logout function, even when the page 
    /* even when the Home page redraws. This hook prevents unnecessary reloading
     * and helps performance. 
     * - dylan
     */
    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('selectedShift');
        setSelectedShift('');
        logout();
    }, [logout]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const handleDropdownOpen = useCallback(() => {
        setShowManagementDropdown(true);
    }, []);

    const handleDropdownClose = useCallback(() => {
        setShowManagementDropdown(false);
    }, []);

    const closeDropdownAndMenu = useCallback(() => {
        setShowManagementDropdown(false);
        setIsMobileMenuOpen(false);
    }, []);

    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.boxShadow = '0px 0px 0px 2px #0073e6';
        e.currentTarget.style.transform = 'translateY(-1px)';
    }, []);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.boxShadow = '0px 0px 0px 0px #0073e6';
        e.currentTarget.style.transform = 'none';
    }, []);

    const isAdmin = user?.roles?.includes('Admin'); // Check for admin role

    // Memoized styles
    const styles = useMemo(() => ({
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            width: '100%',
            backgroundColor: '#101112',
            borderBottom: '2px solid #e94560',
            alignItems: 'center',
            position: 'relative',
            flexWrap: 'wrap',
            gap: '10px',
            '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'stretch'
            }
        },
        mobileMenuButton: {
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            '@media (max-width: 768px)': {
                display: 'block',
                position: 'absolute',
                right: '10px',
                top: '10px'
            }
        },
        leftSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            '@media (max-width: 768px)': {
                width: '100%',
                display: isMobileMenuOpen ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '10px',
                paddingTop: '10px'
            }
        },
        rightSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            '@media (max-width: 768px)': {
                width: '100%',
                display: isMobileMenuOpen ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '10px',
                marginTop: '10px'
            }
        },
        indicator: {
            backgroundColor: '#004780',
            padding: '8px 15px',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0px 0px 0px 2px #0073e6',
            border: '1px solid #003b66',
            letterSpacing: '0.5px',
            fontSize: '0.9rem',
            height: '40px',
            '@media (max-width: 992px)': {
                padding: '6px 12px',
                fontSize: '0.85rem'
            },
            '@media (max-width: 480px)': {
                padding: '4px 8px',
                fontSize: '0.8rem'
            }
        },
        fullName: {
            color: 'white',
            '@media (max-width: 992px)': {
                display: 'none'
            }
        },
        nameInitials: {
            display: 'none',
            '@media (max-width: 992px)': {
                display: 'flex',
                backgroundColor: '#004780',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }
        }
    }), [isMobileMenuOpen]);

    return (
        <nav style={styles.nav}>
            {/* Mobile menu button */}
            <button 
                style={styles.mobileMenuButton}
                onClick={toggleMobileMenu}
            >
                <i className={`bi bi-${isMobileMenuOpen ? 'x' : 'list'}`}></i>
            </button>

            {/* Left-aligned items */}
            <div style={styles.leftSection}>
                {user && (
                    <div style={{ display: 'flex', gap: '10px', '@media (max-width: 768px)': { width: '100%', flexDirection: 'column' } }}>
                        <Link 
                            to="/" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                '@media (max-width: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                        >
                            Patients
                        </Link>
                        <Link 
                            to="/api/patients/create" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                '@media (max-width: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                        >
                            Intake Form
                        </Link>
                    </div>
                )}
            </div>

            {/* Right-aligned items */}
            {user && (
                <div style={styles.rightSection}>
                    {/* Shift Indicator */}
                    {selectedShift && <ShiftIndicator selectedShift={selectedShift} styles={styles} />}

                    {/* Unit Indicator */}
                    <UnitIndicator selectedUnit={selectedUnit} styles={styles} />

                    {/* Full name (desktop) */}
                    <div style={styles.fullName}>{user.fullName}</div>
                    
                    {/* Initials (smaller screens) */}
                    <div style={styles.nameInitials}>
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* MANAGEMENT DROPDOWN (For admin use ONLY) */}
                    {isAdmin && (
                        <div 
                            style={{ position: 'relative' }}
                            onMouseEnter={handleDropdownOpen}
                            onMouseLeave={handleDropdownClose}
                        >
                            <button 
                                className="btn btn-primary" 
                                style={{ 
                                    backgroundColor: '#004780',
                                    border: 'none',
                                    '@media (max-width: 768px)': { width: '100%', textAlign: 'left' }
                                }}
                            >
                                Management <i className="bi bi-caret-down-fill"></i>
                            </button>
                            
                            {showManagementDropdown && (
                                <ManagementDropdown onClose={closeDropdownAndMenu} />
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
                            boxShadow: '0px 0px 0px 0px #0073e6',
                            '@media (max-width: 768px)': { width: '100%', textAlign: 'left' }
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
            )}
        </nav>
    );
});

export default Nav;