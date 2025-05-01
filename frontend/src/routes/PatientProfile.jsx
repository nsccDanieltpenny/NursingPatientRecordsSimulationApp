import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme, Button } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { ImageAspectRatioOutlined } from '@mui/icons-material';

const PatientProfile = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [patientImageUrl, setPatientImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const APIHOST = import.meta.env.VITE_API_URL;
  const IMAGEHOST = import.meta.env.VITE_FUNCTION_URL;

  useEffect(() => {
    const fetchPatientData = async () => {
      console.log(user.token);
      try {
        const response = await axios.get(
          `${APIHOST}/api/patients/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        
        setPatientData(response.data);
        
        // debug logging
        if (response.data) {
          console.log("Patient data fetched successfully:", response.data);
        
          if (response.data.imageFilename) {
            console.log("Image filename exists:", response.data.imageFilename);

            // get access to image
            const imageResponse = await axios.get(
              `${IMAGEHOST}/api/GetImageUrl/${response.data.imageFilename}`
            )

            console.log(imageResponse);
            setPatientImageUrl(imageResponse.data.url);

          } else {
            console.log("No image filename found in patient data.");
          }
        } else {
          console.warn("No patient data returned from the API.");
        }

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

      // Submit the full patientData object directly
      const response = await axios.post(
        `${APIHOST}/api/patients/${id}/submit-data`,
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
          <PatientInfoCard patientData={patientData} patientImageUrl={patientImageUrl} onFieldChange={handleFieldChange} />
          <MedicalInfoCard patientData={patientData} onFieldChange={handleFieldChange} />
        </Grid>

        {/* Right Column - Full width in tablet portrait */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            pl: isTablet ? 0 : 2, // No left padding in tablet portrait
            pt: isTablet ? 2 : 0 ,// Add top padding in tablet portrait
            
          }}
        >
         
         {/*overiding height, as on iPad it will vertically stretch. */}
         <Box sx={{height: 'auto'}}>
          <AssessmentsCard patientData={patientData} onFieldChange={handleFieldChange} />
          </Box>
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
