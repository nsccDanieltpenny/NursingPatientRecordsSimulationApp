import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

const PatientCard = ({ bedNumber, name, onClick }) => {


  return (

    <div className="container mb-1">
      <Card className="CardBody" style={{ width: '9rem', height: '6.8rem', cursor: 'pointer' }} onClick={onClick}>
        <Card.Body>

          <Card.Text className="CardTitle"> Bed #: {bedNumber} </Card.Text>
          <Card.Text className="CardText">{name} </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PatientCard;
