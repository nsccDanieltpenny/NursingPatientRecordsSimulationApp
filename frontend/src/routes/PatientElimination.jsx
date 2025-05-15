import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import AssessmentSummaryButton from '../components/common/AssessmentSummaryButton';
import '../css/assessment_summary.css';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import { removeEmptyValues } from '../utils/removeEmptyValues';



const PatientElimination = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const readOnly = useReadOnlyMode();
    const APIHOST = import.meta.env.VITE_API_URL;
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
        } else {
            const today = new Date().toISOString().split('T')[0];
            const defaultState = {
                catheterInsertionDate: today
            };
            setAnswers(defaultState);
            setInitialAnswers(defaultState);
            fetchPatientData();
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

    const fetchPatientData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/elimination`);
            setAnswers(prev => ({ ...prev, ...response.data }));
            setInitialAnswers(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prev => {
            const updated = { ...prev, [question]: answer };

            // Auto-fill today's date if catheter insertion is set to "yes" and no date exists
            if (
                question === 'catheterInsertion' &&
                answer === 'yes' &&
                !prev.catheterInsertionDate
            ) {
                updated.catheterInsertionDate = new Date().toISOString().split('T')[0];
            }

            return updated;
        });
    };

    const handleSave = () => {
        try {
            if (answers) {
                const filteredEliminationData = removeEmptyValues(answers)
                if (filteredEliminationData.catheterInsertion == 'no' || !filteredEliminationData.catheterInsertion) {
                    if (filteredEliminationData.catheterInsertionDate) delete filteredEliminationData.catheterInsertionDate;
                    if (filteredEliminationData.catheterSize) delete filteredEliminationData.catheterSize;
                }
                if (Object.keys(filteredEliminationData).length > 0) {
                    localStorage.setItem(`patient-elimination-${id}`, JSON.stringify(filteredEliminationData));
                } else {
                    localStorage.removeItem(`patient-elimination-${id}`)
                }
                setInitialAnswers(answers);
            }

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
                            onClick={() => navigate(`/api/patients/${id}`)}
                        >
                            Go Back to Profile
                        </Button>

                        <AssessmentSummaryButton />

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
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Product:</Form.Label>
                                <Form.Select
                                    value={answers.product || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('product', e.target.value)}
                                    disabled={readOnly}
                                >
                                    <option value="">Select Product Type</option>
                                    <option value="Day">Day</option>
                                    <option value="Night">Night</option>
                                    <option value="Both">Both</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                {/* Catheter Insertion + Date */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="me-3 mb-0">Catheter Insertion:</Form.Label>
                                <div className="ms-auto d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="catheterInsertion"
                                        type="radio"
                                        id="catheterInsertion-yes"
                                        label="Yes"
                                        checked={answers.catheterInsertion === 'yes'}
                                        onChange={() => !readOnly && handleAnswerChange('catheterInsertion', 'yes')}
                                        disabled={readOnly}
                                    />
                                    <Form.Check
                                        inline
                                        name="catheterInsertion"
                                        type="radio"
                                        id="catheterInsertion-no"
                                        label="No"
                                        checked={answers.catheterInsertion === 'no'}
                                        onChange={() => !readOnly && handleAnswerChange('catheterInsertion', 'no')}
                                        disabled={readOnly}
                                    />
                                </div>
                            </Form.Group>

                            {answers.catheterInsertion === 'yes' && (
                                <div className="d-flex gap-4">
                                    <Form.Group className="mb-3" style={{ flex: 1 }}>
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={answers.catheterInsertionDate || ''}
                                            onChange={(e) =>
                                                handleAnswerChange('catheterInsertionDate', e.target.value)
                                            }
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" style={{ flex: 1 }}>
                                        <Form.Label>Catheter Size:</Form.Label>
                                        <Form.Select
                                            value={answers.catheterSize || ''}
                                            onChange={(e) => handleAnswerChange('catheterSize', e.target.value)}
                                        >
                                            <option value="">Select size</option>
                                            <option value="14">14</option>
                                            <option value="16">16</option>
                                            <option value="18">18</option>
                                            <option value="20">20</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                            )}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Elimination Routine */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Elimination Routine:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.eliminationRoutine || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('eliminationRoutine', e.target.value)}
                                    disabled={readOnly}
                                />

                            </Form.Group>
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
