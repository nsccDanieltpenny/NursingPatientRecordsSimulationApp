import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../components/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';


const Patients = () => {

// const [patientData, setPatientData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             console.log('Fetching Patient data...');
    //             // const response = await axios.get('http://localhost:5232/');
    //             console.log('Response:', response);
    //             setPatientData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             console.error('Axios error config:', error.config);
    //             console.error('Axios error request:', error.request);
    //             console.error('Axios error response:', error.response);
    //         }
    //     };
    // }, []);



    return(
        <>
            <div className="PatientsPage">
                <h1 className="header">Patients</h1>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm">
                                <PatientCard />
                                <PatientCard />
                                <PatientCard />
                                <PatientCard />
                                <PatientCard />
                            </div>
                            <div class="col-sm">
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            
                            </div>
                            <div class="col-sm">
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            </div>
                
                        </div>
                    </div>
            </div>
        </>
    )
}
export default Patients;

