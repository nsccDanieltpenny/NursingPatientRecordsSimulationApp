import React, { useState, useEffect } from 'react';
import { Grid, Button, useMediaQuery, useTheme } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PatientProfile = () => {
  const theme = useTheme();
  const isLandscape = useMediaQuery(theme.breakpoints.up('md')); // Detects iPad orientation
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [originalPatientData, setOriginalPatientData] = useState(null); // To store the original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5232/api/patients/${id}`);
        setPatientData(response.data);
        setOriginalPatientData(response.data); // Store original data
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const formatDate = (date) => {
    const [day, month, year] = date.split('.');  // assuming input format is 'dd.MM.yyyy'
    return `${year}-${month}-${day}`;  // convert to 'yyyy-MM-dd' format
  };

  const handleFieldChange = (field, value) => {
    setPatientData((prevData) => ({
      ...prevData,
      [field]: value,  // Update specific field
    }));
  };

  const savePatientRecord = async () => {
    try {
      // Check for changes and only include updated fields
      const updatedData = {};
      
      Object.keys(patientData).forEach((key) => {
        if (patientData[key] !== originalPatientData[key]) {
          updatedData[key] = patientData[key]; // Include only updated fields
        }
      });

      // Log the updated data
      console.log('Updated data:', updatedData);

      // Send the POST request to submit only updated fields
      const response = await axios.post(`http://localhost:5232/api/patients/${id}/submit-data`, updatedData);
      console.log('Data successfully submitted:', response.data);
      alert('Patient record saved successfully!');
    } catch (error) {
      console.error('Error saving patient record:', error);
      alert('Failed to save patient record.');
    }
  };

  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div>{error}</div>;
  if (!patientData) return <div>No patient data found</div>;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        padding: '20px',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12} md={5}>
        <PatientInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
        <MedicalInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
      </Grid>

      <Grid item xs={12} md={7}>
        <AssessmentsCard onFieldChange={handleFieldChange} />
      </Grid>

      {/* Button placed below Medical Information and Allergies */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Button onClick={savePatientRecord} variant="contained" color="primary" fullWidth>
          Save Patient Record
        </Button>
      </Grid>
    </Grid>
  );
};

export default PatientProfile;