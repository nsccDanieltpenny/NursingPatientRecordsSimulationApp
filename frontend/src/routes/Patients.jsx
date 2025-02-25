import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../components/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Patients = () => {
  const [patientData, setPatientData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate


  /* This `useEffect` hook is used to perform side effects in function components.
  In this case, it is fetching patient data from a specified API endpoint when the component mounts
  for the first time (due to the empty dependency array `[]`). */
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

  const handleCardClick = (patientId) => {
    navigate(`/patient/${patientId}`); // Navigate to the profile page
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
                onClick={() => handleCardClick(patient.PatientId)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
