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

const ClassProfile = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [nursesInClass, setNursesInClass] = useState([]);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [showAvailableNurses, setShowAvailableNurses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(`/api/Class/${id}/students`);
        setNursesInClass(response.data);
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchAvailableNurses = async () => {
    try {
      const response = await axios.get('/api/Class/nurses');
      // Filter out nurses that are already in the class and only show Ivany campus nurses
      const nursesInClassIds = nursesInClass.map(nurse => nurse.nurseId);
      const filteredNurses = response.data.filter(nurse => 
        !nursesInClassIds.includes(nurse.nurseId) && 
        nurse.campus === 'Ivany'
      );
      setAvailableNurses(filteredNurses);
    } catch (error) {
      console.error('Error fetching available nurses:', error);
    }
  };

  const handleRemoveNurse = async (nurseId) => {
    try {
      await axios.delete(`/api/Class/${id}/students/${nurseId}`);
      const classResponse = await axios.get(`/api/Class/${id}/students`);
      setNursesInClass(classResponse.data);
      
      // If available nurses are being shown, refetch them
      if (showAvailableNurses) {
        const nursesResponse = await axios.get('/api/Class/nurses');
        const nursesInClassIds = classResponse.data.map(nurse => nurse.nurseId);
        const filteredNurses = nursesResponse.data.filter(nurse => 
          !nursesInClassIds.includes(nurse.nurseId) && 
          nurse.campus === 'Ivany'
        );
        setAvailableNurses(filteredNurses);
      }
    } catch (error) {
      console.error('Error removing nurse:', error);
    }
  };

  const handleAddNurse = async (nurseId) => {
    try {
      await axios.post(`/api/Class/${id}/students`, {nurseId: nurseId});
      const classResponse = await axios.get(`/api/Class/${id}/students`);
      setNursesInClass(classResponse.data);
      setAvailableNurses(availableNurses.filter(nurse => nurse.nurseId !== nurseId));
    } catch (error) {
      console.error('Error adding nurse:', error);
    }
  };

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