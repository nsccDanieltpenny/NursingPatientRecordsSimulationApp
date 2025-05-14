import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';


const PatientCard = ({ classData, onClick }) => {

  return (
    <Card 
      variant="outlined"
      onClick={onClick} 
      sx={{ cursor: 'pointer' }}
    >
      <CardContent>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 1,
          color: 'primary.main'
        }}>
          {classData.name}
        </Typography>
        <Typography variant="body2">
          {classData.description}
        </Typography>
        <Typography variant="body2">
          {classData.instructorName}
        </Typography>
        <Typography variant="body2">
          Enrollment: {classData.studentCount}
        </Typography>
        <Typography variant="body2">
          Starts: {classData.startDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PatientCard;