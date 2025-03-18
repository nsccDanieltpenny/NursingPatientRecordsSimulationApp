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
const TakenPatientCard = ({ nurseId, bedNumber, name, onClick }) => {

    return (

        <div className="container mb-1">
            <Card className="CardBody" style={{ width: '15rem', height: '10rem', cursor: 'pointer' }} onClick={onClick}>
                <Card.Body>

                    <Card.Text className="CardTitle"> Bed #: {bedNumber} </Card.Text>
                    <Card.Text className="CardText">{name} </Card.Text>
                    <Card.Text className="CardText">{nurseId} </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TakenPatientCard;