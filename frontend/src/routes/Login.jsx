import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/logo.jpg"
import { Navigate, useNavigate, useOutletContext } from 'react-router';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useUser } from '../context/UserContext';

import Spinner from '../components/Spinner';

export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['nurse']);
    //const { setIsLoggedIn } = useOutletContext();
    const { user, login, loading } = useUser();

    if (loading) return <Spinner />

    if (user) return <Navigate to="/" replace />;

    const onSubmit = async (data) => {
        const formattedData = {
            Email: data.email,
            Password: data.password
        };
        console.log('Submitting data: ', formattedData);
        try {
            const response = await axios.post('http://localhost:5232/api/nurses/login', formattedData);
            console.log('Response:', response.data);
            login(formattedData);

            // setCookie('nurse', response.data, { path: '/' });

            // Update login state
            // setIsLoggedIn(true);

            // Redirect to the patients page
            navigate('/');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password.');
        }
    };

    return (
        <>

            <div style={styles.container}>
                <div style={styles.image}>
                    <img src={logo} alt="app logo" />
                </div>
                <h1 style={styles.title}>Please Log-In</h1>
                <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" {...register('email', { required: true })} />
                        {errors.email && <span>This field is required</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" {...register('password', { required: true })} />
                        {errors.password && <span>This field is required</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" backgroundcolor="$004780" style={{ margin: '0 10px' }}>Submit</button>
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
