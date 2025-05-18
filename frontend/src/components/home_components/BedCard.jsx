import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaTimes } from 'react-icons/fa';
import '../../css/home_styles.css';

export const BedCard = ({ bed, onClick, onClearBed, userRole }) => {
  const [showRemove, setShowRemove] = useState(false);
  const isAdmin = userRole === 'admin';

  return (
    <div 
      className="bed-card-container"
      onMouseEnter={() => isAdmin && setShowRemove(true)}
      onMouseLeave={() => isAdmin && setShowRemove(false)}
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

export default BedCard;