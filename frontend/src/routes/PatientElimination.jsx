import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { useDefaultDate } from '../utils/useDefaultDate'; 

/* Elimination Page
    ----------------
    This page handles all "Elimination" information for a given patient*/
const PatientElimination = () => {
    // Gets patient ID from route "/patient/:id/elimination"
    const { id } = useParams();
    const navigate = useNavigate();
    const defaultDate = useDefaultDate();
    const [answers, setAnswers] = useState({catheterInsertionDate: defaultDate});

    const APIHOST = import.meta.env.VITE_API_URL;

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-elimination-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (!parsed.catheterInsertionDate) {
                parsed.catheterInsertionDate = defaultDate;
            }
        setAnswers(parsed);
        } else {
            setAnswers({catheterInsertionDate: defaultDate});
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/elimination`);
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
            localStorage.setItem(`patient-elimination-${id}`, JSON.stringify(answers));

            // Show success message
            alert('Elimination data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'dayOrNightProduct', text: 'Day/Night Product' },
        { id: 'catheterInsertion', text: 'Catheter Insertion' }
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Page Content */}
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Elimination</h2>
                    <div className="d-flex gap-2">
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
                            {/* Day/Night Product checkboxes */}
                            {answers.dayOrNightProduct === 'yes' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Day/Night Product</Form.Label>
                                    <div className="d-flex">
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            id="dayProduct"
                                            label="Day"
                                            checked={answers.dayProduct}
                                            onChange={() => handleAnswerChange('dayProduct', !answers.dayProduct)}
                                        />
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            id="nightProduct"
                                            label="Night"
                                            checked={answers.nightProduct}
                                            onChange={() => handleAnswerChange('nightProduct', !answers.nightProduct)}
                                        />
                                    </div>
                                </Form.Group>
                            )}
                        </Form>
                    </Card.Body>
                </Card>
                {/* Elimination Routine */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Elimination Routine</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.eliminationRoutine || ''}
                                    onChange={(e) => handleAnswerChange('eliminationRoutine', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Catheter Insertion Date */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Catheter Insertion Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={answers.catheterInsertionDate || ''}
                                    onChange={(e) => handleAnswerChange('catheterInsertionDate', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientElimination;
