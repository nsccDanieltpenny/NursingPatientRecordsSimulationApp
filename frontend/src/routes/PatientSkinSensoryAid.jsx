import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';

const PatientSkinSensoryAid = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-skinsensoryaid-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/skinandsensoryaid`);
            console.log('Response:', response.data);
            setAnswers(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    // function to handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Save function for the Save button
    const handleSave = () => {
        try {
            // Save to localStorage
            localStorage.setItem(`patient-skinsensoryaid-${id}`, JSON.stringify(answers));

            // Show success message
            alert('Sensory Aids & Skin Integrity data saved successfully!');


        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'glasses', text: 'Glasses' },
        { id: 'hearing', text: 'Hearing' },
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Page Content */}
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Sensory Aids / Prothesis & Skin Integrity</h2>
                    <div className="d-flex gap-2">
                        {/* <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}> */}
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
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
                                            checked={answers[question.id] === 'yes'}
                                            onChange={() => handleAnswerChange(question.id, 'yes')}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}
                                            checked={answers[question.id] === 'no'}
                                            onChange={() => handleAnswerChange(question.id, 'no')}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>
                {/* Skin Integrity - Pressure Ulcer Risk */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Skin Integrity - Pressure Ulcer Risk:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="skinIntegrityPressureUlcerRisk"
                                        type="radio"
                                        id="skin-low"
                                        label="Low"
                                        checked={answers.skinIntegrityPressureUlcerRisk === 'Low'}
                                        onChange={() => handleAnswerChange('skinIntegrityPressureUlcerRisk', 'Low')}
                                    />
                                    <Form.Check
                                        inline
                                        name="skinIntegrityPressureUlcerRisk"
                                        type="radio"
                                        id="skin-medium"
                                        label="Medium"
                                        checked={answers.skinIntegrityPressureUlcerRisk === 'Medium'}
                                        onChange={() => handleAnswerChange('skinIntegrityPressureUlcerRisk', 'Medium')}
                                    />
                                    <Form.Check
                                        inline
                                        name="skinIntegrityPressureUlcerRisk"
                                        type="radio"
                                        id="skin-high"
                                        label="High"
                                        checked={answers.skinIntegrityPressureUlcerRisk === 'High'}
                                        onChange={() => handleAnswerChange('skinIntegrityPressureUlcerRisk', 'High')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Skin Integrity - Braden Scale */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Skin Integrity - Branden Scale (number)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.skinIntegrityBradenScale || ''}
                                    onChange={(e) => handleAnswerChange('skinIntegrityBradenScale', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Skin Integrity - Turning Schedule */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Skin Integrity - Turning Schedule (Q2H, Y/N)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.skinIntegrityTurningSchedule || ''}
                                    onChange={(e) => handleAnswerChange('skinIntegrityTurningSchedule', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Skin Integrity - Dressings*/}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Skin Integrity - Dressings</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.skinIntegrityDressings || ''}
                                    onChange={(e) => handleAnswerChange('skinIntegrityDressings', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientSkinSensoryAid;