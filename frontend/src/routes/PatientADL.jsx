import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientADL = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    
    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-adl-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);
    
    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/adl`);
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
            localStorage.setItem(`patient-adl-${id}`, JSON.stringify(answers));
            
            // Show success message
            alert('ADL data saved successfully!');
            
  
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'question1', text: 'Foot Care' },
        { id: 'question2', text: 'Hair Care' },
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentSidebar />
            {/* Page Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>ADLs</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
                {/* Bath Date, Bathing Method */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Bath Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answers.bathDate || ''}
                                        onChange={(e) => handleAnswerChange('bathDate', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Tub/Shower/Other</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answers.bathingMethod || ''}
                                        onChange={(e) => handleAnswerChange('bathingMethod', e.target.value)} />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Type of Care */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Type of Care</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="typeofcare"
                                        type="radio"
                                        id="typeofcare-F"
                                        label="F"
                                        checked={answers.typeofcare === 'F'}
                                        onChange={() => handleAnswerChange('typeofcare', 'F')}
                                    />
                                    <Form.Check
                                        inline
                                        name="typeofcare"
                                        type="radio"
                                        id="typeofcare-A"
                                        label="A"
                                        checked={answers.typeofcare === 'A'}
                                        onChange={() => handleAnswerChange('typeofcare', 'A')}
                                    />
                                    <Form.Check
                                        inline
                                        name="typeofcare"
                                        type="radio"
                                        id="typeofcare-I"
                                        label="I"
                                        checked={answers.typeofcare === 'I'}
                                        onChange={() => handleAnswerChange('typeofcare', 'I')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Turning Schedule */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Turning Schedule (Q2H, Y/N)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.turningSchedule || ''}
                                    onChange={(e) => handleAnswerChange('turningSchedule', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Teeth */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Teeth (Dentures/Self/Assist)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.teeth || ''}
                                    onChange={(e) => handleAnswerChange('teeth', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
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
            </div>
        </div>
    );
};

export default PatientADL;