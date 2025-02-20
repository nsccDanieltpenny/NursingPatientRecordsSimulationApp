import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../ui/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';


const Patients = () => {


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

