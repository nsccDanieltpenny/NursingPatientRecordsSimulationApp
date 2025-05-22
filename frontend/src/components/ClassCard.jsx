import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,

} from '@mui/material';
import { FaTrash } from 'react-icons/fa';


const ClassCard = ({ classData, onClick, onDelete }) => {
   const handleDeleteClick = (e) => {
    e.stopPropagation(); // don't trigger card click when deleting
    const confirmed = window.confirm("Are you sure you want to delete this class?");
    if (confirmed && onDelete) {
      onDelete();
    }
  };

  return (
    <Card 
      variant="outlined"
      onClick={onClick} 
      sx={{ cursor: 'pointer', position:'relative', overflow: 'visible' }}
    >
  {onDelete && (
        <IconButton
          size="medium"
          onClick={handleDeleteClick}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 10,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#f44336',
              color: '#fff',
            },
          }}
        >
          <FaTrash size={18} style={{ pointerEvents: 'none' }} />
        </IconButton>
      )}

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

export default ClassCard;