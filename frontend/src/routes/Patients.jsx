import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../components/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router';
import ShiftSelection from '../components/ShiftSelection.jsx'; // Import the ShiftSelection component
import { useUser } from '../context/UserContext.jsx';
import Spinner from '../components/Spinner';
import {useTheme, useMediaQuery, Snackbar, Alert, Button, Box} from '@mui/material';

const Patients = () => {
  const [dataLoading, setDataLoading] = useState();
  const { user, loading } = useUser();
  const [patientData, setPatientData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null); // Store the selected shift
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); 

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const APIHOST = import.meta.env.VITE_API_URL;

  const getAllTestData = () => {
    const assessmentPrefixes = [
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

    const testsByPatient = {};

    // Scan localStorage for all assessment data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const prefixMatch = assessmentPrefixes.find(p => key.startsWith(p));
      
      if (prefixMatch) {
        // Extract patient ID from key (format: "prefix-patientId")
        const parts = key.split('-');
        const patientId = parts[parts.length - 1];
        
        if (!testsByPatient[patientId]) {
          testsByPatient[patientId] = {};
        }
        
        testsByPatient[patientId][key] = JSON.parse(localStorage.getItem(key));
      }
    }

    return testsByPatient;
  };

  /**
   * publishAllTests() will return either after successfully submitting all tests or encountering an error
   * during the process.
   */
  const publishAllTests = async () => {
    if (hasSubmitted || isPublishing) return;

    setIsPublishing(true);
    const allTests = getAllTestData();
    const patientIds = Object.keys(allTests);

    if (patientIds.length === 0) {
      setSnackbar({
        open: true,
        message: 'No assessments found in storage to publish.',
        severity: 'info'
      });
      setIsPublishing(false);
      return;
    }

    // Collect all test keys first to ensure we clear everything later
    const allTestKeys = [];
    patientIds.forEach(patientId => {
      Object.keys(allTests[patientId]).forEach(key => {
        allTestKeys.push(key);
      });
    });

    try {
      let successCount = 0;
      const failedSubmissions = [];

      // Attempt to submit all tests
      for (const patientId of patientIds) {
        try {
          await axios.post(
            `${APIHOST}/api/patients/${patientId}/submit-data`,
            allTests[patientId],
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to submit data for patient ${patientId}:`, error);
          failedSubmissions.push({
            patientId,
            error: error.response?.data?.message || error.message
          });
        }
      }

      // Clear ALL tests from storage regardless of success/failure
      allTestKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Store submission results
      if (failedSubmissions.length > 0) {
        sessionStorage.setItem('lastSubmissionErrors', JSON.stringify({
          timestamp: new Date().toISOString(),
          failedCount: failedSubmissions.length,
          totalCount: patientIds.length
        }));
      }

      setSnackbar({
        open: true,
        message: failedSubmissions.length > 0
          ? `Submitted ${successCount} of ${patientIds.length} assessments. ${failedSubmissions.length} failed to reach server.`
          : `Successfully submitted ${successCount} assessments.`,
        severity: failedSubmissions.length > 0 ? 'warning' : 'success'
      });

      setHasSubmitted(true);

    } catch (error) {
      console.error('System error during publishing:', error);
      setSnackbar({
        open: true,
        message: 'System error during publishing. No assessments were submitted.',
        severity: 'error'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // NOTE!!!
  // comment this section out to log in while testing! This validation is throwing login error in console.
  // if (!user) {
  //   console.log("not logged in redirect");
  //   return <Navigate to="/login" replace />;
  // } 

  /* This `useEffect` hook is used to perform side effects in function components.
  In this case, it is fetching patient data from a specified API endpoint when the component mounts
  for the first time (due to the empty dependency array `[]`). */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(`${APIHOST}/api/patients`);
        setPatientData(response.data); // Set patient data to state
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error); // Handle errors during fetching
      }
    };

    fetchData();
  }, []);

  // Fetch the shift from sessionStorage when the component mounts
  useEffect(() => {
    const storedShift = sessionStorage.getItem('selectedShift');
    if (storedShift) {
      setSelectedShift(storedShift); // Set shift state if already selected
    }
  }, []);

  // Handle patient card click and restrict access based on the selected shift
  const handleCardClick = (id) => {
    const storedShift = sessionStorage.getItem('selectedShift'); // Get the selected shift from sessionStorage
    if (!storedShift) {
      alert('Please select a shift first.'); // Alert if shift is not selected
      return;
    }

    // Get the current hour to check if it matches the selected shift
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    navigate(`/api/patients/${id}`); // Navigate to the patient details page
  };

  if (dataLoading) return <Spinner />

  return (
    <div className="PatientsPage">
      <header className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'black'
      }}>
        <span style={{ 
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          fontSize: '64px',
          color: 'white'
        }}>Patients</span>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          {!selectedShift && <ShiftSelection onSelectShift={setSelectedShift} />}
          <Button 
            variant="contained" 
            onClick={publishAllTests}
            disabled={hasSubmitted || isPublishing || getAllTestData().length === 0}
            sx={{ 
              minWidth: '200px',
              backgroundColor: hasSubmitted ? '#4CAF50' : '#004780',
              '&:hover': { 
                backgroundColor: hasSubmitted ? '#388E3C' : '#003366',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e'
              },
              py: 1.5,
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              textTransform: 'none',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 71, 128, 0.2)',
              height: '56px',
              alignSelf: 'center'
            }}
          >
            {isPublishing ? 'Sending...' : 
             hasSubmitted ? 'Submitted ✓' : 
             getAllTestData().length > 0 ? 'Send All Assessments' : 'No Tests to Send'}
          </Button>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row justify-content-center">
          {patientData.map((patient) => (
            <div className="col-sm-4 mb-4 d-flex justify-content-center" key={patient.patientId}>
              <PatientCard
                bedNumber={patient.bedNumber}
                // patientName={patient.patientName} uncomment this line to use patientName prop, however it should not be visible due to privacy reasons
                onClick={() => handleCardClick(patient.patientId)} // Handle card click with shift validation
              />
            </div>
          ))}
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({...prev, open: false}))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Patients;