import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';

/* Patient Safety Page
    ----------------
    Handles the patient safety assessment page.*/
const PatientSafety = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-safety-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/safety`);
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
            localStorage.setItem(`patient-safety-${id}`, JSON.stringify(answers));

            // Show success message
            alert('Safety data saved successfully!');

        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'hipProtectors', text: 'Hip Protectors' },
        { id: 'sideRails', text: 'Side Rails ' },
        { id: 'crashMats', text: 'Crash Mats' },
        { id: 'bedAlarm', text: 'Bed Alarm ' },
        // { id: 'question5', text: 'Chair Alarm' },
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Page Content */}
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Safety</h2>
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
                {/* Fall Risk Scale */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Fall Risk Scale</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-Low"
                                        label="Low"
                                        checked={answers.fallRiskScale === 'Low'}
                                        onChange={() => handleAnswerChange('fallRiskScale', 'Low')}
                                    />
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-Medium"
                                        label="Medium"
                                        checked={answers.fallRiskScale === 'Medium'}
                                        onChange={() => handleAnswerChange('fallRiskScale', 'Medium')}
                                    />
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-High"
                                        label="High"
                                        checked={answers.fallRiskScale === 'High'}
                                        onChange={() => handleAnswerChange('fallRiskScale', 'High')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientSafety;