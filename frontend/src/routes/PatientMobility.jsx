import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientMobility = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState({
        transfer: ''
    });

    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentSidebar />

            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Mobility</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/patient/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success">
                            Save
                        </Button>
                    </div>
                </div>

                {/* Transfer */}
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

                {/* Aids (Walker, Cane, Wheelchair) */}
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

                {/* Bed Mobility */}
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
            </div>
        </div>
    );
};

export default PatientMobility;