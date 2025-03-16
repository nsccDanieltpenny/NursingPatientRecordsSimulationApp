import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientNutrition = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState({
        diet: ''
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

            {/* Page Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Nutrition</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/patient/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success">
                            Save
                        </Button>
                    </div>
                </div>

                {/* Diet Selection */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Diet:</Form.Label>
                                <div className="d-flex align-items-center">
                                    {['Puree', 'Minced', 'Regular', 'Liquid', 'NPO'].map(diet => (
                                        <Form.Check
                                            key={diet}
                                            inline
                                            name="diet"
                                            type="radio"
                                            label={diet}
                                            checked={answers.diet === diet}
                                            onChange={() => handleAnswerChange('diet', diet)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Additional Fields */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Assist</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Intake</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control type="datetime-local" />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Dietary Supplement</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Weight and IV Details */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weight</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Date of Weighing</Form.Label>
                                    <Form.Control type="datetime-local" />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weighing Method</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>IV Solution/Rate</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Special Needs & Preferences</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientNutrition;