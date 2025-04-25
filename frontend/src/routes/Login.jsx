import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"
import logo from "../img/CARE-logo.svg"
import { Navigate, useNavigate, useOutletContext } from 'react-router';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useUser } from '../context/UserContext';


import Spinner from '../components/Spinner';

export default function Login() {

    const APIHOST = import.meta.env.VITE_API_URL;
    
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
            const response = await axios.post(`${APIHOST}/api/Auth/login`, formattedData);
            console.log(import.meta.env);
            console.log('Response:', response.data);
            login(response.data);

            // setCookie('nurse', response.data, { path: '/' });

            // Update login state
            // setIsLoggedIn(true);

            // Redirect to the patients page
            navigate('/');
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 401) {
                alert(error.response?.data?.message || 'Invalid credentials');
            } else {
                alert(error.response?.data?.message || 'Login failed. Please try again.');
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
                <p style={styles.registerPrompt}>
                    Haven't created an account? <span onClick={() => navigate('/register')} style={styles.registerLink}>Register here</span>.
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
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #004780, #00bfff)',
    },
    title: {
        marginBottom: '20px',
        margin: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600'
    },
    form: {
        width: '350px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    ovalWrapper: {
        width: '600px',
        height: '490px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        marginBottom: "20px"
    },
    ovalImage: {
        // width: '100%',
        objectFit: "cover",
        height: '105%',
    },
    registerPrompt: {
        marginTop: '15px',
        color: '#fff',
        fontSize: '0.9rem',
    },
    registerLink: {
        color: '#ffef00',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

