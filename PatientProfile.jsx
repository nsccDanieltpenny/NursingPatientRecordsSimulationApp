import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import PatientInfoCard from '../components/profile-components/PatientInfoCard';
import AssessmentsCard from '../components/profile-components/AssessmentsCard'; 
import MedicalInfoCard from '../components/profile-components/MedicalInfoCard';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  InputAdornment
} from '@mui/material';


const PatientProfile = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm')); // Detects iPad orientation
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5232/api/patients/${id}`);
        setPatientData(response.data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div>{error}</div>;
  if (!patientData) return <div>No patient data found</div>;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        padding: '20px',
        // Account for iPad safe areas
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: '100vh',
        flexDirection: isTablet ? 'row' : 'column'
      }}
    >
      
      <Grid item xs={12} sm={5}>
        <PatientInfoCard patientData={patientData} />
        <MedicalInfoCard patientData={patientData} />
      </Grid>

      
      <Grid item xs={12} sm={6}>
      <Box sx={{ maxWidth: { sm: '300px' } }}> 
        <AssessmentsCard />
      </Box>
      </Grid>
    </Grid>
  )
}

export default PatientProfile;