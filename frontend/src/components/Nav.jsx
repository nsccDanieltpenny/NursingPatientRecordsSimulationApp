import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useCallback, memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// =========================================
// Sub-Components
// =========================================

const ShiftIndicator = memo(function ShiftIndicator({ selectedShift, styles }) {
  return (
    <div style={styles?.indicator}>
      <i className="bi bi-clock" style={{ fontSize: '18px' }}></i>
      <span>{selectedShift} Shift</span>
    </div>
  );
});

ShiftIndicator.displayName = 'ShiftIndicator';

ShiftIndicator.propTypes = {
  selectedShift: PropTypes.string.isRequired,
  styles: PropTypes.object
};

// =========================================
const UnitIndicator = memo(({ selectedUnit, styles }) => (
  <div style={styles?.indicator}>
    <i className="bi bi-building" style={{ fontSize: '18px' }}></i>
    <span>{selectedUnit}</span>
  </div>
));

UnitIndicator.displayName = 'UnitIndicator';

UnitIndicator.propTypes = {
  selectedUnit: PropTypes.string.isRequired,
  styles: PropTypes.object
};

// =========================================
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
    '@media (maxWidth: 768px)': {
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
      Patients
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
        <Link 
      to="/instructors" 
      style={{
        display: 'block',
        padding: '10px 15px',
        color: 'white',
        textDecoration: 'none'
      }}
      onClick={onClose}
    >
      Instructor Management
    </Link>
  </div>
));

ManagementDropdown.displayName = 'ManagementDropdown';

ManagementDropdown.propTypes = {
  onClose: PropTypes.func.isRequired
};

// =========================================
// Main Nav Component
// =========================================

const Nav = memo(function Nav() {
    // =========================================
    // State and Context
    // =========================================
    const { user, logout } = useUser();
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('Harbourside Hospital');
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // =========================================
    // Effects
    // =========================================
    useEffect(() => {
        const handleShiftChange = (event) => {
            setSelectedShift(event.detail);
        };
        window.addEventListener('shiftSelected', handleShiftChange);
        return () => window.removeEventListener('shiftSelected', handleShiftChange);
    }, []);

    // =========================================
    // Event Handlers
    // =========================================
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

    // =========================================
    // Derived State
    // =========================================
    const isAdmin = user?.roles?.includes('Admin');

    // =========================================
    // Styles
    // =========================================
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
            '@media (maxWidth: 768px)': {
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
            '@media (maxWidth: 768px)': {
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
            '@media (maxWidth: 768px)': {
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
            '@media (maxWidth: 768px)': {
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
            '@media (maxWidth: 992px)': {
                padding: '6px 12px',
                fontSize: '0.85rem'
            },
            '@media (maxWidth: 480px)': {
                padding: '4px 8px',
                fontSize: '0.8rem'
            }
        },
        fullName: {
            color: 'white',
            '@media (maxWidth: 992px)': {
                display: 'none'
            }
        },
        nameInitials: {
            display: 'none',
            '@media (maxWidth: 992px)': {
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

    // =========================================
    // Render
    // =========================================
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
                    <div style={{ display: 'flex', gap: '10px', '@media (maxWidth: 768px)': { width: '100%', flexDirection: 'column' } }}>
                        <Link 
                            to="/" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                        >
                            Patients
                        </Link>
                        <Link 
                            to="/intake" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                        >
                            Intake Form
                        </Link>
                    </div>
                )}

                {/* PUBLISH BUTTON HERE  */}
            </div>

            {/* Right-aligned items */}
            {user && (
                <div style={styles.rightSection}>
            
                    {selectedShift && <ShiftIndicator selectedShift={selectedShift} styles={styles} />}
                    <UnitIndicator selectedUnit={selectedUnit} styles={styles} />

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
                                    '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                                }}
                            >
                                Management <i className="bi bi-caret-down-fill"></i>
                            </button>
                            
                            {showManagementDropdown && (
                                <ManagementDropdown onClose={closeDropdownAndMenu} />
                            )}
                        </div>
                    )}

                    {/* Full name (desktop) */}
                    <div style={styles.fullName}>{user?.fullName}</div>
                    
                    {/* Initials (smaller screens) */}
                    <div style={styles.nameInitials}>
                        {user?.fullName?.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Log Out Button */}
                    <button 
                        className="btn btn-primary" 
                        style={{ 
                            backgroundColor: '#004780', 
                            border: 'none',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            boxShadow: '0px 0px 0px 0px #0073e6',
                            '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
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

// Display name for debugging
Nav.displayName = 'Nav';

export default Nav;