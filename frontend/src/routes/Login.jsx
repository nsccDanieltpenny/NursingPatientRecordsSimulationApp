import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/CARE-logo.svg"
import { Navigate, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useUser } from '../context/UserContext';
import Spinner from '../components/Spinner';
import { useEffect } from 'react';

export default function Login() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm();
    
    const navigate = useNavigate();
    const { user, login, loading } = useUser();
    const [loginError, setLoginError] = React.useState(null);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setLoginError(null);
        try {
            const credentials = {
                Email: data.email,
                Password: data.password
            };
            
            const success = await login(credentials);
            if (!success) {
                setLoginError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.title || 
                               'Login failed. Please try again.';
            setLoginError(errorMessage);
        }
    };

    if (loading) return <Spinner />;
    if (user) return <Navigate to="/" replace />;

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
            
            {loginError && (
                <div className="alert alert-danger" style={styles.errorAlert}>
                    {loginError}
                </div>
            )}
            
            <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="email" style={styles.formLabel}>Email Address</label>
                    <input 
                        type="email" 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email" 
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })} 
                    />
                    {errors.email && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors.email.message}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" style={styles.formLabel}>Password</label>
                    <input 
                        type="password" 
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password" 
                        {...register('password', { 
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })} 
                    />
                    {errors.password && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
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