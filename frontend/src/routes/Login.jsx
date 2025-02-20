import React from 'react';
import Nav from '../ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    return (
        <>
        
        <div style={styles.container}>
            <h1 style={styles.title}>Nursing App Login</h1>
            <form style={styles.form}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
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
    },
    title: {
        marginBottom: '20px'
    },
    form: {
        width: '300px'
    }
};
