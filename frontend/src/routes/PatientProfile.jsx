
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; //<--Added useNavigate
// import patientPhoto from '../img/Christina.jpg';

const PatientProfile = () => {

  const { id } = useParams(); // Retrieve patientId from URL
  const [patientData, setPatientData] = useState(null);
    console.log(id);

    //for navigation
    const navigate = useNavigate();


  useEffect(() => {
    const fetchPatientData = async () => {
      try { 
        console.log(`Fetching patient with id: ${id}`);
        const response = await axios.get(`http://localhost:5232/patient/${id}`);
        console.log('Response:', response.data);
        setPatientData(response.data);
      } catch (error) {
          console.error('Error fetching patient:', error);
      }
    };
    fetchPatientData();
  }, [id]); 

  if (!patientData) {
    return <div>Loading...</div>;
  }

  //Return unique patient img
  console.log('pfp url:', patientData.photo)
    const imgUrl = `http://localhost:5232${patientData.photo}`;


    //assestments arr
    const assessments = [
        'Cognitive',
        'Nutrition',
        'Elimination',
        'Mobility',
        'Safety',
        'ADLs',
        'Sensory Aids / Prosthesis',
        'Skin Integrity',
        'Behaviour/Mood',
        'Progress Note'
    ];

  
    const assessmentRoutes = {
        Elimination: `/patient/${id}/elimination`,
        Nutrition: `/patient/${id}/nutrition` ,
        Mobility: `/patient/${id}/mobility`,
    }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column */}
        <div className="col-md-5">
          {/* Zone 1: Photo and Basic Info */}
          <div className="row mb-4">
            <div className="col-md-6">
            <img 
              src={imgUrl} 
              alt="Patient" 
              className="img-fluid rounded"
              loading="lazy"
              style={{ 
                maxWidth: '500px',  
                width: '100%',      
                height: 'auto',    
                objectFit: 'cover'  
              }}
            />
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <p><strong>Name:</strong> {patientData.name}</p>
                  <p><strong>DOB:</strong> {patientData.dob}</p>
                  <p><strong>Marital Status:</strong> {patientData.maritalStatus}</p>
                  <p><strong>Height:</strong> {patientData.height}</p>
                  <p><strong>Weight:</strong> {patientData.weight}</p>
                  <p><strong>Next of Kin:</strong> {patientData.nextOfKin}</p>
                  <p><strong>Phone:</strong> {patientData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone 3: Medical Information */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Medical Information</h5>
              <p><strong>Reason for Admission:</strong> {patientData.admissionReason}</p>
              <p><strong>Roam Alert Bracelet:</strong> {patientData.roamAlert ? 'Yes' : 'No'}</p>
              <p><strong>Allergies:</strong> {patientData.allergies}</p>
              <p><strong>Medical History:</strong> {patientData.medicalHistory}</p>
              <p><strong>Isolation Precautions:</strong> {patientData.isolationPrecautions}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Assessments */}
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Assessments</h5>
              <div className="list-group">
                    {assessments.map((assessment, index) => (
                    <button
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    onClick={() => {
                    console.log(`Selected: ${assessment}`);
                    const route = assessmentRoutes[assessment];
                    if (route) {
                    console.log(`Navigating to ${route}`);
                         navigate(route);
                      }
                     }}
                     >
                     {assessment}
                     <span className="badge bg-primary rounded-pill">→</span>
                    </button>

                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;