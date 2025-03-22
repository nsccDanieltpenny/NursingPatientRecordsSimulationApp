import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import AssessmentSidebar from '../components/AssessmentSidebar';
import axios from 'axios';

/* Elimination Page
    ----------------
    This page handles all "Elimination" information for a given patient
*/

const PatientElimination = () => {
    // Gets patient ID from route "/patient/:id/elimination"
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});


    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // console.log(`Fetching patient with id: ${id}`);
                const response = await axios.get('http://localhost:5232/api/eliminations/1');
                console.log('Response:', response.data);
                setAnswers(response.data);
                console.log(answers)

            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };
        fetchPatientData();
    }, []);


    // // state to store answers
    // const [answers, setAnswers] = useState({
    //     question1: '',
    //     question2: '',
    //     question3: '',
    //     question4: '',
    //     lastBowelMovement: '',
    //     bowelRoutine: '',
    //     bladderRoutine: '',
    //     catheterInsertionDate: ''
    // });

    // function to handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'question1', text: 'Incontinent of Bladder ' },
        { id: 'question2', text: 'Incontinent of Bowel ' },
        { id: 'question3', text: 'Day/Night Product' },
        { id: 'question4', text: 'Catheter Insertion' }
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentSidebar />

            {/* Page Content */}
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Elimination</h2>
                    <div className="d-flex gap-2">
                        {/* <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}> */}
                        <Button variant="primary" onClick={() => navigate(`/api/patients/1`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success">
                            Save
                        </Button>
                    </div>
                </div>

                {/* Yes/No Questions */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="mb-2 d-flex justify-content-end">
                                <strong className="me-4">Yes</strong>
                                <strong>No</strong>
                            </div>
                            {questions.map((question, index) => (
                                <Form.Group key={index} className="mb-3 d-flex align-items-center">
                                    <Form.Label className="me-3">{question.text}</Form.Label>
                                    <div className="ms-auto d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-yes`}
                                            // checked={answers[question.id] === 'yes'}
                                            onChange={() => handleAnswerChange(question.id, 'yes')}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}
                                            // checked={answers[question.id] === 'no'}
                                            onChange={() => handleAnswerChange(question.id, 'no')}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Last Bowel Movement */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Bowel Movement</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.lastBowelMovement}
                                    onChange={(e) => handleAnswerChange('lastBowelMovement', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Bowel Routine */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bowel Routine</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.bowelRoutine}
                                    onChange={(e) => handleAnswerChange('bowelRoutine', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Bladder Routine */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bladder Routine</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.bladderRoutine}
                                    onChange={(e) => handleAnswerChange('bladderRoutine', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Catheter Insertion Date */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Catheter Insertion Date</Form.Label>
                                {answers.catheterInsertionDate &&
                                    <Form.Control
                                        type="text"
                                        value={answers.catheterInsertionDate}
                                        onChange={(e) => handleAnswerChange('catheterInsertionDate', e.target.value)}
                                    // disabled={answers.question4 !== 'yes'}
                                    />
                                }
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

            </div>
        </div>
    );
};

export default PatientElimination;