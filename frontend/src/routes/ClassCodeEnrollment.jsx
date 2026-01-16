import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import logo from "../img/CARE-logo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ClassCodeEnrollment() {
    const [classCode, setClassCode] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const validateClassCode = async (code) => {
        if (!code || code.trim() === '') {
            setIsValid(null);
            setValidationMessage('');
            return;
        }

        // Check if this looks like an instructor request code (starts with REQ-)
        if (code.toUpperCase().startsWith('REQ-')) {
            setIsValid(true);
            setValidationMessage('Instructor request code - you will be added to approval queue');
            return;
        }

        setIsValidating(true);
        setValidationMessage('');

        try {
            const response = await api.get(`/api/classes/verify/${code.toUpperCase()}`);
            setIsValid(true);
            setValidationMessage(`Valid!`);
        } catch (error) {
            if (error.response?.status === 404) {
                setIsValid(false);
                setValidationMessage('Invalid class code');
            } else {
                setIsValid(null);
                setValidationMessage('Error validating code');
            }
        } finally {
            setIsValidating(false);
        }
    };

    const handleClassCodeChange = (e) => {
        const value = e.target.value.toUpperCase();
        setClassCode(value);
        setIsValid(null);
        setValidationMessage('');
        
        // Debounce validation
        if (value.trim() !== '') {
            const timer = setTimeout(() => {
                validateClassCode(value);
            }, 500);
            return () => clearTimeout(timer);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            const payload = {
                classCode: classCode.trim()
            };
            
            // Add StudentNumber if it's an instructor request code, as their email is name based
            if (classCode.toUpperCase().startsWith('REQ-') && studentNumber.trim()) {
                payload.StudentNumber = studentNumber.trim();
            }
            
            const response = await api.post('/api/auth/provision', payload);

            if (response.data.needsApproval) {
                // Instructor request submitted
                alert(response.data.message);
                navigate('/login');
            } else {
                // Successfully enrolled, reload page to fetch profile
                window.location.href = '/';
            }
        } catch (error) {
            if (error.response?.data?.Message) {
                setErrorMsg(error.response.data.Message);
            } else {
                setErrorMsg('Enrollment failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.logoCircle}>
                <img 
                    src={logo} 
                    alt="CARE app logo" 
                    style={styles.logoImage} 
                />
            </div>
            
            <h1 style={styles.title}>Welcome! Let's Get You Started</h1>
            <p style={styles.subtitle}>Enter your class code to join your class</p>
            
            <form style={styles.form} onSubmit={handleSubmit}>
                {errorMsg && (
                    <div style={styles.errorMessage}>
                        {errorMsg}
                    </div>
                )}

                <label htmlFor="classCode" style={styles.formLabel}>Class Code</label>
                <input
                    className="form-control mb-2"
                    type="text"
                    id="classCode"
                    autoComplete="off"
                    onChange={handleClassCodeChange}
                    value={classCode}
                    required
                    style={{ textTransform: 'uppercase' }}
                />
                
                {isValidating && (
                    <div style={styles.validatingMessage}>
                        Validating...
                    </div>
                )}
                
                {validationMessage && (
                    <div style={isValid ? styles.successMessage : styles.warningMessage}>
                        {validationMessage}
                    </div>
                )}

                {/* Show W Number field only for instructor request codes */}
                {classCode.toUpperCase().startsWith('REQ-') && (
                    <div style={{ marginTop: '15px' }}>
                        <label htmlFor="studentNumber" style={styles.formLabel}>W Number</label>
                        <input
                            className="form-control mb-2"
                            type="text"
                            id="studentNumber"
                            autoComplete="off"
                            onChange={(e) => setStudentNumber(e.target.value)}
                            value={studentNumber}
                            required
                            placeholder="e.g., W1234567"
                            pattern = "W\d{7}"
                        />
                    </div>
                )}
                              
                <button 
                    type="submit" 
                    style={styles.submitButton}
                    disabled={isSubmitting || isValidating || !classCode.trim() || 
                             (classCode.toUpperCase().startsWith('REQ-') && !studentNumber.trim())}
                >
                    {isSubmitting ? 'Enrolling...' : 'Join Class'}
                </button>

                <div style={styles.instructorSection}>
                    <p style={styles.instructorText}>Are you an instructor?</p>
                    <p style={styles.instructorText}>Contact your administrator to receive an instructor request code</p>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #004780, #00bfff)',
        padding: '20px',
    },
    logoCircle: {
        width: 'min(35vw, 250px)', 
        height: 'min(35vw, 250px)', 
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '15px',
        aspectRatio: '1/1', 
    },
    logoImage: {
        width: '100%', 
        height: 'auto',
        objectFit: 'contain',
    },
    title: {
        marginBottom: '10px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '1rem',
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#004780',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
        marginBottom: '15px',
    },
    formLabel: {
        fontWeight: '600',
        fontSize: '1em',
        fontFamily: 'Oxygen, sans-serif',
        color: 'white',
        marginBottom: '5px',
        display: 'block',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        marginTop: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    errorMessage: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    validatingMessage: {
        color: '#856404',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px',
        padding: '8px',
        marginBottom: '10px',
        fontSize: '0.85rem',
    },
    successMessage: {
        color: '#155724',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '5px',
        padding: '8px',
        marginBottom: '10px',
        fontSize: '0.85rem',
    },
    warningMessage: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        padding: '8px',
        marginBottom: '10px',
        fontSize: '0.85rem',
    },
    instructorSection: {
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
    },
    instructorText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '0.9rem',
    },
};
