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
    
    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-cognitive-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);
    
    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/cognitive`);
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
            localStorage.setItem(`patient-cognitive-${id}`, JSON.stringify(answers));
            
            // Show success message
            alert('Cognitive data saved successfully!');
            
          
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

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
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
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
                                    value={answers.speech || ''}
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
                                    value={answers.loc || ''}
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
                                    value={answers.mmse || ''}
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