import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientNutrition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-nutrition-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/nutrition`);
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
            localStorage.setItem(`patient-nutrition-${id}`, JSON.stringify(answers));

            // Show success message
            alert('Nutrition data saved successfully!');


        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
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
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
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
                                <Form.Control
                                    type="text"
                                    value={answers.assist || ''}
                                    onChange={(e) => handleAnswerChange('assist', e.target.value)} />
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
                                    <Form.Control
                                        type="text"
                                        value={answers.intake || ''}
                                        onChange={(e) => handleAnswerChange('intake', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Date/time of intake</Form.Label>
                                    <Form.Control
                                        // type="text"
                                        type="datetime-local"
                                        value={answers.time || ''}
                                        onChange={(e) => handleAnswerChange('time', e.target.value)}
                                    />
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
                                <Form.Control
                                    type="text"
                                    value={answers.dietarySupplementInfo || ''}
                                    onChange={(e) => handleAnswerChange('dietarySupplementInfo', e.target.value)} />
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
                                    <Form.Control
                                        type="text"
                                        value={answers.weight ? `${answers.weight} kg` : ''}
                                        onChange={(e) => {
                                            // Extract numeric value without "kg"
                                            const value = e.target.value.replace(/\s*kg\s*/, '');
                                            handleAnswerChange('weight', value);
                                        }} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Date of Weighing</Form.Label>
                                    <Form.Control
                                        // type="text"
                                        type="date"
                                        value={answers.date || ''}
                                        onChange={(e) => handleAnswerChange('date', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weighing Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answers.method || ''}
                                        onChange={(e) => handleAnswerChange('method', e.target.value)} />
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
                                    <Form.Control
                                        type="text"
                                        value={answers.ivSolutionRate || ''}
                                        onChange={(e) => handleAnswerChange('ivSolutionRate', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Special Needs & Preferences</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answers.specialNeeds || ''}
                                        onChange={(e) => handleAnswerChange('specialNeeds', e.target.value)} />
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