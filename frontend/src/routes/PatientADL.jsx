import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';


const PatientADL = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const APIHOST = import.meta.env.VITE_API_URL;

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
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/adl`);
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

    const handleSave = () => {
        try {
            localStorage.setItem(`patient-adl-${id}`, JSON.stringify(answers));
            alert('ADL data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    const questions = [
        { id: 'footCare', text: 'Foot Care' },
        { id: 'hairCare', text: 'Hair Care' },
    ];

    return (
        <div className="container mt-4 d-flex">
          <AssessmentsCard />
          
    
            <div className="ms-4 flex-fill">
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

                {/* Bath Date & Tub/Shower/Other */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Bath Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={answers.bathDate || ''}
                                        onChange={(e) => handleAnswerChange('bathDate', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Tub/Shower/Other</Form.Label>
                                    <div className="d-flex">
                                        {['Tub', 'Shower', 'Bed Bath'].map((option) => (
                                            <Form.Check
                                                key={option}
                                                inline
                                                label={option}
                                                name="tubShowerOther"
                                                type="radio"
                                                id={`tubShowerOther-${option}`}
                                                checked={answers.tubShowerOther === option}
                                                onChange={() => handleAnswerChange('tubShowerOther', option)}
                                            />
                                        ))}
                                    </div>
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
                                        name="typeOfCare"
                                        type="radio"
                                        label="Full"
                                        id="typeOfCare-Full"
                                        checked={answers.typeOfCare === 'Full'}
                                        onChange={() => handleAnswerChange('typeOfCare', 'Full')}
                                    />
                                    <Form.Check
                                        inline
                                        name="typeOfCare"
                                        type="radio"
                                        label="Assist"
                                        id="typeOfCare-Assist"
                                        checked={answers.typeOfCare === 'Assist'}
                                        onChange={() => handleAnswerChange('typeOfCare', 'Assist')}
                                    />
                                    <Form.Check
                                        inline
                                        name="typeOfCare"
                                        type="radio"
                                        label="Independent"
                                        id="typeOfCare-Independent"
                                        checked={answers.typeOfCare === 'Independent'}
                                        onChange={() => handleAnswerChange('typeOfCare', 'Independent')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Turning */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Turning</Form.Label>
                                <div className="d-flex align-items-center mb-2">
                                    <Form.Check
                                        inline
                                        name="turning"
                                        type="radio"
                                        label="Yes"
                                        id="turning-yes"
                                        checked={answers.turning === 'Yes'}
                                        onChange={() => handleAnswerChange('turning', 'Yes')}
                                    />
                                    <Form.Check
                                        inline
                                        name="turning"
                                        type="radio"
                                        label="No"
                                        id="turning-no"
                                        checked={answers.turning === 'No'}
                                        onChange={() => handleAnswerChange('turning', 'No')}
                                    />
                                </div>
                                {answers.turning === 'Yes' && (
                                    <div className="d-flex">
                                        {['Q2h', 'Q4h', 'QShift'].map((freq) => (
                                            <Form.Check
                                                key={freq}
                                                inline
                                                name="turningFrequency"
                                                type="radio"
                                                label={freq}
                                                id={`turningFrequency-${freq}`}
                                                checked={answers.turningFrequency === freq}
                                                onChange={() => handleAnswerChange('turningFrequency', freq)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Teeth */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Teeth</Form.Label>
                                <div className="d-flex">
                                    {['Denture', 'Self', 'Assist'].map((option) => (
                                        <Form.Check
                                            key={option}
                                            inline
                                            label={option}
                                            name="teeth"
                                            type="radio"
                                            id={`teeth-${option}`}
                                            checked={answers.teeth === option}
                                            onChange={() => handleAnswerChange('teeth', option)}
                                        />
                                    ))}
                                </div>
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
