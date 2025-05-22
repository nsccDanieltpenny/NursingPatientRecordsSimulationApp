import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import { useDefaultDate } from '../utils/useDefaultDate';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';

const PatientElimination = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const readOnly = useReadOnlyMode();
    const APIHOST = import.meta.env.VITE_API_URL;
    const currentDate = useDefaultDate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    //checks if there are any changes
    const isDirty = () => {
        return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
    };


    useEffect(() => {
        const savedData = localStorage.getItem(`patient-elimination-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed);
            setInitialAnswers(parsed);
        }
        // else {
        //     const today = new Date().toISOString().split('T')[0];
        //     const defaultState = {
        //         catheterInsertionDate: today,
        //         catheterInsertion: "no"
        //     };
        //     setAnswers(defaultState);
        //     setInitialAnswers(defaultState);
        //     // fetchPatientData();
        // }
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
    //         const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/elimination`);
    //         setAnswers(prev => ({ ...prev, ...response.data }));
    //         setInitialAnswers(prev => ({ ...prev, ...response.data }));
    //     } catch (error) {
    //         console.error('Error fetching patient:', error);
    //     }
    // };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prev => {
            const updated = { ...prev, [question]: answer };

            // Auto-fill today's date if catheter insertion is set to "yes" and no date exists
            if (
                question === 'catheterInsertion' &&
                answer === 'yes' &&
                !prev.catheterInsertionDate
            ) {
                updated.catheterInsertionDate = currentDate;
            }

            if (question === 'catheterInsertion' && answer === 'no') {
                if (updated.catheterInsertionDate) delete updated.catheterInsertionDate
                if (updated.catheterSize) delete updated.catheterSize
            }

            return updated;
        });
    };

    const handleSave = () => {
        try {
            const filteredEliminationData = removeEmptyValues(answers);

            if (Object.keys(filteredEliminationData).length > 0) {
                const updatedAnswers = {
                    ...filteredEliminationData,
                    timestamp: new Date().toISOString(),
                };
                localStorage.setItem(`patient-elimination-${id}`, JSON.stringify(updatedAnswers));
            } else {
                localStorage.removeItem(`patient-elimination-${id}`);
            }

            setAnswers(filteredEliminationData);
            setInitialAnswers(filteredEliminationData);

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
            <AssessmentsCard />
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Elimination</text>
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

                {/* Product Dropdown */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Product Type</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('product', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Product:</label>
                                    <Form.Select
                                        value={answers.product || ''}
                                        onChange={(e) => !readOnly && handleAnswerChange('product', e.target.value)}
                                        disabled={readOnly}
                                        className="dropdown"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Day">Day</option>
                                        <option value="Night">Night</option>
                                        <option value="Both">Both</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Catheter Insertion + Date */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Catheter Information</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('catheterInsertion', '');
                                handleAnswerChange('catheterInsertionDate', '');
                                handleAnswerChange('catheterSize', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Catheter Insertion:</label>
                                    <div className="radio-group">
                                        {['Yes', 'No'].map((option) => (
                                            <div key={option} className="radio-option">
                                                <Form.Check
                                                    inline
                                                    name="catheterInsertion"
                                                    type="radio"
                                                    id={`catheterInsertion-${option.toLowerCase()}`}
                                                    checked={answers.catheterInsertion === option.toLowerCase()}
                                                    onChange={() => !readOnly && handleAnswerChange('catheterInsertion', option.toLowerCase())}
                                                    disabled={readOnly}
                                                />
                                                <label htmlFor={`catheterInsertion-${option.toLowerCase()}`} className="radio-label">
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {answers.catheterInsertion === 'yes' && (
                                    <>
                                        <div className="question-group">
                                            <label className="question-label">Insertion Date:</label>
                                            <Form.Control
                                                type="date"
                                                value={answers.catheterInsertionDate || ''}
                                                onChange={(e) =>
                                                    handleAnswerChange('catheterInsertionDate', e.target.value)
                                                }
                                                className="dropdown"
                                            />
                                        </div>
                                        <div className="question-group">
                                            <label className="question-label">Catheter Size:</label>
                                            <Form.Select
                                                value={answers.catheterSize || ''}
                                                onChange={(e) => handleAnswerChange('catheterSize', e.target.value)}
                                                className="dropdown"
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="14">14</option>
                                                <option value="16">16</option>
                                                <option value="18">18</option>
                                                <option value="20">20</option>
                                            </Form.Select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Elimination Routine */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Elimination Routine</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('eliminationRoutine', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form>
                            <div className="question-grid">
                                <div className="question-group full-width">
                                    <label className="question-label">Routine:</label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={answers.eliminationRoutine || ''}
                                        onChange={(e) => !readOnly && handleAnswerChange('eliminationRoutine', e.target.value)}
                                        disabled={readOnly}
                                        className="text-area"
                                    />
                                </div>
                            </div>
                        </Form>
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

export default PatientElimination;
