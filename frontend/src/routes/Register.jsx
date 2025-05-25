import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css";
import axios from '../utils/api';
import logo from "../img/CARE-logo.svg";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";
import { useState } from 'react';

export default function Registration() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const toProperCase = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const onSubmit = async (data) => {
        const formattedData = {
            FullName: toProperCase(data.fullName),
            Email: data.email.toLowerCase(),
            Password: data.password,
            ConfirmPassword: data.confirmPassword,
            StudentNumber: data.studentNumber,
            Campus: data.campus
        };

        try {
            const response = await axios.post(`/api/Auth/register`, formattedData);
            setSuccessMsg(`$${response?.data?.message || 'Success! Account has been created'}`);
            setErrMsg('');
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(`Registration failed: ${err.response?.data?.message || 'Unknown error'}`);
            }
        }
    };

    return (
        <>
            <div style={styles.container}>
                <div style={styles.logoCircle}>
                    <img src={logo} alt="app logo" style={styles.logoImage} />
                </div>

                <h1 style={styles.title}>Student Registration</h1>

                <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    {/* Display success message */}
                    {successMsg && (
                        <div style={styles.successMessage}>
                            {successMsg}
                        </div>
                    )}

                    {/* Display error message */}
                    {errMsg && (
                        <div style={styles.errorMessage}>
                            {errMsg}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="fullName" style={styles.formLabel}>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            {...register('fullName', {
                                required: "Full Name is required",
                                pattern: {
                                    value: /^[a-zA-Z-]{3,30}(?: [a-zA-Z-]{3,30})*$/,
                                    message: "Full Name must only contain letters and spaces, and cannot end with a space"
                                }
                            })}
                            maxLength={50}
                        />
                        {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" style={styles.formLabel}>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            {...register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@nscc\.ca$/,
                                    message: "Email must be a valid NSCC email (e.g., w0000000@nscc.ca)"
                                }
                            })}
                            maxLength={50}
                        />
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" style={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            {...register('password', {
                                required: "Password is required",
                                validate: {
                                    hasLowercase: (value) =>
                                        /[a-z]/.test(value) || "Password must include at least one lowercase letter",
                                    hasUppercase: (value) =>
                                        /[A-Z]/.test(value) || "Password must include at least one uppercase letter",
                                    hasNumber: (value) =>
                                        /[0-9]/.test(value) || "Password must include at least one number",
                                    hasSpecialChar: (value) =>
                                        /[!@#$%]/.test(value) || "Password must include at least one special character (!@#$%)",
                                    hasValidLength: (value) =>
                                        value.length >= 8 && value.length <= 24 || "Password must be between 8 and 24 characters",
                                },
                            })}
                        />
                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" style={styles.formLabel}>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === watch('password') || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="studentNumber" style={styles.formLabel}>Student Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentNumber"
                            {...register('studentNumber', {
                                required: "Student Number is required",
                                pattern: {
                                    value: /^w\d{7}$/,
                                    message: "Student Number must start with 'w' (lowercase) followed by 7 digits (e.g., w1234567)"
                                }
                            })}
                        />
                        {errors.studentNumber && <span className="text-danger">{errors.studentNumber.message}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="campus" style={styles.formLabel}>Campus</label>
                        <select
                            className="form-select"
                            id="campus"
                            {...register('campus', { required: true })}
                        >
                            <option value="">Select</option>
                            <option value="Ivany">Ivany</option>
                        </select>
                        {errors.campus && <span className="text-danger">This field is required</span>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ margin: '0 10px' }}>Register</button>
                </form>

                <p style={styles.loginPrompt}>
                    Already have an account? <span onClick={() => navigate('/login')} style={styles.loginLink}>Login here</span>.
                </p>
            </div>
        </>
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
    title: {
        marginBottom: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
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
    loginPrompt: {
        marginTop: '20px',
        color: '#fff',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    loginLink: {
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
    successMessage: {
        color: '#28a745',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontFamily: 'Arial, sans-serif',
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