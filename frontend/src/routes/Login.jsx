import React, { useState } from 'react';
import Nav from '../ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router';

export default function Login() {
    const {user, login} = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if(user) return <Navigate to="/" replace />;

    const handleSubmit = async (e)=>{
        console.log("handle submit", email,password);
        e.preventDefault();
        
        await login({
            Email:email,
            Password:password
        });
    }

    return (
        <>
        
        <div style={styles.container}>
            <h1 style={styles.title}>Nursing App Login</h1>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                           value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" 
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
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
        backgroundColor: '#f8f9fa'
    },
    title: {
        marginBottom: '20px'
    },
    form: {
        width: '300px'
    }
};
