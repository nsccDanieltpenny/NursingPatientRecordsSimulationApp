import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { useDefaultDate } from '../utils/useDefaultDate';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';


const PatientNutrition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const currentDate = useDefaultDate();
    const [nutritionData, setNutritionData] = useState({ date: currentDate });
    const [initialNutritionData, setInitialNutritionData] = useState({ date: currentDate });
    const [profileData, setProfileData] = useState({});
    const [initialProfileData, setInitialProfileData] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const readOnly = useReadOnlyMode();
    const APIHOST = import.meta.env.VITE_API_URL;
    const dietOptions = ['Puree', 'Minced', 'Regular', 'Liquid', 'NPO'];
    const assistOptions = ['Independent', 'Set up', 'Full'];
    const weighingOptions = ['Bed', 'Scale'];

    //checks if there are any changes
    const isDirty = () => {
        return (
            JSON.stringify(removeEmptyValues(nutritionData)) !== JSON.stringify(removeEmptyValues(initialNutritionData)) ||
            JSON.stringify(removeEmptyValues(profileData)) !== JSON.stringify(removeEmptyValues(initialProfileData))
        );
    };

    useEffect(() => {
        const savedData = localStorage.getItem(`patient-nutrition-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setNutritionData(parsed);
            setInitialNutritionData(parsed);
        }

        const savedProfileData = localStorage.getItem(`patient-profile-${id}`);
        if (savedProfileData) {
            const parsed = JSON.parse(savedProfileData);
            setProfileData(parsed);
            setInitialProfileData(parsed);
        }
    }, [id]);

    //remove error messages if all weight section fields are cleared
    useEffect(() => {
        if (!profileData.weight && !nutritionData.method) {
            setErrors(prev => ({ ...prev, weightSection: false }));
        }
    }, [profileData.weight, nutritionData.method]);


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

    const handleAnswerChange = (question, answer) => {
        setNutritionData(prev => ({
            ...prev,
            [question]: answer
        }));
    };


    const handleWeightAnswerChange = (question, answer) => {
        setProfileData(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    const handleSave = () => {
        if (profileData.weight && isNaN(profileData.weight)) {
            setErrors(prev => ({ ...prev, weight: true }));
            setSnackbar({
                open: true,
                message: 'Weight must have a numeric value',
                severity: 'error'
            });
            return;
        }

        if (profileData.weight || nutritionData.method) {
            if (!profileData.weight || !nutritionData.method || !nutritionData.date) {
                setErrors(prev => ({ ...prev, weightSection: true }));
                setSnackbar({
                    open: true,
                    message: 'Must fill in all "Weighing" fields to submit weight assessment',
                    severity: 'error'
                });
                return;
            }
        }

        try {
            if (nutritionData) {
                const filteredNutritionData = removeEmptyValues(nutritionData);
                if (nutritionData.date && !profileData.weight && !nutritionData.method) delete filteredNutritionData.date;
                if (Object.keys(filteredNutritionData).length > 0) {
                    const updatedAnswers = {
                        ...filteredNutritionData,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem(`patient-nutrition-${id}`, JSON.stringify(updatedAnswers));
                } else {
                    localStorage.removeItem(`patient-nutrition-${id}`)
                }
                setNutritionData(filteredNutritionData)
                setInitialNutritionData(filteredNutritionData);
            }

            if (profileData) {
                const filteredProfileData = removeEmptyValues(profileData)
                if (Object.keys(filteredProfileData).length > 0) {
                    const updatedAnswers = {
                        ...filteredProfileData,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem(`patient-profile-${id}`, JSON.stringify(updatedAnswers));
                } else {
                    localStorage.removeItem(`patient-profile-${id}`)
                }
                setProfileData(filteredProfileData);
                setInitialProfileData(filteredProfileData);
            }

            setSnackbar({
                open: true,
                message: 'Patient record saved successfully!',
                severity: 'success'
            });

            setErrors(prev => ({ ...prev, weightSection: false }));

        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    useNavigationBlocker(isDirty());

    return (
        <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
            <AssessmentsCard />
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Nutrition</text>
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

                {/* Diet Selection */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Diet:</Form.Label>
                                <div className="d-flex align-items-center">
                                    {dietOptions.map(diet => (
                                        <Form.Check
                                            key={diet}
                                            inline
                                            name="diet"
                                            type="radio"
                                            label={diet}
                                            checked={nutritionData.diet === diet}
                                            onChange={() => !readOnly && handleAnswerChange('diet', diet)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Assist selection */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Assistance:</Form.Label>
                                <div className="d-flex align-items-center">
                                    {assistOptions.map(assist => (
                                        <Form.Check
                                            key={assist}
                                            inline
                                            name="assist"
                                            type="radio"
                                            label={assist}
                                            checked={nutritionData.assist === assist}
                                            onChange={() => !readOnly && handleAnswerChange('assist', assist)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Intake */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Intake:</Form.Label>
                                <Form.Select
                                    value={nutritionData.intake || ''}
                                    onChange={(e) => handleAnswerChange('intake', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                    disabled={readOnly}
                                >
                                    <option value="">Select</option>
                                    <option value="1/4">1/4</option>
                                    <option value="1/2">1/2</option>
                                    <option value="3/4">3/4</option>
                                    <option value="Full">Full</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Special needs */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Special Needs (Thickened fluids/snacks/meal supplement):</Form.Label>
                                <Form.Control
                                    style={{ cursor: readOnly ? 'not-allowed' : 'text' }}
                                    type="text"
                                    value={nutritionData.specialNeeds || ''}
                                    onChange={(e) => !readOnly && handleAnswerChange('specialNeeds', e.target.value)}
                                    disabled={readOnly} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Weight details */}
                <Card className="mt-4 gradient-background" style={{ border: errors.weightSection ? "8px solid #ffc107" : "none" }}>
                    <Card.Body>
                        <Form>
                            <Form.Label>Weighing:</Form.Label>
                            {/* <div className="row" style={{ border: errors.weightSection ? "1px solid red" : "none" }}> */}
                            <div className="row">
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label className='fs-5'>Weight:</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            className="me-2"
                                            style={{ width: '65px', cursor: readOnly ? 'not-allowed' : 'text' }}
                                            value={profileData.weight || ''}
                                            onChange={(e) => {
                                                !readOnly &&
                                                    handleWeightAnswerChange('weight', e.target.value);
                                                setErrors(prev => ({ ...prev, weight: false }));
                                            }}
                                            disabled={readOnly}
                                            isInvalid={errors.weight && isNaN(profileData.weight)}
                                        />
                                        <span className='text-white'>lbs.</span>
                                    </div>
                                    {errors.weight && isNaN(profileData.weight) && (
                                        <div className="text-warning small mt-1">Weight must have a numeric value</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3 col-sm me-5">
                                    <Form.Label className='fs-5'>Date of Weighing:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={nutritionData.date || ''}
                                        onChange={(e) => {
                                            !readOnly &&
                                                handleAnswerChange('date', e.target.value);
                                            setErrors(prev => ({ ...prev, date: false }));
                                        }}
                                        readOnly={readOnly}
                                        disabled={!profileData.weight && !nutritionData.method}
                                        isInvalid={errors.date && !nutritionData.date}
                                        style={{ cursor: readOnly ? 'not-allowed' : 'text' }}
                                    />
                                    {/* {errors.date && !nutritionData.date && (
                                        <div className="text-danger small mt-1">Please select a date.</div>
                                    )} */}
                                </Form.Group>

                                <Form.Group className="mb-3 col-sm ms-5">
                                    <Form.Label className='fs-5'>Weighing Method:</Form.Label>
                                    <div className="d-flex align-items-center">
                                        {weighingOptions.map(method => (
                                            <Form.Check
                                                key={method}
                                                inline
                                                name="method"
                                                type="radio"
                                                label={method}
                                                checked={nutritionData.method === method}
                                                // onChange={() => {
                                                //     !readOnly &&
                                                //         handleAnswerChange('method', method);
                                                //     setErrors(prev => ({ ...prev, method: false }));
                                                // }}
                                                onClick={() => {
                                                    if (!readOnly) {
                                                        if (nutritionData.method === method) {
                                                            handleAnswerChange('method', ''); // Deselect
                                                        } else {
                                                            handleAnswerChange('method', method); // Select
                                                        }
                                                        setErrors(prev => ({ ...prev, method: false }));
                                                    }
                                                }}

                                                isInvalid={errors.method && !nutritionData.method}
                                                disabled={readOnly}
                                            />
                                        ))}
                                    </div>
                                    {/* {errors.method && !nutritionData.method && (
                                        <div className="text-danger small mt-1">Please select a weighing method.</div>
                                    )} */}
                                </Form.Group>
                            </div>
                            {errors.weightSection && (
                                <div className="text-warning small mt-1">Must fill out all fields to submit weight assessment</div>
                            )}
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

export default PatientNutrition;
