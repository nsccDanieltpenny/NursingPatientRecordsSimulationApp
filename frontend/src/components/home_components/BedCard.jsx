import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaTimes } from 'react-icons/fa';
import '../../css/home_styles.css';
import { useUser } from '../../context/UserContext';
import PropTypes from 'prop-types';

export const BedCard = ({ bed, onClick, onClearBed, canCreate }) => {
  const [showRemove, setShowRemove] = useState(false);
  const { isAdmin } = useUser();
  const createBlocked = !bed.isOccupied && !canCreate;

  return (
    <div 
      className="bed-card-container"
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <Card 
        className={`bed-card ${bed.isOccupied ? 'occupied' : 'empty'}`}
        onClick={onClick}
        style={{ cursor: createBlocked ? 'not-allowed' : 'pointer' }}
      >
        <Card.Body>
          <div className="bed-identifier">
            {bed.unit}-{bed.bedNumber}
          </div>
          <div className={`bed-status ${bed.isOccupied ? 'occupied' : 'empty'}`}>
            {bed.isOccupied ? 'Occupied' : 'Available'}
          </div>
          
          {isAdmin && bed.isOccupied && showRemove && (
            <button 
              className="simple-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClearBed(bed);
              }}
            >
              <FaTimes />
            </button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

BedCard.propTypes = {
  bed: PropTypes.shape({
    unit: PropTypes.string.isRequired,
    bedNumber: PropTypes.number.isRequired,
    isOccupied: PropTypes.bool.isRequired,
    patientId: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onClearBed: PropTypes.func.isRequired,
  canCreate: PropTypes.bool.isRequired
};

export default BedCard;