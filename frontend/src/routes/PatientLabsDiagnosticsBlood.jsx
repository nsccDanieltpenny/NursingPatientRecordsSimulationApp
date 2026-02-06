import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';


const PatientLabsDiagnosticsBlood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const readOnly = useReadOnlyMode();

    const APIHOST = import.meta.env.VITE_API_URL;

    //notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Function to get current date-time
    const getCurrentDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
        return localISOTime;
    };

    // Check if there are any changes
    const isDirty = () => {
        return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
    };

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-labsdiagnosticsblood-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed);
            setInitialAnswers(parsed);
        } else {
            const defaultState = {
                timestamp: getCurrentDateTime()
            };
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

    // Handle field changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Save function for the Save button
    const handleSave = () => {
      try {
        const updatedAnswers = {
      ...answers,
      timestamp: new Date().toISOString(),
    };

    const filteredNoteData = removeEmptyValues(updatedAnswers);

    if (Object.keys(filteredNoteData).length > 0) {
      localStorage.setItem(`patient-labsdiagnosticsblood-${id}`, JSON.stringify(filteredNoteData));
    } else {
      localStorage.removeItem(`patient-labsdiagnosticsblood-${id}`);
    }

        setAnswers(updatedAnswers);
        setInitialAnswers(updatedAnswers);
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

    useNavigationBlocker(isDirty());

    return (
        <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
            {/* Sidebar */}
            <AssessmentsCard />

            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Labs / Diagnostics / Blood</text>
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

                {/* Lab Work / Specimens */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Lab Work / Specimens</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('Labs', '');
                                handleAnswerChange('LabsOrderedDate', '');
                                handleAnswerChange('LabsCompletedDate', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                        <Card.Body className="assessment-card-body">
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Lab Work / Specimens:</label>
                                    <Form.Control
                                        type="text"
                                        value={answers.Labs || ''}
                                        onChange={e => !readOnly && handleAnswerChange('Labs', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Ordered:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.LabsOrderedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('LabsOrderedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Completed:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.LabsCompletedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('LabsCompletedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                </Card>

                {/* Diagnostics / Procedure / X-Ray */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Diagnostics / Procedures / X-Ray</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('Diagnostics', '');
                                handleAnswerChange('DiagnosticsOrderedDate', '');
                                handleAnswerChange('DiagnosticsCompletedDate', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                        <Card.Body className="assessment-card-body">
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Diagnostics / Procedures / X-Ray:</label>
                                    <Form.Control
                                        type="text"
                                        value={answers.Diagnostics || ''}
                                        onChange={e => !readOnly && handleAnswerChange('Diagnostics', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Ordered:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.DiagnosticsOrderedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('DiagnosticsOrderedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Completed:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.DiagnosticsCompletedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('DiagnosticsCompletedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                </Card>

                {/* Bloodwork */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Blood Work</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('BloodWork', '');
                                handleAnswerChange('BloodWorkOrderedDate', '');
                                handleAnswerChange('BloodWorkCompletedDate', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                        <Card.Body className="assessment-card-body">
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Blood Work:</label>
                                    <Form.Control
                                        type="text"
                                        value={answers.BloodWork || ''}
                                        onChange={e => !readOnly && handleAnswerChange('BloodWork', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Ordered:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.BloodWorkOrderedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('BloodWorkOrderedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="mb-3">
                                <Form.Group className="mb-3">
                                    <label className="question-label">Date Completed:</label>
                                    <Form.Control
                                        type="date"
                                        value={answers.BloodWorkCompletedDate || ''}
                                        onChange={e => !readOnly && handleAnswerChange('BloodWorkCompletedDate', e.target.value)}
                                        disabled={readOnly}
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientLabsDiagnosticsBlood;