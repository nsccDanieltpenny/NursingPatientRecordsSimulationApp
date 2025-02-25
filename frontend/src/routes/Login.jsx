import React from 'react';
import Nav from '../components/Nav.jsx';
import { Link } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/logo.jpg"


export default function Login() {
    return (
        <>
        
        <div style={styles.container}>
            <div style={styles.image}>
                <img src={logo} alt="app logo" />
            </div>
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
                
                <Link to="/" className="btn btn-primary" backgroundcolor="$004780" style={{ margin: '0 10px'}}>Submit</Link>
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
        marginBottom: '20px',
        margin: '20px'
    },
    form: {
        width: '300px',
        backgroundColor: '#fff' 
    },
    image: {
        marginBottom: '50px'
    }
};
