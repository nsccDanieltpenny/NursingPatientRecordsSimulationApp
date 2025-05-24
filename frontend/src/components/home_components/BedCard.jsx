import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaTimes } from 'react-icons/fa';
import '../../css/home_styles.css';
import { useUser } from '../../context/UserContext';
import propTypes from 'prop-types';

export const BedCard = ({ bed, onClick, onClearBed }) => {
  const [showRemove, setShowRemove] = useState(false);
  const { isAdmin } = useUser();

  return (
    <div 
      className="bed-card-container"
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <Card 
        className={`bed-card ${bed.isOccupied ? 'occupied' : 'empty'}`}
        onClick={onClick}
        style={{ cursor: bed.isOccupied ? 'pointer' : 'default' }}
      >
        <Card.Body>
          <div className="bed-identifier">
            {bed.unit}-{bed.bedNumber}
          </div>
          <div className="bed-status">
            {bed.isOccupied ? 'Occupied' : 'Available'}
          </div>
          
          {isAdmin && bed.isOccupied && showRemove && (
            <button 
              className="simple-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClearBed(bed.bedNumber);
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
  bed: propTypes.shape({
    unit: propTypes.string.isRequired,
    bedNumber: propTypes.number.isRequired,
    isOccupied: propTypes.bool.isRequired,
    patientId: propTypes.number.isRequired
  }).isRequired,
  onClick: propTypes.func.isRequired,
  onClearBed: propTypes.func.isRequired
};

export default BedCard;