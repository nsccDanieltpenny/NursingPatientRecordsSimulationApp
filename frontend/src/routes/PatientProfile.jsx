import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme, Button } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import { useUser } from '../context/UserContext';
import { Snackbar, Alert } from '@mui/material';
import LazyLoading from '../components/Spinner';
import { getPatientImageUrl } from '../utils/api';

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

  useEffect(() => {
    const fetchPatientData = async () => {
      console.log(user.token);
      try {
        const response = await axios.get(`/api/patients/${id}`);
        
        setPatientData(response.data);
        
        // debug logging
        if (response.data) {
          if (response.data.imageFilename) {
            try {
              const imageResponse = await getPatientImageUrl(response.data.imageFilename);
              setPatientImageUrl(imageResponse.url);
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

  if (loading) return <LazyLoading text="Loading patient record..." />;
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
