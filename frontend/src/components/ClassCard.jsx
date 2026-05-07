import {
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ClassCard = ({ classData, onClick, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // don't trigger card click when deleting
    const confirmed = window.confirm("Are you sure you want to delete this class?");
    if (confirmed && onDelete) {
      onDelete();
    }
  };

  const handleEditClick = (e) =>{
    e.stopPropagation();
    console.log(classData)
    navigate(`/admin/class/edit/${classData?.id}`);
  }

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

        <IconButton
          size="medium"
          onClick={handleEditClick}
          sx={{
            position: 'absolute',
            top: 4,
            right: 64,
            zIndex: 10,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#78abf8',
              color: '#fff',
            },
          }}
        >
          <FaPencilAlt size={18} style={{ pointerEvents: 'none' }} />
        </IconButton>

      <CardContent>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 1,
          color: 'primary.main'
        }}>
          {classData?.name}
        </Typography>
        <Typography variant="body2">
          {classData?.description}
        </Typography>
        <Typography>
          Join Code: {classData?.joinCode}
        </Typography>
        <Typography variant="body2">
          Instructor ID: {classData?.instructorId}
        </Typography>
        <Typography variant="body2">
          Campus {classData?.campus} 
        </Typography>
        <Typography variant="body2">
          Enrollment: {classData?.studentCount} students
        </Typography>
        <Typography variant="body2">
          Starts: {classData?.startDate}
        </Typography>
        <Typography variant="body2">
          Ends: {classData?.endDate}
        </Typography>
      </CardContent>
    </Card>
  );
};


ClassCard.propTypes = {
  classData: PropTypes.shape({
    classId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    joinCode: PropTypes.string.isRequired,
    instructorId: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    studentCount: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

ClassCard.defaultProps = {
  onClick: undefined,
  onDelete: undefined,
};

export default ClassCard;