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
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Diet</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => handleAnswerChange('diet', '')}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form.Group className="question-group">
                            <div className="radio-group">
                                {dietOptions.map(diet => (
                                    <div key={diet} className="radio-option">
                                        <Form.Check
                                            name="diet"
                                            type="radio"
                                            id={`diet-${diet}`}
                                            checked={nutritionData.diet === diet}
                                            onChange={() => !readOnly && handleAnswerChange('diet', diet)}
                                            disabled={readOnly}
                                        />
                                        <label htmlFor={`diet-${diet}`} className="radio-label">
                                            {diet}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Assist selection */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Assistance</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => handleAnswerChange('assist', '')}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form.Group className="question-group">
                            <div className="radio-group">
                                {assistOptions.map(assist => (
                                    <div key={assist} className="radio-option">
                                        <Form.Check
                                            name="assist"
                                            type="radio"
                                            id={`assist-${assist}`}
                                            checked={nutritionData.assist === assist}
                                            onChange={() => !readOnly && handleAnswerChange('assist', assist)}
                                            disabled={readOnly}
                                        />
                                        <label htmlFor={`assist-${assist}`} className="radio-label">
                                            {assist}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Intake */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Measurement</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => handleAnswerChange('intake', '')}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-group">
                            <label className="question-label">Amount:</label>
                            <Form.Select
                                value={nutritionData.intake || ''}
                                onChange={(e) => handleAnswerChange('intake', e.target.value)}
                                style={{ maxWidth: '200px' }}
                                disabled={readOnly}
                                className="dropdown"
                            >
                                <option value="">Select</option>
                                <option value="1/4">1/4</option>
                                <option value="1/2">1/2</option>
                                <option value="3/4">3/4</option>
                                <option value="Full">Full</option>
                            </Form.Select>
                        </div>
                    </Card.Body>
                </Card>

                {/* Special needs */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Dietary Needs</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => handleAnswerChange('specialNeeds', '')}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-group">
                            <label className="question-label">Thickened Fluids/Snacks/Meal Supplement:</label>
                            <Form.Control
                                type="text"
                                value={nutritionData.specialNeeds || ''}
                                onChange={(e) => !readOnly && handleAnswerChange('specialNeeds', e.target.value)}
                                disabled={readOnly}
                                className="text-input"
                            />
                        </div>
                    </Card.Body>
                </Card>

                {/* Weight details */}
                <Card className="assessment-card" style={{ border: errors.weightSection ? "8px solid #ffc107" : "none" }}>
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Weighing</h4>
                        <button
                            className="clear-section-btn"
                            onClick={() => {
                                handleWeightAnswerChange('weight', '');
                                handleAnswerChange('method', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <div className="question-group">
                                <label className="question-label">Weight (lbs):</label>
                                <Form.Control
                                    type="text"
                                    style={{ width: '65px', cursor: readOnly ? 'not-allowed' : 'text' }}
                                    value={profileData.weight || ''}
                                    onChange={(e) => {
                                        !readOnly &&
                                            handleWeightAnswerChange('weight', e.target.value);
                                        setErrors(prev => ({ ...prev, weight: false }));
                                    }}
                                    disabled={readOnly}
                                    isInvalid={errors.weight && isNaN(profileData.weight)}
                                    className="text-input"
                                />
                                {errors.weight && isNaN(profileData.weight) && (
                                    <div className="text-warning small mt-1">Weight must have a numeric value</div>
                                )}
                            </div>

                            <div className="question-group">
                                <label className="question-label">Date of Weighing:</label>
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
                                    className="date-input"
                                />
                            </div>

                            <div className="question-group">
                                <label className="question-label">Weighing Method:</label>
                                <div className="radio-group">
                                    {weighingOptions.map(method => (
                                        <div key={method} className="radio-option">
                                            <Form.Check
                                                name="method"
                                                type="radio"
                                                id={`method-${method}`}
                                                checked={nutritionData.method === method}
                                                onClick={() => {
                                                    if (!readOnly) {
                                                        if (nutritionData.method === method) {
                                                            handleAnswerChange('method', '');
                                                        } else {
                                                            handleAnswerChange('method', method);
                                                        }
                                                        setErrors(prev => ({ ...prev, method: false }));
                                                    }
                                                }}
                                                isInvalid={errors.method && !nutritionData.method}
                                                disabled={readOnly}
                                            />
                                            <label htmlFor={`method-${method}`} className="radio-label">
                                                {method}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {errors.weightSection && (
                            <div className="text-warning small mt-1">Must fill out all fields to submit weight assessment</div>
                        )}
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
