import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css";
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function Registration() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const formattedData = {
            FullName: data.fullName, 
            Email: data.email,
            StudentNumber: data.studentNumber,
            Password: data.password,
        };
    
        try {
            const response = await axios.post('http://localhost:5232/api/nurses/register', formattedData);
            alert(response.data.message); 
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
