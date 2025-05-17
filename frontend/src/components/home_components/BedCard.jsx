import React from 'react';
import Card from 'react-bootstrap/Card';
import '../../css/home_styles.css';


const BedCard = ({ 
  bedNumber, 
  isOccupied = false, 
  unitId = '4260', 
  onClick 
}) => {
  return (
    <div className="bed-card-container">
      <Card 
        className={`bed-card ${isOccupied ? 'occupied' : 'empty'}`}
        onClick={isOccupied ? onClick : undefined}
        style={{ cursor: isOccupied ? 'pointer' : 'default' }}
      >
        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
          <div className="bed-identifier">
            {unitId}-{bedNumber}
          </div>
          <div className={`bed-status ${isOccupied ? 'occupied' : 'empty'}`}>
            {isOccupied ? 'Occupied' : 'Available'}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BedCard;