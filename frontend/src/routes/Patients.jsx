import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../components/PatientCard.jsx';
import '../css/home_styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router';
import ShiftSelection from '../components/ShiftSelection.jsx'; 
import { useUser } from '../context/UserContext.jsx';
import Spinner from '../components/Spinner';

const Patients = () => {
  const [dataLoading, setDataLoading] = useState();
  const { user, setUser, loading,shift,logout } = useUser();
  const [patientData, setPatientData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null); 
  const navigate = useNavigate();



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
        console.log("feetching data",user.token);
        
        const response = await axios.get(
          'http://localhost:5232/api/Patients/nurse/ids',
          { headers: {Authorization: `Bearer ${user.token}`}}
        );
        const patients = response.data;
        const myPatients = []
        for (const patient of patients) {
          if(patient.nurseId === user.nurseId){
            myPatients.push(patient);
          }
        }
        console.log("mypatients", myPatients);
        
        user.myPatients = myPatients;
        
        setPatientData(patients); // Set patient data to state
        setDataLoading(false);
        console.log("patient data",response.data);
        
      } catch (error) {
        setDataLoading(false);
        console.error('Error fetching data:', error); // Handle errors during fetching

        
        if(error.response?.statusText == "Unauthorized"){
          alert("You're not logged In!")
          logout();
        }
      }
    };
    if(user && !dataLoading)
      fetchData();
  }, [user]);

  // Fetch the shift from sessionStorage when the component mounts
  useEffect(() => {
    const storedShift = sessionStorage.getItem('selectedShift');
    if (storedShift) {
      setSelectedShift(storedShift); // Set shift state if already selected
    }
  }, []);

  // Handle patient card click and restrict access based on the selected shift
  const handleCardClick = (id) => {
    const storedShift = sessionStorage.getItem('selectedShift'); 
    if (!storedShift) {
      alert('Please select a shift first.'); 
      return;
    }

    // Get the current hour to check if it matches the selected shift
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Logic to check if the current time falls within the selected shift time
    /* if (
       (storedShift === 'Morning' && (currentHour < 6 || currentHour >= 12)) ||
       (storedShift === 'Afternoon' && (currentHour < 12 || currentHour >= 18)) ||
       (storedShift === 'Evening' && (currentHour < 18 || currentHour >= 24))
     ) {
       alert('You can only access patient records during the assigned shift.'); // Alert if outside shift time
       return;
     } */

    navigate(`/api/patients/${id}`); // Navigate to the patient details page
  };

  //check AFTER all hooks are rendered, otherwise React throws a 404
  if (loading) return <Spinner />
  if (!user) {
    console.log("Not logged in. Redirecting...");
  }
  if (dataLoading) return <Spinner />

  return (
    <div className="PatientsPage">
      <div className='PatientPageBg' style={{minHeight:'calc(100vh - 60px)'}}></div>
      <h1 className="header">Patients</h1>

      {/* Render the Shift Selection component if no shift is selected */}
      {!shift && <ShiftSelection onSelectShift={setSelectedShift} />}

      <div className="container-fluid">
        <div className="row">
          {patientData.map((patient) => (
            <div className="col-md-4 mb-4" key={patient.patientId}>
              <PatientCard
                bedNumber={patient.bedNumber}
                name={patient.fullName}
                onClick={() => handleCardClick(patient.patientId)} // Handle card click with shift validation
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;