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
    const [nutritionData, setNutritionData] = useState({});
    const [profileData, setProfileData] = useState({});
   const defaultDate = useDefaultDate();
    const [answers, setAnswers] = useState({date: defaultDate});
   
    const APIHOST = import.meta.env.VITE_API_URL;


    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-nutrition-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (!parsed.date) {
                parsed.date = defaultDate;
            }
            setNutritionData(parsed);
        } else {
            setAnswers({date: defaultDate});
            fetchNutritionData();
        }

        const savedProfileData = localStorage.getItem(`patient-profile-${id}`);
        if (savedProfileData) {
            setProfileData(JSON.parse(savedProfileData));
        } else {
            fetchProfileData();
        }
    }, [id]);

    const fetchNutritionData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/nutrition`);
            console.log('Response:', response.data);
            setNutritionData(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    const fetchProfileData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/${id}`);
            console.log('Response:', response.data);
            setProfileData(response.data);
            console.log(profileData);
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

    // Save function for the Save button
    const handleSave = () => {
        try {
            // Save to localStorage
            localStorage.setItem(`patient-nutrition-${id}`, JSON.stringify(nutritionData));
            localStorage.setItem(`patient-profile-${id}`, JSON.stringify(profileData));

            // Show success message
            alert('Nutrition data saved successfully!');


        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    return (
        <div className="container mt-4 d-flex ">
            {/* Sidebar */}
            
            <AssessmentsCard />
            {/* Page Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Nutrition</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>

                {/* Diet Selection */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Diet:</Form.Label>
                                <div className="d-flex align-items-center">
                                    {['Puree', 'Minced', 'Regular', 'Liquid', 'NPO'].map(diet => (
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

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Assist:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="assist"
                                        type="radio"
                                        id="assist-independent"
                                        label="Independent"
                                        checked={nutritionData.assist === 'Independent'}
                                        onChange={() => handleAnswerChange('assist', 'Independent')}
                                    />
                                    <Form.Check
                                        inline
                                        name="assist"
                                        type="radio"
                                        id="assist-setup"
                                        label="Set up"
                                        checked={nutritionData.assist === 'Set up'}
                                        onChange={() => handleAnswerChange('assist', 'Set up')}
                                    />
                                    <Form.Check
                                        inline
                                        name="assist"
                                        type="radio"
                                        id="assist-full"
                                        label="Full"
                                        checked={nutritionData.assist === 'Full'}
                                        onChange={() => handleAnswerChange('assist', 'Full')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Intake</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nutritionData.intake || ''}
                                    onChange={(e) => handleAnswerChange('intake', e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Special Needs</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nutritionData.specialNeeds || ''}
                                    onChange={(e) => handleAnswerChange('specialNeeds', e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Weight and IV Details */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weight</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`${profileData.weight} kg`}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\s*kg\s*/, '');
                                            handleWeightAnswerChange('weight', value);
                                        }} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Date of Weighing</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={answers.date|| ''}
                                        onChange={(e) => handleAnswerChange('date', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-sm">
                                    <Form.Label>Weighing Method</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            name="method"
                                            type="radio"
                                            id="method-bed"
                                            label="Bed"
                                            checked={nutritionData.method === 'Bed'}
                                            onChange={() => handleAnswerChange('method', 'Bed')}
                                        />
                                        <Form.Check
                                            inline
                                            name="method"
                                            type="radio"
                                            id="method-scale"
                                            label="Scale"
                                            checked={nutritionData.method === 'Scale'}
                                            onChange={() => handleAnswerChange('method', 'Scale')}
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>IV Solution/Rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nutritionData.ivSolutionRate || ''}
                                        onChange={(e) => handleAnswerChange('ivSolutionRate', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Special Needs & Preferences</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nutritionData.specialNeeds || ''}
                                        onChange={(e) => handleAnswerChange('specialNeeds', e.target.value)} />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card> */}
            </div>
        </div>
    );
};

export default PatientNutrition;