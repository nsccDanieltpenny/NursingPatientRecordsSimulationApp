import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const InstructorProfile = () => {

    const instructors = [
    {
        nurseId: 1,
        patientId: null,
        fullName: "Dr. Sarah Mitchell",
        studentNumber: "INST001",
        email: "sarah.mitchell@nursingschool.edu",
        patients: [],
        classId: null,
        class: null,
        valid: true
    },
    {
        nurseId: 2,
        patientId: null,
        fullName: "Prof. Michael Chen",
        studentNumber: "INST002",
        email: "michael.chen@nursingschool.edu",
        patients: [],
        classId: null,
        class: null,
        valid: true
    },
    {
        nurseId: 3,
        patientId: null,
        fullName: "Dr. Emily Rodriguez",
        studentNumber: "INST003",
        email: "emily.rodriguez@nursingschool.edu",
        patients: [],
        classId: null,
        class: null,
        valid: false
    }
    ];

    const [dataLoading, setDataLoading] = useState(true);
    const [instructorData, setInstructorData] = useState([]);
    const [validInstructors, setValidInstructors] = useState([]);
    const[invalidInstructors, setInvalidInstructors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        fetchAllInstructors();
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching /instructors data:', error);
      }
    };
    fetchData();
  }, []);

  

  // Fetch instructors from API
  // WHAT IT SHOULD DO: Fetch all instructors
  const fetchAllInstructors = async () => {
    try {
        //const response = await axios.get(`api/instructors`);
        //const data = response.data;
        //setInstructorData(data);
        console.log("Instructor data response:", instructors);
        
        //currently using dummy data, but take the data and set a state with all instructors,
        // then filter into valid and invalid lists
        setInstructorData(instructors);
        const validList = instructors.filter(inst => inst.valid);
        const invalidList = instructors.filter(inst => !inst.valid);
        setValidInstructors(validList);
        setInvalidInstructors(invalidList);
    } catch (error) {
      console.error('Error fetching available instructors:', error);
    }
  };

  
  // Invalidate Instructor
  // WHAT IT SHOULD DO: Remove Instructor validation via API 
  const handleInvalidateInstructor = async (instructorId) => {
    try {
        console.log(`Removing validation for instructor ${instructorId} API call placeholder`);
        instructors.find(inst => inst.nurseId === instructorId).valid = false;
        //whatever call here that will invalidate the instructor
        //await axios.put(`/api/instructor/${instructorId}/invalidate`);
      
        //refetch instructors
        fetchAllInstructors();

    } catch (error) {
      console.error('Error removing instructor:', error);
    }
    };
    
    // Validate Instructor
    const handleValidateInstructor = async (instructorId) => {
    try {
        console.log(`Validating instructor ${instructorId} API call placeholder`);
        instructors.find(inst => inst.nurseId === instructorId).valid = true;
        //whatever call here that will validate the instructor
        //await axios.put(`/api/instructor/${instructorId}/validate`);

        //refetch instructors
        fetchAllInstructors();

    } catch (error) {
      console.error('Error validating instructor:', error);
    }
  };

  if (dataLoading) return <div>Loading Instructors...</div>;

  return (
    <div style={{padding: '20px'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Valid Instructor List
          </Typography>
          <TableContainer component={Paper} style={{marginBottom: '20px'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>W#</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {validInstructors.map((nurse) => (
                  <TableRow key={nurse.nurseId}>
                    <TableCell>{nurse.fullName}</TableCell>
                    <TableCell>{nurse.email}</TableCell>
                    <TableCell>{nurse.studentNumber}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleInvalidateInstructor(nurse.nurseId)}
                      >
                        Invalidate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                  </TableContainer>
                  <Typography variant="h4" gutterBottom>
            Invalid Instructor List
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>W#</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invalidInstructors.map((nurse) => (
                  <TableRow key={nurse.nurseId}>
                    <TableCell>{nurse.fullName}</TableCell>
                    <TableCell>{nurse.email}</TableCell>
                    <TableCell>{nurse.studentNumber}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleValidateInstructor(nurse.nurseId)}
                      >
                        Validate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
};

export default InstructorProfile;