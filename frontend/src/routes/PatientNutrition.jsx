import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { useDefaultDate } from '../utils/useDefaultDate';

const PatientNutrition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [nutritionData, setNutritionData] = useState({});
    const [initialNutritionData, setInitialNutritionData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [initialProfileData, setInitialProfileData] = useState({});
    const currentDate = useDefaultDate();

    const APIHOST = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const savedData = localStorage.getItem(`patient-nutrition-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            parsed.date = currentDate;
            setNutritionData(parsed);
            setInitialNutritionData(parsed);
        } else {
            fetchNutritionData();
            setNutritionData(prev => ({ ...prev, date: currentDate }));
            setInitialNutritionData(prev => ({ ...prev, date: currentDate }));
        }

        const savedProfileData = localStorage.getItem(`patient-profile-${id}`);
        if (savedProfileData) {
            const parsed = JSON.parse(savedProfileData);
            setProfileData(parsed);
            setInitialProfileData(parsed);
        } else {
            fetchProfileData();
        }
    }, [id]);

    const fetchNutritionData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/nutrition`);
            console.log('Response:', response.data);
            setNutritionData(response.data);
            setInitialNutritionData(response.data);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        }
    };

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/${id}`);
            console.log('Response:', response.data);
            setProfileData(response.data);
            setInitialProfileData(response.data);
        } catch (error) {
            console.error('Error fetching patient profile data:', error);
        }
    };

    const handleAnswerChange = (question, answer) => {
        setNutritionData(prevAnswers => ({
            ...prevAnswers,
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
        if (!profileData.weight || isNaN(profileData.weight)) {
            setErrors(prev => ({ ...prev, weight: true }));
            return;
        }

        if (!nutritionData.date) {
            setErrors(prev => ({ ...prev, date: true }));
            return;
        }

        if (!nutritionData.method) {
            setErrors(prev => ({ ...prev, method: true }));
            return;
        }

        try {
            if (nutritionData && Object.keys(nutritionData).length > 0) {
                localStorage.setItem(`patient-nutrition-${id}`, JSON.stringify(nutritionData));
                setInitialNutritionData(nutritionData);
            }

            if (profileData) {
                localStorage.setItem(`patient-profile-${id}`, JSON.stringify(profileData));
                setInitialProfileData(profileData);
            }

            alert('All data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    const isDirty = () => {
        return (
            JSON.stringify(nutritionData) !== JSON.stringify(initialNutritionData) ||
            JSON.stringify(profileData) !== JSON.stringify(initialProfileData)
        );
    };

    const dietOptions = ['Puree', 'Minced', 'Regular', 'Liquid', 'NPO'];
    const assistOptions = ['Independent', 'Set up', 'Full'];
    const weighingOptions = ['Bed', 'Scale'];

    return (
        <div className="container mt-4 d-flex ">
            <AssessmentsCard />
            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Nutrition</h2>
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

                {/* Diet Selection */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5 fw-semibold mb-3">Diet</Form.Label>
                                <div className="d-flex align-items-center">
                                    {dietOptions.map(diet => (
                                        <Form.Check
                                            key={diet}
                                            inline
                                            name="diet"
                                            type="radio"
                                            label={diet}
                                            checked={nutritionData.diet === diet}
                                            onChange={() => handleAnswerChange('diet', diet)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Assist selection */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5 fw-semibold mb-3">Assistance</Form.Label>
                                <div className="d-flex align-items-center">
                                    {assistOptions.map(assist => (
                                        <Form.Check
                                            key={assist}
                                            inline
                                            name="assist"
                                            type="radio"
                                            label={assist}
                                            checked={nutritionData.assist === assist}
                                            onChange={() => handleAnswerChange('assist', assist)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Intake */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5 fw-semibold mb-3">Intake</Form.Label>
                                <Form.Select
                                    value={nutritionData.intake || ''}
                                    onChange={(e) => handleAnswerChange('intake', e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">Select</option>
                                    <option value="1/4">1/4</option>
                                    <option value="2/4">2/4</option>
                                    <option value="3/4">3/4</option>
                                    <option value="Full">Full</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Special needs */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5 fw-semibold mb-3">Special Needs</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nutritionData.specialNeeds || ''}
                                    onChange={(e) => handleAnswerChange('specialNeeds', e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Weight details */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Label className="fs-5 fw-semibold mb-3">Weighing</Form.Label>
                            <div className="row">
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weight</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            className="me-2"
                                            style={{ width: '65px' }}
                                            value={profileData.weight || ''}
                                            onChange={(e) => {
                                                handleWeightAnswerChange('weight', e.target.value);
                                                setErrors(prev => ({ ...prev, weight: false }));
                                            }}
                                            isInvalid={errors.weight && (!profileData.weight || isNaN(profileData.weight))}
                                        />
                                        <span>kg</span>
                                    </div>
                                    {errors.weight && (!profileData.weight || isNaN(profileData.weight)) && (
                                        <div className="text-danger small mt-1">Weight must have a numeric value.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3 col-sm me-5">
                                    <Form.Label>Date of Weighing</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={nutritionData.date || ''}
                                        onChange={(e) => {
                                            handleAnswerChange('date', e.target.value);
                                            setErrors(prev => ({ ...prev, date: false }));
                                        }}
                                        isInvalid={errors.date && !nutritionData.date}
                                    />
                                    {errors.date && !nutritionData.date && (
                                        <div className="text-danger small mt-1">Please select a date.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3 col-sm ms-5">
                                    <Form.Label>Weighing Method</Form.Label>
                                    <div className="d-flex align-items-center">
                                        {weighingOptions.map(method => (
                                            <Form.Check
                                                key={method}
                                                inline
                                                name="method"
                                                type="radio"
                                                label={method}
                                                checked={nutritionData.method === method}
                                                onChange={() => {
                                                    handleAnswerChange('method', method);
                                                    setErrors(prev => ({ ...prev, method: false }));
                                                }}
                                                isInvalid={errors.method && !nutritionData.method}
                                            />
                                        ))}
                                    </div>
                                    {errors.method && !nutritionData.method && (
                                        <div className="text-danger small mt-1">Please select a weighing method.</div>
                                    )}
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default PatientNutrition;
