import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import patientPhoto from '../img/Christina.jpg';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5232/Patient/${id}`)
      .then(response => setPatient(response.data))
      .catch(error => console.error('Error fetching patient:', error));
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column */}
        <div className="col-md-5">
          {/* Zone 1: Photo and Basic Info */}
          <div className="row mb-4">
            <div className="col-md-6">
              <img 
                src={patientPhoto}
                alt="Patient" 
                className="img-fluid rounded"
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
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>DOB:</strong> {patient.dob}</p>
                  <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>
                  <p><strong>Height:</strong> {patient.height}</p>
                  <p><strong>Weight:</strong> {patient.weight}</p>
                  <p><strong>Next of Kin:</strong> {patient.nextOfKin}</p>
                  <p><strong>Phone:</strong> {patient.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone 3: Medical Information */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Medical Information</h5>
              <p><strong>Reason for Admission:</strong> {patient.admissionReason}</p>
              <p><strong>Roam Alert Bracelet:</strong> {patient.roamAlert ? 'Yes' : 'No'}</p>
              <p><strong>Allergies:</strong> {patient.allergies}</p>
              <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
              <p><strong>Isolation Precautions:</strong> {patient.isolationPrecautions}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Assessments */}
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Assessments</h5>
              <div className="list-group">
                {[
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
                ].map((assessment, index) => (
                  <button 
                    key={index} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
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