import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from "react-router";

export default function Registration() {

    const APIHOST = import.meta.env.VITE_API_URL;

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const onSubmit = async (data) => {

        

        ///////////////////////////////////////////////
        /* This component will eventually be accessed
         * by an 'Authorized' user (teacher). Who will
         * add each student (nurse) to a class list per
         * semester. As of 03-21-2025, we haven't built 
         * our Roles functionality yet. 
         * 
         * NOTE: 
         * Please DO NOT make alterations to this code 
         * until it's approved by consensus by the team.
         * It makes our lives so much easier and vers.
         * control is already so weird lol
         * 
         * -dylan 
         * 
         *
         */
        ///////////////////////////////////////////////
        const formattedData = {
            FullName: data.fullName,
            Email: data.email,
            Password: data.password,
            ConfirmPassword: data.confirmPassword,
            StudentNumber: data.studentNumber
        };

        try {
            const response = await axios.post(`${APIHOST}/api/Auth/register`, formattedData);
            console.log(APIHOST);
            alert(response.data.message);
            console.log(response);
            navigate("/login")
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
                <h1 style={styles.title}>Student Registration</h1>


                <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            {...register('fullName')}
                        />
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
                        <label htmlFor="studentNumber" className="form-label">Student Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentNumber"
                            {...register('studentNumber', { required: true })}
                        />
                        {errors.StudentNumber && <span className="text-danger">This field is required</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Register</button>
                </form>
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
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
    },
    title: {
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#343a40',
    },
    form: {
        width: '300px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    }
};
