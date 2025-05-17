import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BedCard from '../components/home_components/BedCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router';
import ShiftSelection from '../components/ShiftSelection.jsx'; 
import { useUser } from '../context/UserContext.jsx';
import Spinner from '../components/Spinner';
import {useTheme, useMediaQuery, Snackbar, Alert, Button, Box} from '@mui/material';




const Patients = () => {
  const [dataLoading, setDataLoading] = useState();
  const { user, loading } = useUser();
  const [patientData, setPatientData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); 
  const [assessmentsCount, setAssessmentsCount] = useState(0);

  // Notifications 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });


  const APIHOST = import.meta.env.VITE_API_URL;

  /////////////////////////////
  //        FUNCTIONS:       //
  ///////////////////////////// 

  const generateAllBeds = (patients, totalBeds = 15) => {
    const occupiedBedNumbers = new Set(patients.map(p => p.bedNumber));
    const allBeds = [];
    
    for (let i = 1; i <= totalBeds; i++) {
      const patient = patients.find(p => p.bedNumber === i);
      allBeds.push({
        bedNumber: i,
        isOccupied: occupiedBedNumbers.has(i),
        patientId: patient?.patientId || null,
        unit: patient?.Unit || '4260' // NOTE : hardcoded unitID for 'Ivany' campus, will have to be refactored when other campuses are introduced
      });
    }
    
    return allBeds;
  };

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
    let totalCount = 0; //tracks the num of completed assessments available to publish

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
        totalCount++; //increment for each completed assessment found
      }
    }

    setAssessmentsCount(totalCount); 
    return testsByPatient;
  };

  
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
  // Initialize count on load

  /////////////////////////////
  //          HOOKS          //
  /////////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(`${APIHOST}/api/patients`);
        const allBeds = generateAllBeds(response.data);
        setPatientData(allBeds); 
        getAllTestData(); 
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  //listener for changes to storage (reading for added assessments to submit)
  useEffect(() => {
    const handleStorageChange = () => {
      getAllTestData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /////////////////////////////
  //     HANDLERS & EVENTS   //
  /////////////////////////////

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
        padding: '5px',
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
            disabled={hasSubmitted || isPublishing || assessmentsCount === 0}
            // overriding any default styling below:
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
             assessmentsCount > 0 ? `${assessmentsCount} Assessment${assessmentsCount !== 1 ? 's' : ''} to Publish` : 'No Tests Completed'}
          </Button>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row justify-content-center">

          {/* Maps over `patientData` array and renders a list of
          `BedCard` components based on the data in each `bed` object. */}
          {patientData.map((bed) => (
            <div className="col-sm-4 mb-4 d-flex justify-content-center" key={`bed-${bed.bedNumber}`}>
              <BedCard
                bedNumber={bed.bedNumber}
                isOccupied={bed.isOccupied}
                unitId={bed.unit}
                onClick={bed.isOccupied ? () => handleCardClick(bed.patientId) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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