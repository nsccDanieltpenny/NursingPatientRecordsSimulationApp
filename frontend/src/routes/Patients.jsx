import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../components/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';

const Patients = () => {

//patient state with hardcoded info
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Patient data...');
        const response = await axios.get('http://localhost:5232/patient');
        console.log('Response:', response);
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, []);

  const handleCardClick = (bedNumber, name) => {
    console.log(`Clicked on bed number: ${bedNumber}, patient name: ${name}`);
  };



  return (
    <div className="PatientsPage">
      <h1 className="header">Patients</h1>
      <div className="container-fluid">
        <div className="row justify-content-center">

          {patientData.map((patient) => (
            <div className="col-md-4 mb-4" key={patient.bedNumber}>
              <PatientCard 
                bedNumber={patient.bedNumber} 
                name={patient.name} 
                onClick={() => handleCardClick(patient.bedNumber, patient.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
