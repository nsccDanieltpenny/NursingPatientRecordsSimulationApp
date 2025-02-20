import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const PatientCard = () => {
  return (
    <div className="container mb-1">
      <Card style={{ width: '9rem', height: '9rem' }}>
        <Card.Body>
            <Card.Text> Bed # </Card.Text>
            <Card.Text>
                Patient Name
            </Card.Text>
            <Button variant="primary">Records</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PatientCard;
