import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import AssessmentSidebar from '../components/AssessmentSidebar';
import axios from 'axios';

/* Patient Safety Page
    ----------------
    Handles the patient safety assessment page.
*/

const PatientSafety = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});


    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // console.log(`Fetching patient with id: ${id}`);
                const response = await axios.get('http://localhost:5232/api/safety/1');
                console.log('Response:', response.data);
                setAnswers(response.data);
                console.log(answers)

            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };
        fetchPatientData();
    }, []);


    // function to handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // array of questions with their identifiers and text
    const questions = [
        { id: 'question1', text: 'Hip Protectors' },
        { id: 'question2', text: 'Side Rails ' },
        { id: 'question3', text: 'Crash Mats' },
        { id: 'question4', text: 'Bed Alarm ' },
        { id: 'question5', text: 'Chair Alarm' },
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentSidebar />

            {/* Page Content */}
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Safety</h2>
                    <div className="d-flex gap-2">
                        {/* <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}> */}
                        <Button variant="primary" onClick={() => navigate(`/api/patients/1`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success">
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
          
                                            onChange={() => handleAnswerChange(question.id, 'yes')}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}

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
                                        checked={answers.fallrisk === 'Low'}
                                        onChange={() => handleAnswerChange('fallrisk', 'Low')}
                                    />
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-Medium"
                                        label="Medium"
                                        checked={answers.fallrisk === 'Medium'}
                                        onChange={() => handleAnswerChange('fallrisk', 'Medium')}
                                    />
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-High"
                                        label="High"
                                        checked={answers.fallrisk === 'High'}
                                        onChange={() => handleAnswerChange('fallrisk', 'High')}
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