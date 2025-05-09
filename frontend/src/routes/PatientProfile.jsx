import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme, Button } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Snackbar, Alert } from '@mui/material';


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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

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
            try {
              // get access to image
              const imageResponse = await axios.get(
                `${IMAGEHOST}/api/GetImageUrl/${response.data.imageFilename}`
              );

              console.log(imageResponse);
              setPatientImageUrl(imageResponse.data.url);
              
            } catch (imageError) {
              console.error('Error fetching patient image:', imageError);
            }
          }
        } else {
          console.warn("No patient data returned from the API.");
        }

      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
        setSnackbar({
          open: true,
          message: 'Error: Failed to fetch patient data.',
          severity: 'error'
        });
        
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

      // console.log('Current patientData before submission:', flattenedTests);

      // Submit the full patientData object directly
      const response = await axios.post(
        `${APIHOST}/api/patients/${id}/submit-data`,
        flattenedTests,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log('Data successfully submitted:', response.data);
      setSnackbar({
        open: true,
        message: 'Patient record saved successfully!',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error saving patient record:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save patient record.',
        severity: 'error'
      });
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
     
        WebkitOverflowScrolling: 'touch', //fixes scroll issue on iOS
      }}
    >
      <Grid
        container
        spacing={isTablet ? 1 : 2} // Smaller gap on tablet portrait
        sx={{
          flexDirection: isTablet ? 'column' : 'row',
          alignItems: 'stretch',
          gap: isTablet ? 4: 2,
          order: isTablet ? 1 : 0, 
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
            flexGrow: 1,
            minHeight: 0, 
          
          }}
        >
          
          <Button onClick={savePatientRecord}
            variant="contained"
            color="primary"
            fullWidth
            size={isTablet ? 'medium' : 'large'}
            sx={{
              py: isTablet ? 1.5 : 2
            }}
          >
           Publish
          </Button>
          <PatientInfoCard patientData={patientData} patientImageUrl={patientImageUrl} onFieldChange={handleFieldChange} role={user ? user.roles : []} />
          
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
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            justifyContent: isTablet ? 'center' : 'flex-start',
       
          }}
        >
         
         {/*overiding height, as on iPad it will vertically stretch. */}
         <Box sx={{height: 'auto', mt: isTablet ? 6: 0,}}>
          <AssessmentsCard patientData={patientData} onFieldChange={handleFieldChange} />
          </Box>
        </Grid>

        {/* Save Button - Adjusted for tablet portrait */}
        {/*<Grid
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
          
        </Grid>
        */}
      </Grid>
      <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar(prev => ({...prev, open: false}))}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </Box>
  );
};

export default PatientProfile;
