import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/CARE-logo.svg"
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { useUser } from '../context/UserContext';

export default function Login() {
    const [errMsg, setErrMsg] = useState('');
    const { instance } = useMsal();
    const { user, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the logout flag when we reach the login page
        localStorage.removeItem('isLoggingOut');
    }, []);

    useEffect(() => {
        // Redirect if user is authenticated
        if (!loading && user) {
            if (user.needsEnrollment) {
                navigate('/enroll', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleLogin = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (err) {
            setErrMsg('Login failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            {/* Improved responsive logo with white circle */}
            <div style={styles.logoCircle}>
                <img 
                    src={logo} 
                    alt="CARE app logo" 
                    style={styles.logoImage} 
                />
            </div>
            
            <h1 style={styles.title}>Please Log In</h1>
            
            <div style={styles.form}>
                {errMsg && (
                    <div style={styles.errorMessage}>
                        {errMsg}
                    </div>
                )}

                <p style={styles.loginDescription}>
                    Click the button below to sign in with your Microsoft account.
                </p>
                
                <button 
                    onClick={handleLogin} 
                    style={styles.submitButton}
                    type="button"
                >
                    Sign in with Microsoft
                </button>
            </div>
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
        marginBottom: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    },
    errorAlert: {
        maxWidth: '400px',
        width: '80%',
        marginBottom: '20px',
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
    loginDescription: {
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '0.95rem',
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
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: '#0069d9',
        },
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
        fontFamily: 'Arial, sans-serif',
    },
};