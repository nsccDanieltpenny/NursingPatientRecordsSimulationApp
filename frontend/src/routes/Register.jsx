import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from "react-router";
import logo from "../img/CARE-logo.svg";
import { useUser } from '../context/UserContext';
import Spinner from '../components/Spinner';

export default function Registration() {
    const APIHOST = import.meta.env.VITE_API_URL;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, loading } = useUser();

    if (loading) return <Spinner />;
    if (user) return <navigate to="/" replace />;

    const onSubmit = async (data) => {
        const formattedData = {
            FullName: data.fullName,
            Email: data.email,
            Password: data.password,
            ConfirmPassword: data.confirmPassword,
            StudentNumber: data.studentNumber,
            Campus: data.campus
        };

        try {
            const response = await axios.post(`${APIHOST}/api/Auth/register`, formattedData);
            alert(response.data.message);
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <>
            <div style={styles.container}>
                <div style={styles.image}>
                    <div style={styles.ovalWrapper}>
                        <img src={logo} alt="app logo" style={styles.ovalImage} />
                    </div>
                </div>
                <h1 style={styles.title}>Student Registration</h1>
                <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            {...register('fullName', { required: true })}
                        />
                        {errors.fullName && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            {...register('password', { required: true, minLength: 6 })}
                        />
                        {errors.password && <span className="text-danger">Password must be at least 6 characters</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            {...register('confirmPassword', { required: true, minLength: 6 })}
                        />
                        {errors.confirmPassword && <span className="text-danger">Password must be at least 6 characters</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="studentNumber" className="form-label">Student Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentNumber"
                            {...register('studentNumber', { required: true })}
                        />
                        {errors.studentNumber && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="campus" className="form-label">Campus</label>
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
        padding: '10px',
    },
    title: {
        marginBottom: '20px',
        margin: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600'
    },
    form: {
        width: '80%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    ovalWrapper: {
        width: '40vw',
        height: '40vh',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        marginBottom: "5px"
    },
    ovalImage: {
        maxWidth: '100%',
        height: 'auto',
        width: 'auto',
    },
    loginPrompt: {
        marginTop: '15px',
        color: '#fff',
        fontSize: '0.9rem',
    },
    loginLink: {
        color: '#ffef00',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};