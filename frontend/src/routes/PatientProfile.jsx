import React, { useState, useEffect } from 'react';
import { Grid, useMediaQuery, useTheme, Button } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const PatientProfile = () => {
  const theme = useTheme();
  const isLandscape = useMediaQuery(theme.breakpoints.up('md'));
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  // const [assessmentTableValues, setAssessmentTableValues] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5232/api/patients/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // const apiPatientData = response.data;
        setPatientData(response.data);

        // const medicalInfo = JSON.parse(localStorage.getItem(`patient-medicalInfo-${id}`)) || {};

        // const assessmentKeys = [
        //   'patient-adl',
        //   'patient-behaviour',
        //   'patient-cognitive',
        //   'patient-elimination',
        //   'patient-mobility',
        //   'patient-nutrition',
        //   'patient-progressnote',
        //   'patient-safety',
        //   'patient-skinandsensoryaid',
        // ];

        // // Flattened test data
        // const flattenedTests = {};
        // assessmentKeys.forEach((key) => {
        //   const testData = JSON.parse(localStorage.getItem(`${key}-${id}`)) || {};
        //   if (Object.keys(testData).length > 0) {
        //     flattenedTests[`${key}-${id}`] = testData;
        //   }
        // });

        // const combinedPatientData = {
        //   ...apiPatientData,
        //   medicalInfo,
        //   ...flattenedTests,
        // };

        // setPatientData(combinedPatientData);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (user && loading) {
      fetchPatientData();
    }
  }, [id, user, loading]);

  const handleFieldChange = (field, value) => {
    setPatientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };



  const savePatientRecord = async () => {
    try {
      const assessmentKeys = [
        'patient-adl',
        'patient-behaviour',
        'patient-cognitive',
        'patient-elimination',
        'patient-mobility',
        'patient-nutrition',
        'patient-progressnote',
        'patient-safety',
        'patient-skinsensoryaid',
        'patient-profile'
      ];

      // Flattened test data
      const flattenedTests = {};
      assessmentKeys.forEach((key) => {
        const testData = JSON.parse(localStorage.getItem(`${key}-${id}`)) || {};
        if (Object.keys(testData).length > 0) {
          flattenedTests[`${key}-${id}`] = testData;
        }
      });

      console.log('Current patientData before submission:', flattenedTests);
      // setAssessmentTableValues(flattenedTests);

      // Submit the full patientData object directly
      const response = await axios.post(
        `http://localhost:5232/api/patients/${id}/submit-data`,
        flattenedTests,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
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
        minHeight: '80vh',
      }}
    >
      <Grid item xs={12} md={5}>
        <PatientInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
        <MedicalInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
      </Grid>

      <Grid item xs={12} md={7}>
        <AssessmentsCard patientData={patientData} onFieldChange={handleFieldChange} />
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Button onClick={savePatientRecord} variant="contained" color="primary" fullWidth>
          Save Patient Record
        </Button>
      </Grid>
    </Grid>
  );
};

export default PatientProfile;
