import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';

const PatientProgressNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-progressnote-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/progressnote`);
            console.log('Response:', response.data);
            setAnswers(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

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
            localStorage.setItem(`patient-progressnote-${id}`, JSON.stringify(answers));

            // Show success message
            alert('Progress Note data saved successfully!');

        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Progress Note</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>

                {/* Date */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    // type="text"
                                    value={answers.timestamp}
                                    onChange={(e) => handleAnswerChange('timestamp', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Progress Notes */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Progress Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    value={answers.note || ''}
                                    onChange={(e) => handleAnswerChange('note', e.target.value)}
                                    placeholder="Enter detailed progress notes here..."
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

            </div>
        </div>
    );
};

export default PatientProgressNote;