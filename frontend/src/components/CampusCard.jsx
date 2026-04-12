import {
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const CampusCard = ({ campusData, onClick, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // don't trigger card click when deleting
    const confirmed = window.confirm("Are you sure you want to delete this campus?");
    if (confirmed && onDelete) {
      onDelete();
    }
  };

  const handleEditClick = (e) =>{
    e.stopPropagation();
    console.log(campusData)
    navigate(`/admin/campus/edit/${classData?.id}`);

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
          {campusData?.name}
        </Typography>
        <Typography variant="body2">
          {campusData?.address}
        </Typography>
      </CardContent>
    </Card>
  );
};


CampusCard.propTypes = {
  campusData: PropTypes.shape({
    campusId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

CampusCard.defaultProps = {
  onClick: undefined,
  onDelete: undefined,
};

export default CampusCard;