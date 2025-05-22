import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { Snackbar, Alert } from '@mui/material';
import '../css/assessment_styles.css';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';


const PatientCognitive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const APIHOST = import.meta.env.VITE_API_URL;
    const readOnly = useReadOnlyMode();

    //checks if there are any changes
    const isDirty = () => {
        return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
    };

    useEffect(() => {
        const savedData = localStorage.getItem(`patient-cognitive-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed);
            setInitialAnswers(parsed);
        } else {
            const today = new Date().toISOString().split('T')[0];
            const defaultState = { mmse: today };
            setAnswers(defaultState);
            setInitialAnswers(defaultState);
            // fetchPatientData();
        }
    }, [id]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty()) {
                e.preventDefault();
                e.returnValue = ''; // required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty()]);

    // const fetchPatientData = async () => {
    //     try {
    //         const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/cognitive`);
    //         setAnswers(prev => ({ ...prev, ...response.data }));
    //         setInitialAnswers(prev => ({ ...prev, ...response.data }));
    //     } catch (error) {
    //         console.error('Error fetching patient:', error);

    //     }
    // };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    const handleSave = () => {
        try {
            const filteredCognitiveData = removeEmptyValues(answers);

            if (Object.keys(filteredCognitiveData).length > 0) {
                const updatedAnswers = {
                    ...filteredCognitiveData,
                    timestamp: new Date().toISOString(),
                };
                localStorage.setItem(`patient-cognitive-${id}`, JSON.stringify(updatedAnswers));
            } else {
                localStorage.removeItem(`patient-cognitive-${id}`);
            }

            setAnswers(filteredCognitiveData);
            setInitialAnswers(filteredCognitiveData);

            setSnackbar({
                open: true,
                message: 'Patient record saved successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving data:', error);
            setSnackbar({
                open: true,
                message: 'Failed to save assessment.',
                severity: 'error'
            });
        }
    };

    useNavigationBlocker(isDirty());

    return (
        <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
            <AssessmentsCard />
            <div className="ms-4 flex-fill assessment-page">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Cognitive</text>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/patients/${id}`)}
                        >
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

                {/* Confusion */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Level of Confusion</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('confusion', '');

                            }}
                            >
                                Clear Section
                            </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div classname="question-grid">
                            <Form.Group className="question-group">
                                <label className="question-label">Confusion:</label>
                                <div className="radio-group">
                                    {['None', 'Occasionally', 'Always', 'HS'].map((option) => (
                                        <div key={option} className="radio-option">
                                            <Form.Check
                                                name="confusion"
                                                type="radio"
                                                id={`confusion-${option}`}                                                
                                                checked={answers.confusion === option}
                                                onChange={() => !readOnly && handleAnswerChange('confusion', option)}
                                                disabled={readOnly}
                                            />
                                            <label htmlFor={`confusion-${option}`} className="radio-label">
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>                                
                            </Form.Group>
                        </div>
                    </Card.Body>
                </Card>

                {/* Verbal */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Verbal Assessment</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange(verbal, '');
                            }}
                        >
                            Clear Section
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <div className="question-group">
                                <label className="question-label">Verbal:</label>
                                <Form.Select
                                    value={answers.verbal || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('verbal', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                    disabled={readOnly}
                                    className="dropdown"
                                >
                                    <option value="">Select</option>
                                    <option value="Clear">Clear</option>
                                    <option value="Slurred">Slurred</option>
                                    <option value="Non-Verbal">Non-Verbal</option>
                                </Form.Select>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* LOC */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Consciousness</h4>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <div className="question-group">
                                <label className="question-label">LOC (Level of Consciousness):</label>
                                <Form.Select
                                    value={answers.loc || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('loc', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                    disabled={readOnly}
                                    className="dropdown"
                                >
                                    <option value="">Select</option>
                                    <option value="Alert">Alert</option>
                                    <option value="Drowsy">Drowsy</option>
                                    <option value="Sedated">Sedated</option>
                                </Form.Select>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* MMSE */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">MMSE</h4>
                        
                    </Card.Header>

                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <div className="question-group">
                                <label className="question-label">Date of Assessment:</label>
                                <Form.Control
                                    type="date"
                                    name="mmse"
                                    value={answers.mmse || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('mmse', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                    disabled={readOnly}
                                />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PatientCognitive;
