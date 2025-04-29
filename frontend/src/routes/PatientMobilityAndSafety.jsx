import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';

const PatientMobilityAndSafety = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mobilityData, setMobilityData] = useState({});
    const [safetyData, setSafetyData] = useState({});

    const APIHOST = import.meta.env.VITE_API_URL;

    //load data from localstorage when component mounts
    useEffect(() => {
        const savedMobilityData = localStorage.getItem(`patient-mobility-${id}`);
        if (savedMobilityData) {
            setMobilityData(JSON.parse(savedMobilityData));
        } else {
            fetchMobilityData();
        }

        const savedSafetyData = localStorage.getItem(`patient-safety-${id}`);
        if (savedSafetyData) {
            setSafetyData(JSON.parse(savedSafetyData));
        } else {
            fetchSafetyData();
        }
    }, [id]);


    const fetchMobilityData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/mobility`);
            console.log('Response:', response.data);
            setMobilityData(response.data);
            console.log(mobilityData);
        } catch (error) {
            console.error('Error fetching patient mobility data:', error);
        }
    };

    const fetchSafetyData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/safety`);
            console.log('Response:', response.data);
            setSafetyData(response.data);
            console.log(safetyData);
        } catch (error) {
            console.error('Error fetching patient safety data:', error);
        }
    };

    const handleSafetyAnswerChange = (question, answer) => {
        setSafetyData(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    const handleMobilityAnswerChange = (question, answer) => {
        setMobilityData(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Save function for the Save button
    const handleSave = () => {
        try {
            // Save to localStorage
            localStorage.setItem(`patient-mobility-${id}`, JSON.stringify(mobilityData));
            localStorage.setItem(`patient-safety-${id}`, JSON.stringify(safetyData));

            // Show success message
            alert('Mobility and safety data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    const questions = [
        { id: 'hipProtectors', text: 'Hip Protectors' },
        { id: 'sideRails', text: 'Side Rails ' },
        { id: 'crashMats', text: 'Crash Mats' },
        { id: 'bedAlarm', text: 'Bed Alarm ' },
        // { id: 'question5', text: 'Chair Alarm' },
    ];

    return (
        <div className="container mt-4 d-flex">
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Mobility / Safety</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/api/patients/${id}`)}>
                            Go Back to Profile
                        </Button>
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
                {/* Transfer */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Transfer:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-I"
                                        label="I"
                                        checked={mobilityData.transfer === 'I'}
                                        onChange={() => handleMobilityAnswerChange('transfer', 'I')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-Ax1"
                                        label="Ax1"
                                        checked={mobilityData.transfer === 'Ax1'}
                                        onChange={() => handleMobilityAnswerChange('transfer', 'Ax1')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-Ax2"
                                        label="Ax2"
                                        checked={mobilityData.transfer === 'Ax2'}
                                        onChange={() => handleMobilityAnswerChange('transfer', 'Ax2')}
                                    />
                                    <Form.Check
                                        inline
                                        name="transfer"
                                        type="radio"
                                        id="transfer-ML"
                                        label="ML"
                                        checked={mobilityData.transfer === 'ML'}
                                        onChange={() => handleMobilityAnswerChange('transfer', 'ML')}
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
                                <Form.Label>Aids:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="aids"
                                        type="radio"
                                        id="aids-walker"
                                        label="Walker"
                                        checked={mobilityData.aids === 'Walker'}
                                        onChange={() => handleMobilityAnswerChange('aids', 'Walker')}
                                    />
                                    <Form.Check
                                        inline
                                        name="aids"
                                        type="radio"
                                        id="aids-cane"
                                        label="Cane"
                                        checked={mobilityData.aids === 'Cane'}
                                        onChange={() => handleMobilityAnswerChange('aids', 'Cane')}
                                    />
                                    <Form.Check
                                        inline
                                        name="aids"
                                        type="radio"
                                        id="aids-wheelchair"
                                        label="Wheelchair"
                                        checked={mobilityData.aids === 'Wheelchair'}
                                        onChange={() => handleMobilityAnswerChange('aids', 'Wheelchair')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Yes/No Questions */}
                <Card className="mt-4">
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
                                            checked={safetyData[question.id] === 'yes'}
                                            onChange={() => handleSafetyAnswerChange(question.id, 'yes')}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}
                                            checked={safetyData[question.id] === 'no'}
                                            onChange={() => handleSafetyAnswerChange(question.id, 'no')}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Fall Risk Scale */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Fall Risk Scale</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-Low"
                                        label="Low"
                                        checked={safetyData.fallRiskScale === 'Low'}
                                        onChange={() => handleSafetyAnswerChange('fallRiskScale', 'Low')}
                                    />
                                    <Form.Check
                                        inline
                                        name="fallrisk"
                                        type="radio"
                                        id="fallrisk-High"
                                        label="High"
                                        checked={safetyData.fallRiskScale === 'High'}
                                        onChange={() => handleSafetyAnswerChange('fallRiskScale', 'High')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

            </div>
        </div>
    );
};

export default PatientMobilityAndSafety;