import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Nav() {
    return (
        <>
        <nav style={{display: 'flex', padding: '10px', width: '100%', backgroundColor: '#101112', borderBottom: '2px solid #e94560' }}>

            <Link to="/" className="btn btn-primary" backgroundColor="#004780" style={{ margin: '0 10px '}}>Patients</Link>
            

            <Link to="/login" className="btn btn-primary" style={{ margin: '0 10px' }}>Login</Link>

            {/* <Link to="/weather" className="btn btn primary" style={{ margin: '0 10px' }}>Weather</Link> */}

        </nav>
        </>
);

}