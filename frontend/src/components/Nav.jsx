import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useCallback, memo, useState, useEffect, useMemo } from 'react';
import { getAssessmentCount } from '../utils/assessmentStorage';
import PropTypes from 'prop-types';
import axios from 'axios';




// =========================================
// Sub-Components
// =========================================

const ShiftIndicator = memo(function ShiftIndicator({ selectedShift, selectedRotation, styles, onClick }) {
  return (
    <div 
      style={{
        ...styles?.indicator,
        cursor: 'pointer',
        transition: 'opacity 0.2s'
      }}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      title="Click to change shift/rotation"
    >
      <i className="bi bi-clock" style={{ fontSize: '18px' }}></i>
      <span>{selectedShift} Shift ({selectedRotation})</span>
    </div>
  );
});

ShiftIndicator.displayName = 'ShiftIndicator';

ShiftIndicator.propTypes = {
  selectedShift: PropTypes.string.isRequired,
  styles: PropTypes.object,
  selectedRotation: PropTypes.string.isRequired,
  onClick: PropTypes.func
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
const ManagementDropdown = memo(({ onClose, isAdmin }) => (
  <div style={{
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#004780',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000,
    minWidth: '200px',
    '@media (maxWidth: 768px)': {
      position: 'static',
      width: '100%',
      marginTop: '5px'
    }
    
  }
  }                             
 >
    <Link 
      to="/" 
      style={{
        display: 'block',
        padding: '10px 15px',
        color: 'white',
        textDecoration: 'none',
        borderBottom: '1px solid #003b66',
        
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
        borderBottom: '1px solid #003b66',
        textDecoration: 'none'
      }}
      onClick={onClose}
    >
      Class Management
        </Link>
    
    {isAdmin && <Link 
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
    </Link> }
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
    const navigate = useNavigate();
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedRotation, setSelectedRotation] = useState('');
    const campusName = user?.campusName || "Unknown"
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [pendingLogout, setPendingLogout] = useState(false);


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

    useEffect(() => {
        const handleRotationChange = (event) => {
            setSelectedRotation(event.detail.rotationName);
        };
        window.addEventListener('rotationSelected', handleRotationChange);
        return () => window.removeEventListener('rotationSelected', handleRotationChange);
    }, []);

    // =========================================
    // Event Handlers
    // =========================================
    const handleClearShift = useCallback(() => {
        const confirmed = window.confirm('Are you sure you want to change your shift and rotation? This will take you back to the selection page.');
        if (confirmed) {
            sessionStorage.removeItem('selectedShift');
            sessionStorage.removeItem('selectedRotation');
            setSelectedShift('');
            setSelectedRotation('');
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = useCallback(() => {
        const count = getAssessmentCount();

        if (count > 0) {
            setPendingLogout(true);
            setShowLogoutModal(true);
        return;
        }

        sessionStorage.removeItem('selectedShift');
        sessionStorage.removeItem('selectedRotation');
        setSelectedShift('');
        setSelectedRotation('');
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
    const isInstructor = user?.roles?.includes('Instructor');

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
        },
        modalDialog:{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            border: '2px solid #000000',
            
        },
        modalBody:{
            backgroundColor: '#ececec',
            paddingBottom: '0px'
        },
        modalFooter:{
            borderTop: 'none',
            backgroundColor: '#ececec', 
            flexDirection:"column"  
        },
        modalButtonContainer:{
            width: '95%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 8px'
        },
        modalDivider:{
            width: '95%',        
            border: '3px solid #000000',
            margin: '0px 12px 12px 12px',
            opacity: '0.45',
            borderRadius: '2px'
        },
        modalCloseBtn:{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#00569c',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
        },
        modalHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                                border: 'none',
                                color: 'white',
                                transition: 'all 0.2s ease',          
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            Patients
                        </Link>
                        <Link 
                            to="/intake" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                border: 'none',
                                color: 'white',
                                transition: 'all 0.2s ease',
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
            
                    {selectedShift && <ShiftIndicator selectedShift={selectedShift} selectedRotation={selectedRotation} styles={styles} onClick={handleClearShift} />}
                    <UnitIndicator selectedUnit={campusName} styles={styles} />

                    {/* MANAGEMENT DROPDOWN (For admin use ONLY) */}
                    {(isAdmin || isInstructor) && (
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
                                    width: "190px",
                                    transition: 'all 0.2s ease',
                    
                                    '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                Management <i className="bi bi-caret-down-fill"></i>
                            </button>
                            
                            {showManagementDropdown && (
                                <ManagementDropdown onClose={closeDropdownAndMenu} isAdmin={isAdmin} />
                            )}
                        </div>
                    )}

                    {/* Full name (desktop) */}
                     <Link 
                            to="/nurse" 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: '#004780',
                                border: 'none',
                                color: 'white',
                                transition: 'all 0.2s ease',
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {user?.fullName}
                        </Link>
                    
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


                    {/* Log out confirmation modal, should only appear when there are outstanding assesments to publish */}
                    <div 
                    className={`modal fade ${showLogoutModal ? "show d-block" : ""}`} 
                    tabIndex="-1"
                    role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered" role="document" >
                            <div className="modal-content" style = {styles.modalDialog}>

                                <div className="modal-header" style = {styles.modalHeader}>
                                    <h5 className="modal-title">! Unpublished Assessments</h5>

                                    <button 
                                        type="button" 
                                        className="close" 
                                        onClick={() => setShowLogoutModal(false)}
                                        style = {styles.modalCloseBtn}
                                        >
                                        <span>&times;</span>
                                    </button>

                                </div>

                                <div className="modal-body" style={styles.modalBody}>
                                    <p>You have outstanding assessments that haven't been published yet. Logging out now may lose this data. <br/><br/>
                                    To publish, return to the Patients page and click the publish assesments button.
                                    </p>
                                </div>

                                <div className="modal-footer" style = {styles.modalFooter}>
                                    <hr style={styles.modalDivider}></hr>

                                    <div style = {styles.modalButtonContainer}>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setShowLogoutModal(false);
                                                sessionStorage.removeItem('selectedShift');
                                                setSelectedShift('');
                                                logout();
                                                navigate("/login")
                                            }}
                                            >
                                            Log Out Anyway
                                        </button>

                                        <button 
                                            className="btn btn-primary" 
                                            onClick={() => {
                                                setShowLogoutModal(false);
                                                navigate("/")
                                            }}
                                            >
                                            Return to Patients
                                        </button>
                                    </div>
                                    

                                </div>

                            </div>
                        </div>
                    
                    </div>

                </div>
            )}
        </nav>
    );
});

// Display name for debugging
Nav.displayName = 'Nav';


export default Nav;
