import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const CampusProfile = () => {
    const [dataLoading, setDataLoading] = useState(true);
    const [classesInCampus, setClassesInCampus] = useState([])
    const [campusInfo, setCampusInfo] = useState(null)

    const {id} = useParams();

    //Fetch Campus data
    useEffect(() => {
        const fetchData = async () => {   
        try {
            setDataLoading(true);
            const response = await axios.get(`/api/campus/${id}`);
            console.log("Campus response:", response.data);
            setCampusInfo(response.data);
            setDataLoading(false);
        } catch (error) {
            console.error(`Error fetching campus/${id}`, error);
        }
        //Get campuses class info
         fetchClassInfo();
        };

    fetchData();
  }, [id]);


  const handleRemoveClass = async (classId) => {
    try {
        console.log(`Removing class ${classId} from campus ${id} - API call placeholder`);
        let class_edit = campusInfo.classes.find(c => c.classId === classId);

        console.log(class_edit)
        if (class_edit === null) { return; }

        await axios.put(`/api/classes/${classId}/remove-campus`);

        const campusResponse = await axios.get(`/api/campus/${id}`);
        setCampusInfo(campusResponse.data)
 
    } catch (error) {
      console.error('Error removing class:', error);
    }
  };

  if (dataLoading) return <div>Campus Loading....</div>

  return(
    <div style={{padding: '20px'}}>
        <Typography variant="h4" gutterBottom>
        Campus List for {campusInfo?.name}
        </Typography>

        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Instructor</strong></TableCell>
                <TableCell><strong>Join Code</strong></TableCell>
                {/* <TableCell><strong>Actions</strong></TableCell> */}
            </TableRow>
            </TableHead>
            <TableBody>
                {campusInfo.classes.map((c) => (
                    <TableRow key={c.classId}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.instructorId}</TableCell>
                    <TableCell>{c.joinCode}</TableCell>
                    {/* <TableCell>
                        <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleRemoveClass(c.classId)}
                        >
                        Remove
                        </Button>
                    </TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>



    </div>

  )
  
    
}

export default CampusProfile;