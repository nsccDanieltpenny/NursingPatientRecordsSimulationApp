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

    const APIHOST = import.meta.env.VITE_API_URL;

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
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/skinandsensoryaid`);
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
                    <h2>Sensory Aids / Prothesis / Skin Integrity</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>

{/* Skin Integrity - Yes/No */}
<Card className="mt-4">
    <Card.Body>
        <Form>
            <div className="mb-2 d-flex justify-content-end">
                <strong className="me-4">Yes</strong>
                <strong>No</strong>
            </div>
            <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="me-3">Skin Integrity</Form.Label>
                <div className="ms-auto d-flex align-items-center">
                    <Form.Check
                        inline
                        name="skinIntegrity"
                        type="radio"
                        id="skinIntegrity-yes"
                        checked={answers.skinIntegrity === 'yes'}
                        onChange={() => handleAnswerChange('skinIntegrity', 'yes')}
                    />
                    <Form.Check
                        inline
                        name="skinIntegrity"
                        type="radio"
                        id="skinIntegrity-no"
                        checked={answers.skinIntegrity === 'no'}
                        onChange={() => handleAnswerChange('skinIntegrity', 'no')}
                    />
                </div>
            </Form.Group>

            {/* Follow-up options for Skin Integrity if Yes */}
            {answers.skinIntegrity === 'yes' && (
                <Form.Group className="mb-3">
                    <Form.Label>Frequency</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            inline
                            name="skinIntegrityFrequency"
                            type="radio"
                            label="Q2h"
                            checked={answers.skinIntegrityFrequency === 'Q2h'}
                            onChange={() => handleAnswerChange('skinIntegrityFrequency', 'Q2h')}
                        />
                        <Form.Check
                            inline
                            name="skinIntegrityFrequency"
                            type="radio"
                            label="Q4h"
                            checked={answers.skinIntegrityFrequency === 'Q4h'}
                            onChange={() => handleAnswerChange('skinIntegrityFrequency', 'Q4h')}
                        />
                        <Form.Check
                            inline
                            name="skinIntegrityFrequency"
                            type="radio"
                            label="QShift"
                            checked={answers.skinIntegrityFrequency === 'QShift'}
                            onChange={() => handleAnswerChange('skinIntegrityFrequency', 'QShift')}
                        />
                    </div>
                </Form.Group>
            )}
        </Form>
    </Card.Body>
</Card>

{/* Glasses and Hearing Questions (Mapped from the questions array) */}
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

{/* Pressure Ulcer Risk */}
<Card className="mt-4">
    <Card.Body>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Pressure Ulcer Risk:</Form.Label>
                <div className="d-flex align-items-center">
                    <Form.Check
                        inline
                        name="pressureUlcerRisk"
                        type="radio"
                        id="risk-low"
                        label="Low"
                        checked={answers.pressureUlcerRisk === 'Low'}
                        onChange={() => handleAnswerChange('pressureUlcerRisk', 'Low')}
                    />
                    <Form.Check
                        inline
                        name="pressureUlcerRisk"
                        type="radio"
                        id="risk-medium"
                        label="Medium"
                        checked={answers.pressureUlcerRisk === 'Medium'}
                        onChange={() => handleAnswerChange('pressureUlcerRisk', 'Medium')}
                    />
                    <Form.Check
                        inline
                        name="pressureUlcerRisk"
                        type="radio"
                        id="risk-high"
                        label="High"
                        checked={answers.pressureUlcerRisk === 'High'}
                        onChange={() => handleAnswerChange('pressureUlcerRisk', 'High')}
                    />
                    <Form.Check
                        inline
                        name="pressureUlcerRisk"
                        type="radio"
                        id="risk-very-high"
                        label="Very High"
                        checked={answers.pressureUlcerRisk === 'Very High'}
                        onChange={() => handleAnswerChange('pressureUlcerRisk', 'Very High')}
                    />
                </div>
            </Form.Group>
        </Form>
    </Card.Body>
</Card>

{/* Removed Braden Scale */}
{/* Braden Scale has been removed */}

{/* Skin Integrity - Turning Schedule */}
<Card className="mt-4">
    <Card.Body>
        <Form>
            <div className="mb-2 d-flex justify-content-end">
                <strong className="me-4">Yes</strong>
                <strong>No</strong>
            </div>
            <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="me-3">Skin Integrity - Turning Schedule</Form.Label>
                <div className="ms-auto d-flex align-items-center">
                    <Form.Check
                        inline
                        name="skinIntegrityTurningSchedule"
                        type="radio"
                        id="turningSchedule-yes"
                        checked={answers.skinIntegrityTurningSchedule === 'yes'}
                        onChange={() => handleAnswerChange('skinIntegrityTurningSchedule', 'yes')}
                    />
                    <Form.Check
                        inline
                        name="skinIntegrityTurningSchedule"
                        type="radio"
                        id="turningSchedule-no"
                        checked={answers.skinIntegrityTurningSchedule === 'no'}
                        onChange={() => handleAnswerChange('skinIntegrityTurningSchedule', 'no')}
                    />
                </div>
            </Form.Group>

            {/* Follow-up options for Turning Schedule if Yes */}
            {answers.skinIntegrityTurningSchedule === 'yes' && (
                <Form.Group className="mb-3">
                    <Form.Label>Frequency</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            inline
                            name="turningScheduleFrequency"
                            type="radio"
                            label="Q2h"
                            checked={answers.turningScheduleFrequency === 'Q2h'}
                            onChange={() => handleAnswerChange('turningScheduleFrequency', 'Q2h')}
                        />
                        <Form.Check
                            inline
                            name="turningScheduleFrequency"
                            type="radio"
                            label="Q4h"
                            checked={answers.turningScheduleFrequency === 'Q4h'}
                            onChange={() => handleAnswerChange('turningScheduleFrequency', 'Q4h')}
                        />
                        <Form.Check
                            inline
                            name="turningScheduleFrequency"
                            type="radio"
                            label="QShift"
                            checked={answers.turningScheduleFrequency === 'QShift'}
                            onChange={() => handleAnswerChange('turningScheduleFrequency', 'QShift')}
                        />
                    </div>
                </Form.Group>
            )}
        </Form>
    </Card.Body>
</Card>

                {/* Skin Integrity - Dressings */}
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
