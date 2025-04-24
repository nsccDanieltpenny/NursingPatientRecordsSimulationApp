import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme, Button } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const PatientProfile = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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
    <Box
      sx={{
        padding: {
          xs: '16px', // Mobile
          sm: '20px', // Tablet
          md: '24px' // Desktop
        },
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: '80vh',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <Grid
        container
        spacing={isTablet ? 1 : 2} // Smaller gap on tablet portrait
        sx={{
          flexDirection: isTablet ? 'column' : 'row',
          alignItems: 'stretch'
        }}
      >
        {/* Left Column - Stacked in tablet portrait */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: isTablet ? 1 : 2 
          }}
        >
          <PatientInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
          <MedicalInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
        </Grid>

        {/* Right Column - Full width in tablet portrait */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            pl: isTablet ? 0 : 2, // No left padding in tablet portrait
            pt: isTablet ? 2 : 0 // Add top padding in tablet portrait
          }}
        >
          <AssessmentsCard patientData={patientData} onFieldChange={handleFieldChange} />
        </Grid>

        {/* Save Button - Adjusted for tablet portrait */}
        <Grid
          item
          xs={12}
          sx={{
            mt: isTablet ? 1 : 2, // Smaller top margin in tablet portrait
            position: isTablet ? 'sticky' : 'static',
            bottom: isTablet ? '16px' : 'auto',
            zIndex: isTablet ? 1000 : 'auto',
            backgroundColor: isTablet ? 'background.paper' : 'transparent',
            padding: isTablet ? '8px' : 0,
            boxShadow: isTablet ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <Button
            onClick={savePatientRecord}
            variant="contained"
            color="primary"
            fullWidth
            size={isTablet ? 'medium' : 'large'}
            sx={{
              py: isTablet ? 1.5 : 2
            }}
          >
            Save Patient Record
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientProfile;
