import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Grid,
  Box,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { dummyClassData, dummyStudents, dummyInstructors } from '../utils/dummyClassData';

const ClassProfile = () => {
  const [dataLoading, setDataLoading] = useState(false); //set to true for api loading
  const [nursesInClass, setNursesInClass] = useState([]);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [showAvailableNurses, setShowAvailableNurses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();

  // Dummy testing:
  //NOTE: I have been working on getting the dummy calls to work, 
  // the API ones are the old methods

  // MOCK: Fetch nurses in class on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Filter students who are in this class
        const studentsInClass = dummyStudents.filter(
          student => student.classId === parseInt(id)
        );
        
        
        setNursesInClass(studentsInClass);
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDataLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // REAL API call (commented out for testing)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setDataLoading(true);
  //       const response = await axios.get(`/api/Class/${id}/students`);
  //       setNursesInClass(response.data);
  //       setDataLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, [id]);

  // MOCK: Fetch available nurses not in class
  // TODO: modify to only show Ivany campus nurses(API doesn't have campus field in dummy data)
  const fetchAvailableNurses = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      //Students who arent in a class 
        const unassignedStudents = dummyStudents.filter(
          student => student.classId === null
      );
      
      setAvailableNurses(unassignedStudents);
    } catch (error) {
      console.error('Error fetching available nurses:', error);
    }
  };

  // REAL API call (commented out for testing)
  // const fetchAvailableNurses = async () => {
  //   try {
  //     const response = await axios.get('/api/Class/nurses');
  //     // Filter out nurses that are already in the class and only show Ivany campus nurses
  //     const nursesInClassIds = nursesInClass.map(nurse => nurse.nurseId);
  //     const filteredNurses = response.data.filter(nurse => 
  //       !nursesInClassIds.includes(nurse.nurseId) && 
  //       nurse.campus === 'Ivany'
  //     );
  //     setAvailableNurses(filteredNurses);
  //   } catch (error) {
  //     console.error('Error fetching available nurses:', error);
  //   }
  // };

  // MOCK: Remove nurse from class
  const handleRemoveNurse = async (nurseId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the nurse and update their classId to null
      const nurseToRemove = dummyStudents.find(n => n.nurseId === nurseId);
      if (nurseToRemove) {
        nurseToRemove.classId = null;
      }
      
      // Refresh the class list
      const studentsInClass = dummyStudents.filter(
        student => student.classId === parseInt(id)
      );
      setNursesInClass(studentsInClass);
      
      // If available nurses are being shown, refetch them
      if (showAvailableNurses) {
        fetchAvailableNurses();
        setAvailableNurses(availableNurses);
      }
    } catch (error) {
      console.error('Error removing nurse:', error);
    }
  };

  // REAL API call (commented out for testing)
  // const handleRemoveNurse = async (nurseId) => {
  //   try {
  //     await axios.delete(`/api/Class/${id}/students/${nurseId}`);
  //     const classResponse = await axios.get(`/api/Class/${id}/students`);
  //     setNursesInClass(classResponse.data);
  //     
  //     // If available nurses are being shown, refetch them
  //     if (showAvailableNurses) {
  //       const nursesResponse = await axios.get('/api/Class/nurses');
  //       const nursesInClassIds = classResponse.data.map(nurse => nurse.nurseId);
  //       const filteredNurses = nursesResponse.data.filter(nurse => 
  //         !nursesInClassIds.includes(nurse.nurseId) && 
  //         nurse.campus === 'Ivany'
  //       );
  //       setAvailableNurses(filteredNurses);
  //     }
  //   } catch (error) {
  //     console.error('Error removing nurse:', error);
  //   }
  // };

  // MOCK: Add nurse to class
  const handleAddNurse = async (nurseId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the nurse and update their classId
      const nurseToAdd = dummyStudents.find(n => n.nurseId === nurseId);
      if (nurseToAdd) {
        nurseToAdd.classId = parseInt(id);
      }
      
      // Refresh the class list
      const studentsInClass = dummyStudents.filter(
        student => student.classId === parseInt(id)
      );
      setNursesInClass(studentsInClass);
      
      // Remove from available nurses list
      setAvailableNurses(availableNurses.filter(nurse => nurse.nurseId !== nurseId));
    } catch (error) {
      console.error('Error adding nurse:', error);
    }
  };

  // REAL API call (commented out for testing)
  // const handleAddNurse = async (nurseId) => {
  //   try {
  //     await axios.post(`/api/Class/${id}/students`, {nurseId: nurseId});
  //     const classResponse = await axios.get(`/api/Class/${id}/students`);
  //     setNursesInClass(classResponse.data);
  //     setAvailableNurses(availableNurses.filter(nurse => nurse.nurseId !== nurseId));
  //   } catch (error) {
  //     console.error('Error adding nurse:', error);
  //   }
  // };

  const toggleAvailableNurses = async () => {
    if (!showAvailableNurses) {
      await fetchAvailableNurses();
    }
    setShowAvailableNurses(!showAvailableNurses);
  };

  const filteredAvailableNurses = availableNurses.filter(nurse => {
    const searchLower = searchQuery.toLowerCase();
    return (
      nurse.fullName.toLowerCase().includes(searchLower) ||
      nurse.email.toLowerCase().includes(searchLower) ||
      nurse.studentNumber.toLowerCase().includes(searchLower)
    );
  });

  if (dataLoading) return <div>Loading class...</div>;
  
  return (
    <div style={{padding: '20px'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Class List
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
                {nursesInClass.map((nurse) => (
                  <TableRow key={nurse.nurseId}>
                    <TableCell>{nurse.fullName}</TableCell>
                    <TableCell>{nurse.email}</TableCell>
                    <TableCell>{nurse.studentNumber}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleRemoveNurse(nurse.nurseId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={toggleAvailableNurses}
          >
            {showAvailableNurses ? 'Hide Available Nurses' : 'Add Nurses to Class'}
          </Button>
        </Box>

        {showAvailableNurses && (
          <div>
            <Typography variant="h4" gutterBottom>
              Available Nurses
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search nurses by name, email, or W#"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
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
                  {filteredAvailableNurses.map((nurse) => (
                    <TableRow key={nurse.nurseId}>
                      <TableCell>{nurse.fullName}</TableCell>
                      <TableCell>{nurse.email}</TableCell>
                      <TableCell>{nurse.studentNumber}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleAddNurse(nurse.nurseId)}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Box>
    </div>
  );
};

export default ClassProfile;