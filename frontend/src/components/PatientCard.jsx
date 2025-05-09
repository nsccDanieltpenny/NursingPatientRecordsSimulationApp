import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

/**
 * The PatientCard component renders a card displaying the bed number and name of a patient, with a
 * clickable functionality.
 * @returns A React functional component named `PatientCard` is being returned. It renders a Card
 * component with bed number and patient name displayed inside it. The component also accepts props
 * such as `bedNumber`, `name`, and `onClick` for customization.
 */
const PatientCard = ({ bedNumber, onClick }) => {

  return (
    <div className="mb-1">
      <Card className="CardBody" style={{ width: '10rem', height: '6.8rem', cursor: 'pointer' }} onClick={onClick}>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <Card.Text className="CardTitle mb-0"> 4260-{bedNumber} </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PatientCard;
