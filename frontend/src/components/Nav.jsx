import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';
import { useCallback, memo, useState, useEffect, useMemo } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { getAssessmentCount } from '../utils/assessmentStorage';
import PropTypes from 'prop-types';
import api from '../utils/api';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'




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

        <Link 
      to="/admin/campuses" 
      style={{
        display: 'block',
        padding: '10px 15px',
        color: 'white',
        borderBottom: '1px solid #003b66',
        textDecoration: 'none'
      }}
      onClick={onClose}
    >
      Campus Management
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
const CampusDropdown = memo(({ campuses, onSelect }) => (
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
    }}>
        {campuses.map((campus) => (
            <button
                key={campus.campusId}
                type="button"
                onClick={() => onSelect(campus.campusId)}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 15px',
                    color: 'white',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #003b66',
                    cursor: 'pointer'
                }}
            >
                {campus.name}
            </button>
        ))}
    </div>
));

CampusDropdown.displayName = 'CampusDropdown';

CampusDropdown.propTypes = {
    campuses: PropTypes.arrayOf(PropTypes.shape({
        campusId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    onSelect: PropTypes.func.isRequired
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
    const [campuses, setCampuses] = useState([]);
    const [selectedCampusId, setSelectedCampusId] = useState('');
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);
    const [showCampusDropdown, setShowCampusDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [pendingLogout, setPendingLogout] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)



    // =========================================
    // Derived State
    // =========================================
    const isAdmin = user?.roles?.includes('Admin');
    const isInstructor = user?.roles?.includes('Instructor');
    const isStudent = !isAdmin && !isInstructor && user?.classId && user?.isValid !== false;
    const isLtcRotation = selectedRotation?.toLowerCase() === 'ltc';

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

    useEffect(() => {
        const storedShift = sessionStorage.getItem('selectedShift');
        if (storedShift) {
            setSelectedShift(storedShift);
        }

        const storedRotation = sessionStorage.getItem('selectedRotation');
        if (storedRotation) {
            try {
                const rotation = JSON.parse(storedRotation);
                setSelectedRotation(rotation?.rotationName || '');
            } catch {
                setSelectedRotation('');
            }
        }
    }, []);

    useEffect(() => {
        const loadCampuses = async () => {
            if (!isAdmin) {
                localStorage.removeItem('adminCampusId');
                setCampuses([]);
                setSelectedCampusId('');
                return;
            }

            try {
                const response = await api.get('/api/campus');
                const campusList = response.data || [];
                setCampuses(campusList);

                const storedCampusId = localStorage.getItem('adminCampusId');
                const defaultCampusId = storedCampusId || (campusList[0]?.campusId?.toString() || '');
                if (defaultCampusId) {
                    localStorage.setItem('adminCampusId', defaultCampusId);
                }
                setSelectedCampusId(defaultCampusId);

                if (defaultCampusId) {
                    window.dispatchEvent(new CustomEvent('adminCampusChanged', { detail: { campusId: defaultCampusId } }));
                }
            } catch (error) {
                console.error('Error loading campuses:', error);
            }
        };

        loadCampuses();
    }, [isAdmin]);

    useEffect(() => {
        const storedShift = sessionStorage.getItem('selectedShift')
        const storedRotation = sessionStorage.getItem('selectedRotation')
        
        const rotationObj = storedRotation
        ? JSON.parse(storedRotation)
        : null

        if (storedShift) setSelectedShift(storedShift)
        if (rotationObj) setSelectedRotation(rotationObj.rotationName)

    }, [])

    
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

    const handleIntakeClick = useCallback((event) => {
        if (isStudent && isLtcRotation) {
            event.preventDefault();
            setSnackbar({
                open: true,
                message: 'Students cannot create patients during LTC rotation.',
                severity: 'warning'
            });
        }
    }, [isStudent, isLtcRotation]);

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
        navigate('/logout', { replace: true });
    }, [logout]);


    const handleDropdownOpen = useCallback(() => {
        setShowManagementDropdown(true);
    }, []);

    const handleDropdownClose = useCallback(() => {
        setShowManagementDropdown(false);
    }, []);

    const handleCampusDropdownOpen = useCallback(() => {
        setShowCampusDropdown(true);
    }, []);

    const handleCampusDropdownClose = useCallback(() => {
        setShowCampusDropdown(false);
    }, []);

    const closeDropdownAndMenu = useCallback(() => {
        setShowManagementDropdown(false);
    }, []);

    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.boxShadow = '0px 0px 0px 2px #0073e6';
        e.currentTarget.style.transform = 'translateY(-1px)';
    }, []);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.boxShadow = '0px 0px 0px 0px #0073e6';
        e.currentTarget.style.transform = 'none';
    }, []);

    const handleCampusChange = useCallback((campusId) => {
        const campusIdValue = campusId?.toString() || '';
        setSelectedCampusId(campusIdValue);
        if (campusIdValue) {
            localStorage.setItem('adminCampusId', campusIdValue);
        } else {
            localStorage.removeItem('adminCampusId');
        }
        window.dispatchEvent(new CustomEvent('adminCampusChanged', { detail: { campusId: campusIdValue } }));
        setShowCampusDropdown(false);
    }, []);

    const selectedCampusName = useMemo(() => {
        if (!isAdmin || !selectedCampusId) {
            return campusName;
        }
        const campus = campuses.find(c => c.campusId?.toString() === selectedCampusId);
        return campus?.name || campusName;
    }, [campusName, campuses, isAdmin, selectedCampusId]);

    const isTabletDisplay = useMediaQuery(theme.breakpoints.down(1026))

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

        
    }), []);

    // =========================================
    // Render
    // =========================================


    return isTabletDisplay ? (
    // MOBILE NAV
    <nav style={styles.nav}>
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
                    
                    </div>
                )}
            </div>

            {/* Mobile Dropdown Menu */}
            {user && (<IconButton onClick={() => setMobileOpen(true)} color="inherit">
                <MenuIcon sx={{color:'white'}}/>
            </IconButton>
            )}

            <Drawer
            anchor="top"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            >
            <List sx={{ width: 260}}>
                <ListItem disablePadding>
                <ListItemButton component={Link} to="/intake" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Intake Form" />
                </ListItemButton>
                </ListItem>
                
                {selectedShift && (
                <ListItem disablePadding>
                    <ListItemButton
                    onClick={() => {
                        handleClearShift()
                        setMobileOpen(false)
                    }}
                    >
                    <ListItemText
                        primary={`${selectedShift} shift ${selectedRotation} (Click to change)`}
                    />
                    </ListItemButton>
                </ListItem>
                )}

                {(isAdmin || isInstructor) && (
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/campuses"
                        onClick={() => setMobileOpen(false)}
                    >
                    <ListItemText primary="Campus Management" />
                    </ListItemButton>
                </ListItem>
                )}

                <ListItem disablePadding>
                <ListItemButton component={Link} to="/nurse" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="My Profile" />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={() => { handleLogout(); setMobileOpen(false) }}>
                    <ListItemText primary="Log out" />
                </ListItemButton>
                </ListItem>
            </List>
            </Drawer>



            {/* Right-aligned items */}
            {user && (
                <div style={styles.rightSection}>  
                    {/* Log Out Button */}
                    {/* <button 
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
                    </button> */}


                    {selectedShift && <ShiftIndicator selectedShift={selectedShift} selectedRotation={selectedRotation} styles={styles} onClick={handleClearShift} />}


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
                                                navigate('/logout', { replace: true });
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
    )
    :(
        // DESKTOP NAV
        <>
        <nav style={styles.nav}>
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
                                opacity: isStudent && isLtcRotation ? 0.6 : 1,
                                cursor: isStudent && isLtcRotation ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                '@media (maxWidth: 768px)': { width: '100%', textAlign: 'left' }
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleIntakeClick}
                        >
                            Intake Form
                        </Link>
                    </div>
                )}

            </div>

            {/* Right-aligned items */}
            {user && (
                <div style={styles.rightSection}>
            
                    {selectedShift && <ShiftIndicator selectedShift={selectedShift} selectedRotation={selectedRotation} styles={styles} onClick={handleClearShift} />}

                    {isAdmin && campuses.length > 0 ? (
                        <div
                            style={{ position: 'relative' }}
                            onMouseEnter={handleCampusDropdownOpen}
                            onMouseLeave={handleCampusDropdownClose}
                        >
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={styles.indicator}>
                                    <i className="bi bi-building" style={{ fontSize: '18px' }}></i>
                                    <span>{selectedCampusName}</span>
                                    <i className="bi bi-caret-down-fill" style={{ fontSize: '14px' }}></i>
                                </div>
                            </div>
                            {showCampusDropdown && (
                                <CampusDropdown campuses={campuses} onSelect={handleCampusChange} />
                            )}
                        </div>
                    ) : (
                        <UnitIndicator selectedUnit={campusName} styles={styles} />
                    )}

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
                                                navigate('/logout', { replace: true });
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
        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
            <Alert
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                severity={snackbar.severity}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </>
    );
});

// Display name for debugging
Nav.displayName = 'Nav';


export default Nav;
