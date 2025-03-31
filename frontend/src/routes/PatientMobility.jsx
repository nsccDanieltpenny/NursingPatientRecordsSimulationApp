import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentSidebar from '../components/AssessmentSidebar';

const PatientMobility = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    
    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-mobility-${id}`);
        if (savedData) {
            setAnswers(JSON.parse(savedData));
        } else {
            fetchPatientData();
        }
    }, [id]);
    
    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`http://localhost:5232/api/patients/nurse/patient/${id}/mobility`);
            console.log('Response:', response.data);
            setAnswers(response.data);
            console.log(answers);
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
            localStorage.setItem(`patient-mobility-${id}`, JSON.stringify(answers));
            
            // Show success message
            alert('Mobility data saved successfully!');
            
            
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
                    <h2>Mobility</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
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
                                    value={answers.aids || ''}
                                    onChange={(e) => handleAnswerChange('aids', e.target.value)}
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
                                    value={answers.bedMobility || ''}
                                    onChange={(e) => handleAnswerChange('bedMobility', e.target.value)}
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