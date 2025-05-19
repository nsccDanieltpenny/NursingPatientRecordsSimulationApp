import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/CARE-logo.svg"
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useUser } from '../context/UserContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const { login } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/api/auth/login', 
                JSON.stringify({email, password}),
                {
                    headers: {'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            const token = response?.data?.token;
            const roles = response?.data?.roles;
            const fullName = response?.data?.fullName;
            const campus = response?.data?.campus;

            // since nurse role is not returned, I'm manually assigning to make RequireAuth work
            if (roles.length === 0)
                roles.push('Nurse');

            login({ email, roles, token, fullName, campus });
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Incorrect email or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login failed');
            }
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
            
            <form style={styles.form} onSubmit={handleSubmit}>
                <span className="text-danger">{errMsg}</span>
                <label htmlFor="email" style={styles.formLabel}>Email</label>
                <input
                    className="form-control mb-3"
                    type="text"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                
                <label htmlFor="password" style={styles.formLabel}>Password</label>
                <input 
                    className="form-control mb-3"
                    type="password"
                    id="password"
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required 
                />
                
                <button style={styles.submitButton}>Log In</button>
            </form>
            
            <p style={styles.registerPrompt}>
                Don't have an account?{' '}
                <span 
                    onClick={() => navigate('/register')} 
                    style={styles.registerLink}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/register')}
                >
                    Sign up here
                </span>.
            </p>
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
        width: 'min(50vw, 330px)', 
        height: 'min(50vw, 330px)', 
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
    registerPrompt: {
        marginTop: '15px',
        color: '#fff',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    registerLink: {
        color: '#ffef00',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: '600',
        ':hover': {
            textDecoration: 'none',
        },
        ':focus': {
            outline: '2px solid #ffef00',
            outlineOffset: '2px',
        }
    },
};