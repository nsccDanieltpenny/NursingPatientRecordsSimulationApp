import react, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import AssessmentSidebar from '../components/AssessmentSidebar'; 
import NavigationButtons from '../components/NavigationButtons'; 



/* Mobility Page
    ----------------
    This page handles all "Mobility" information for a given patient

    02/03/2025: Page created.
 */


const PatientMobility = () => {
    //Gets patient ID from route "/patient/:id/mobility"
    const { id } = useParams();

    //state to store answers
    const [answers, setAnswers] = useState({
        transfer: ''
    });

    //function to handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    //define routes for back/next
    const prevPageRoute = `/patient/${id}/elimination`;
    const nextPageRoute = `/patient/${id}/safety`; 

    return (
        <div className="container mt-4 d-flex">
            {/* sidebar */}
            <AssessmentSidebar />

            {/* content */}
            <div className="ms-4 flex-fill">
                <h2> Mobility</h2>

                {/* Transfer*/ }
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Transfer:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-I"
                                        label="I"
                                        checked={answers.transfer === 'I'}
                                        onChange={() => handleAnswerChange('transfer', 'I')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-Ax1"
                                        label="Ax1"
                                        checked={answers.transfer === 'Ax1'}
                                        onChange={() => handleAnswerChange('transfer', 'Ax1')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-Ax2"
                                        label="Ax2"
                                        checked={answers.transfer === 'Ax2'}
                                        onChange={() => handleAnswerChange('transfer', 'Ax2')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-ML"
                                        label="ML"
                                        checked={answers.transfer === 'ML'}
                                        onChange={() => handleAnswerChange('transfer', 'ML')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Aids (Walker, Cane, Wheelchair)</Form.Label>
                                <Form.Control
                                    type="text"
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bed Mobility (2 person care, Ax1)</Form.Label>
                                <Form.Control
                                    type="text"
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-5">
                    <Card.Body>
                        <NavigationButtons
                            prevPage={prevPageRoute}
                            nextPage={nextPageRoute}
                        />
                    </Card.Body>
                </Card>
            </div>
        </div>
    )

};

export default PatientMobility;