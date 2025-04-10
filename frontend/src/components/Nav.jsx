import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';


export default function Nav() {
    const { user, logout } = useUser();

    return (
        <>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', width: '100%', backgroundColor: '#101112', borderBottom: '2px solid #e94560' }}>
                <div>
                    {/* <Link to="/" className="btn btn-primary" backgroundColor="#004780" style={{ margin: '0 10px ' }}>Patients</Link> */}

                    {
                        // user ? null : <Link to="/login" className="btn btn-primary" style={{ margin: '0 10px' }}>Login</Link>
                        user ? <>
                            <Link to="/" className="btn btn-primary" style={{ margin: '0 10px ', backgroundColor: '#004780' }}>Patients</Link>
                            <Link to="/api/patients/create" className="btn btn-primary" style={{ margin: '0 10px ', backgroundColor: '#004780' }}>Create Patient</Link>

                        </> : null
                    }

                </div>
                {
                    user ? <div>
                        <div style={{ color: 'white', marginRight: '30px' }}>
                            {user.fullName}
                        </div>
                        <div style={{ textAlign: 'right', color: 'grey', fontSize: '0.8rem', cursor: 'pointer' }} onClick={logout}>
                            Log out
                        </div>
                    </div> : null
                }
            </nav>
        </>
    );

}