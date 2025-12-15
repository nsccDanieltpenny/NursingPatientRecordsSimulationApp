import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const ClassProfile = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [nursesInClass, setNursesInClass] = useState([]);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [showAvailableNurses, setShowAvailableNurses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();

  // REAL API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(`/api/classes/${id}/students`);
        console.log("Class students response:", response.data);
        setNursesInClass(response.data);
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching classes/id/ data:', error);
      }
    };
    fetchData();
  }, [id]);

  
  // WHAT IT SHOULD DO: Fetch all nurses not in this class, future filter for a selected campus
  const fetchAvailableNurses = async () => {
    try {
      const resp = await axios.get('/api/nurse/unassigned');
      const data = resp.data;

      setAvailableNurses(data);
      console.log("Fetching available nurses - API call placeholder");
    } catch (error) {
      console.error('Error fetching available nurses:', error);
    }
  };

  // WHAT IT SHOULD DO: Remove nurse from class via API 
  const handleRemoveNurse = async (nurseId) => {
    try {
      console.log(`Removing nurse ${nurseId} from class ${id} - API call placeholder`);
      let nurse_edit = nursesInClass.find(n => n.nurseId === nurseId);
      if (nurse_edit === null) { return; }
      nurse_edit.classId = null;

      await axios.put(`/api/nurse/${nurseId}`, nurse_edit);

      const classResponse = await axios.get(`/api/classes/${id}/students`);
      setNursesInClass(classResponse.data);
      
      // If available nurses are being shown, refetch them
      if (showAvailableNurses) {
        // fetchAvailableNurses(); does nothing right now
        fetchAvailableNurses();
      }
    } catch (error) {
      console.error('Error removing nurse:', error);
    }
  };

  

  // WHAT IT SHOULD DO: Add nurse to class via API
  const handleAddNurse = async (nurseId) => {
    try {
      console.log(`Adding nurse ${nurseId} to class ${id} - API call placeholder`);
      let nurse_edit = availableNurses.find(n => n.nurseId === nurseId);
      if (nurse_edit === null) { return; }
      nurse_edit.classId = parseInt(id);

      await axios.put(`/api/nurse/${nurseId}`, nurse_edit);
      const classResponse = await axios.get(`/api/classes/${id}/students`);
      setNursesInClass(classResponse.data);

      fetchAvailableNurses();
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