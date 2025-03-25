import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientCognitive = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState({});

    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // console.log(`Fetching patient with id: ${id}`);
                const response = await axios.get('http://localhost:5232/api/cognitives/1');
                console.log('Response:', response.data);
                setAnswers(response.data);
                console.log(answers)

            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };
        fetchPatientData();
    }, []);

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentSidebar />

            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Cognitive</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/1`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success">
                            Save
                        </Button>
                    </div>
                </div>

                {/* Confusion*/}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Confusion:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="confusion"
                                        type="radio"
                                        id="confusion-None"
                                        label="None"
                                        checked={answers.confusion === 'None'}
                                        onChange={() => handleAnswerChange('confusion', 'None')}
                                    />
                                    <Form.Check
                                        inline
                                        name="confusion"
                                        type="radio"
                                        id="confusion-Occasionally"
                                        label="Occasionally"
                                        checked={answers.confusion === 'Occasionally'}
                                        onChange={() => handleAnswerChange('confusion', 'Occasionally')}
                                    />
                                    <Form.Check
                                        inline
                                        name="Confusion"
                                        type="radio"
                                        id="confusion-Always"
                                        label="Always"
                                        checked={answers.confusion === 'Always'}
                                        onChange={() => handleAnswerChange('confusion', 'Always')}
                                    />
                                    <Form.Check
                                        inline
                                        name="Confusion"
                                        type="radio"
                                        id="Confusion"
                                        label="HS"
                                        checked={answers.confusion === 'HS'}
                                        onChange={() => handleAnswerChange('confusion', 'HS')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Speech */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Speech</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.speech}
                                    onChange={(e) => handleAnswerChange('speech', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* LOC */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>LOC</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.loc}
                                    onChange={(e) => handleAnswerChange('loc', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* MMSE */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>MMSE</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.mmse}
                                    onChange={(e) => handleAnswerChange('mmse', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientCognitive;