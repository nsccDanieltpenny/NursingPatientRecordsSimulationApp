import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { Snackbar, Alert } from '@mui/material';
import '../css/assessment_styles.css';

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
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/cognitive`);
            setAnswers(prev => ({ ...prev, ...response.data }));
            setInitialAnswers(prev => ({ ...prev, ...response.data }));
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
            localStorage.setItem(`patient-cognitive-${id}`, JSON.stringify(answers));
            setInitialAnswers(answers);
            setSnackbar({
                open: true,
                message: 'Cognitive assessment saved successfully!',
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

    const isDirty = () => {
        return JSON.stringify(answers) !== JSON.stringify(initialAnswers);
    };

    return (
        <div className="container mt-4 d-flex assessment-page">
            <AssessmentsCard />
            <div className="ms-4 flex-fill assessment-page">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <h2>Cognitive</h2>
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

                {/* Confusion */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Confusion:</Form.Label>
                                <div className="d-flex align-items-center">
                                    {['None', 'Occasionally', 'Always', 'HS'].map((val) => (
                                        <Form.Check
                                            key={val}
                                            inline
                                            name="confusion"
                                            type="radio"
                                            id={`confusion-${val}`}
                                            label={val}
                                            checked={answers.confusion === val}
                                            onChange={() => handleAnswerChange('confusion', val)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Verbal */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Verbal:</Form.Label>
                                <Form.Select
                                    value={answers.verbal || ''}
                                    onChange={(e) => handleAnswerChange('verbal', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">Select</option>
                                    <option value="Clear">Clear</option>
                                    <option value="Slurred">Slurred</option>
                                    <option value="Non-Verbal">Non-Verbal</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* LOC */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>LOC (Level of Consciousness):</Form.Label>
                                <Form.Select
                                    value={answers.loc || ''}
                                    onChange={(e) => handleAnswerChange('loc', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">Select</option>
                                    <option value="Alert">Alert</option>
                                    <option value="Drowsy">Drowsy</option>
                                    <option value="Sedated">Sedated</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* MMSE */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>MMSE Assessment Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={answers.mmse || ''}
                                    onChange={(e) => handleAnswerChange('mmse', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                />
                            </Form.Group>
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

export default PatientCognitive;
