import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from "../context/UserContext";
import axios from 'axios';
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
} from '@mui/material';

const ClassProfile = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [nurses, setNurses] = useState([]);
  const { id } = useParams();
  const { user } = useUser();
  
  const APIHOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        const response = await axios.get(`${APIHOST}/api/Class/${id}/students`, 
          {
            headers: { Authorization: `Bearer ${user.token}` },
          });
        setNurses(response.data);

        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, user.token]);

  const handleRemoveNurse = async (nurseId) => {
    try {
      await axios.delete(`${APIHOST}/api/Class/${id}/students/${nurseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNurses((prevNurses) => prevNurses.filter((nurse) => nurse.id !== nurseId));
    } catch (error) {
      console.error('Error removing nurse:', error);
    }
  };

  if (dataLoading) return <div>Loading class...</div>;
  
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Class
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
            {nurses.map((nurse) => (
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
  );
};

export default ClassProfile;