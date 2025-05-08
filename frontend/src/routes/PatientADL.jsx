import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { Snackbar, Alert } from '@mui/material';
import '../css/assessment_styles.css';


const PatientADL = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const [errors, setErrors] = useState({});
    const APIHOST = import.meta.env.VITE_API_URL;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
      });

    useEffect(() => {
        const savedData = localStorage.getItem(`patient-adl-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed);
            setInitialAnswers(parsed);
        } else {
            const today = new Date().toISOString().split('T')[0];
            const defaultState = { bathDate: today };
            setAnswers(defaultState);
            setInitialAnswers(defaultState);
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/adl`);
            setAnswers(prev => ({ ...prev, ...response.data }));
            setInitialAnswers(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching patient:', error);
            setSnackbar({
                open: true,
                message: 'Error: Failed to fetch patient.',
                severity: 'error'
              });
        }
    };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prev => ({
            ...prev,
            [question]: answer
        }));

        if (question === 'tubShowerOther' && answer) {
            setErrors(prev => ({ ...prev, tubShowerOther: false }));
        }
    };

    const handleSave = () => {
        if (!answers.tubShowerOther) {
            setErrors(prev => ({ ...prev, tubShowerOther: true }));
            setSnackbar({
                open: true,
                message: 'Please select a bathing method before saving.',
                severity: 'error'
              });
            return;
        }

        try {
            localStorage.setItem(`patient-adl-${id}`, JSON.stringify(answers));
            setInitialAnswers(answers); // reset dirty check
            setSnackbar({
                open: true,
                message: 'Patient record saved successfully!',
                severity: 'success'
              });

        } catch (error) {
            console.error('Error saving data:', error);
            setSnackbar({
                open: true,
                message: 'Error: Failed to save patient data.',
                severity: 'error'
              });
        }
    };

    const isDirty = () => {
        return JSON.stringify(answers) !== JSON.stringify(initialAnswers);
    };

    const questions = [
        { id: 'footCare', text: 'Foot Care' },
        { id: 'hairCare', text: 'Hair Care' },
    ];

    return (
        <div className="container mt-4 d-flex assessment-page">
            <AssessmentsCard />
            <div className="ms-4 flex-fill assessment-page">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <h2>ADLs</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!isDirty()}
                            variant={isDirty() ? 'success' : 'secondary'}
                            style={{
                                opacity: isDirty() ? 1 : 0.5,
                                cursor: isDirty() ? 'pointer' : 'not-allowed',
                                border: 'none',
                                backgroundColor: isDirty() ? '#198754' : '#e0e0e0',
                                color: isDirty() ? 'white' : '#777',
                                pointerEvents: isDirty() ? 'auto' : 'none'
                            }}
                        >
                            {isDirty() ? 'Save' : 'No Changes'}
                        </Button>
                    </div>
                </div>

                {/* Bath Date & Tub/Shower/Other */}
                <Card className="mt-4 gradient-background">
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
                                    <Form.Label>
                                        Hygiene Options <span className="text-danger">*</span>
                                    </Form.Label>
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
                                                isInvalid={errors.tubShowerOther && !answers.tubShowerOther}
                                            />
                                        ))}
                                    </div>
                                    {errors.tubShowerOther && (
                                        <div className="text-danger mt-1">
                                            Please select a bathing method.
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Type of Care */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Type of Care</Form.Label>
                                <div className="d-flex align-items-center">
                                    {['Full', 'Assist', 'Independent'].map((opt) => (
                                        <Form.Check
                                            inline
                                            key={opt}
                                            name="typeOfCare"
                                            type="radio"
                                            label={opt}
                                            id={`typeOfCare-${opt}`}
                                            checked={answers.typeOfCare === opt}
                                            onChange={() => handleAnswerChange('typeOfCare', opt)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Turning */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Turning</Form.Label>
                                <div className="d-flex align-items-center mb-2">
                                    {['Yes', 'No'].map((opt) => (
                                        <Form.Check
                                            inline
                                            key={opt}
                                            name="turning"
                                            type="radio"
                                            label={opt}
                                            id={`turning-${opt.toLowerCase()}`}
                                            checked={answers.turning === opt}
                                            onChange={() => handleAnswerChange('turning', opt)}
                                        />
                                    ))}
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
                <Card className="mt-4 gradient-background">
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
                <Card className="mt-4 gradient-background">
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
            <Snackbar
                  open={snackbar.open}
                  autoHideDuration={6000}
                  onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Alert 
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                  >
                    {snackbar.message}
                  </Alert>
                </Snackbar>
        </div>
    );
};

export default PatientADL;
