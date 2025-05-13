import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { set } from 'react-hook-form';
import '../css/assessment_styles.css';
import { useDefaultDate } from '../utils/useDefaultDate';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';



const PatientMobilityAndSafety = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialMobilityData, setInitialMobilityData] = useState({});
    const [mobilityData, setMobilityData] = useState({});
    const [initialSafetyData, setInitialSafetyData] = useState({});
    const [safetyData, setSafetyData] = useState({});
    const [initialProfileData, setInitialProfileData] = useState({});
    const [profileData, setProfileData] = useState({});
    const currentDate = useDefaultDate();
    const [errors, setErrors] = useState({});
    const readOnly = useReadOnlyMode();


    const APIHOST = import.meta.env.VITE_API_URL;
    //notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    //load data from localstorage when component mounts
    useEffect(() => {
        const savedMobilityData = localStorage.getItem(`patient-mobility-${id}`);
        if (savedMobilityData) {
            setMobilityData(JSON.parse(savedMobilityData));
            setInitialMobilityData(JSON.parse(savedMobilityData));
        } else {
            fetchMobilityData();
        }

        const savedSafetyData = localStorage.getItem(`patient-safety-${id}`);
        if (savedSafetyData) {
            setSafetyData(JSON.parse(savedSafetyData));
            setInitialSafetyData(JSON.parse(savedSafetyData));
        } else {
            fetchSafetyData();
        }

        const savedProfileData = localStorage.getItem(`patient-profile-${id}`);
        if (savedProfileData) {
            const parsedProfileData = JSON.parse(savedProfileData);
            if (!["Yes", "No"].includes((parsedProfileData.isolationPrecautions || ''))) {
                parsedProfileData.isolationPrecautions = "No";
            }
            setProfileData(parsedProfileData);
            setInitialProfileData(parsedProfileData);
        } else {
            fetchProfileData();
            setProfileData(prev => ({ ...prev, isolationPrecautionsTimestamp: currentDate }));
            setInitialProfileData(prev => ({ ...prev, isolationPrecautionsTimestamp: currentDate }));
        }

    }, [id]);


    const fetchMobilityData = async () => {
        try {
            // console.log(`Fetching patient with id: ${id}`);
            const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/mobility`);
            console.log('Response:', response.data);
            setMobilityData(response.data);
            setInitialMobilityData(response.data);
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
            setInitialSafetyData(response.data);
        } catch (error) {
            console.error('Error fetching patient safety data:', error);
        }
    };

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(`${APIHOST}/api/patients/${id}`);
            console.log('Response:', response.data);

            const isolationValue = (response.data.isolationPrecautions || '');
            if (!["Yes", "No"].includes(isolationValue)) {
                response.data.isolationPrecautions = "No";
            }

            setProfileData(response.data);
            setInitialProfileData(response.data);
        } catch (error) {
            console.error('Error fetching patient profile data:', error);
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

    const handleIsolationPrecautionsAnswerChange = (question, answer) => {
        setProfileData(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Save function for the Save button
    const handleSave = () => {
        // Validate isolation precaution details
        if (profileData.isolationPrecautions === 'Yes') {
            if (!profileData.isolationPrecautionDetails) {
                setErrors(prev => ({ ...prev, isolationPrecautionDetails: true }));
                return;
            }
            if (!profileData.isolationPrecautionsTimestamp) {
                setErrors(prev => ({ ...prev, isolationPrecautionsTimestamp: true }));
                return;
            }
        }


        try {
            // Save to localStorage only if there's actual data
            if (mobilityData && Object.keys(mobilityData).length > 0) {
                localStorage.setItem(`patient-mobility-${id}`, JSON.stringify(mobilityData));
                setInitialMobilityData(mobilityData);
            }

            if (safetyData && Object.keys(safetyData).length > 0) {
                localStorage.setItem(`patient-safety-${id}`, JSON.stringify(safetyData));
                setInitialSafetyData(safetyData);
            }

            if (profileData) {
                localStorage.setItem(`patient-profile-${id}`, JSON.stringify(profileData));
                setInitialProfileData(profileData);
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


    const yesOrNoQuestions = [
        { id: 'hipProtectors', text: 'Hip Protectors' },
        { id: 'sideRails', text: 'Side Rails ' },
        { id: 'crashMats', text: 'Crash Mats' },
        { id: 'bedAlarm', text: 'Bed Alarm ' },
        // { id: 'question5', text: 'Chair Alarm' },
    ];

    const transferOptions = [
        { value: 'I', label: 'Independent (I)' },
        { value: 'Ax1', label: 'Assist x 1 (Ax1)' },
        { value: 'Ax2', label: 'Assist x 2 (Ax2)' },
        { value: 'ML', label: 'Mechanical Lift (ML)' }
    ]

    const aidsOptions = ['Walker', 'Cane', 'Wheelchair'];
    const fallRiskScaleOptions = ['Low', 'High'];

    const isDirty = () => {
        return (
            JSON.stringify(mobilityData) !== JSON.stringify(initialMobilityData) ||
            JSON.stringify(safetyData) !== JSON.stringify(initialSafetyData) ||
            JSON.stringify(profileData) !== JSON.stringify(initialProfileData)
        );
    };


    return (
        <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
            {/* Sidebar */}
            <AssessmentsCard />
            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons on the Same Line */}
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Mobility / Safety</text>
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
                {/* Transfer */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Transfer</Form.Label>
                                <div className="d-flex align-items-center">
                                    {transferOptions.map((option) => (
                                        <Form.Check
                                            key={option.value}
                                            inline
                                            name="transfer"
                                            type="radio"
                                            label={option.label}
                                            checked={mobilityData.transfer === option.value}
                                            onChange={() => !readOnly && handleMobilityAnswerChange('transfer', option.value)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Aids</Form.Label>
                                <div className="d-flex align-items-center">
                                    {aidsOptions.map(aid => (
                                        <Form.Check
                                            key={aid}
                                            inline
                                            name="aids"
                                            type="radio"
                                            label={aid}
                                            checked={mobilityData.aids === aid}
                                            onChange={() => !readOnly && handleMobilityAnswerChange('aids', aid)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Yes/No Questions */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <div className="mb-2 d-flex justify-content-end">
                                <strong className="me-4">Yes</strong>
                                <strong>No</strong>
                            </div>
                            {yesOrNoQuestions.map((question, index) => (
                                <Form.Group key={index} className="mb-3 d-flex align-items-center">
                                    <Form.Label className="me-3">{question.text}</Form.Label>
                                    <div className="ms-auto d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-yes`}
                                            checked={safetyData[question.id] === 'yes'}
                                            onChange={() => !readOnly && handleSafetyAnswerChange(question.id, 'yes')}
                                            disabled={readOnly}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}
                                            checked={safetyData[question.id] === 'no'}
                                            onChange={() => !readOnly && handleSafetyAnswerChange(question.id, 'no')}
                                            disabled={readOnly}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Fall Risk Scale */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Fall Risk Scale</Form.Label>
                                <div className="d-flex align-items-center">
                                    {fallRiskScaleOptions.map(riskLevel => (
                                        <Form.Check
                                            key={riskLevel}
                                            inline
                                            name="fallrisk"
                                            type="radio"
                                            label={riskLevel}
                                            checked={safetyData.fallRiskScale === riskLevel}
                                            onChange={() => !readOnly && handleSafetyAnswerChange('fallRiskScale', riskLevel)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>


                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Isolation Precautions</Form.Label>
                                <div className="d-flex align-items-center mb-2">
                                    {['Yes', 'No'].map((opt) => (
                                        <Form.Check
                                            inline
                                            key={opt}
                                            name="isolationPrecautions"
                                            type="radio"
                                            label={opt}
                                            id={`isolationPrecautions-${opt.toLowerCase()}`}
                                            checked={profileData.isolationPrecautions === opt}
                                            onChange={() => !readOnly && handleIsolationPrecautionsAnswerChange('isolationPrecautions', opt)}
                                            disabled={readOnly}
                                        />
                                    ))}
                                </div>
                                {profileData.isolationPrecautions === 'Yes' && (
                                    <div className="mt-3">
                                        <Form.Label className="fs-6 fw-semibold">Precaution details</Form.Label>
                                        <div className='d-flex'>
                                            <div style={{ maxWidth: '200px' }} className='me-3'>
                                                <Form.Select
                                                    value={profileData.isolationPrecautionDetails || ''}
                                                    onChange={(e) => {
                                                        handleIsolationPrecautionsAnswerChange(
                                                            'isolationPrecautionDetails',
                                                            e.target.value
                                                        );
                                                        setErrors(prev => ({ ...prev, isolationPrecautionDetails: false }));
                                                    }}
                                                    isInvalid={errors.isolationPrecautionsDetails}
                                                >
                                                    <option value=""></option>
                                                    <option value="Contact">Contact</option>
                                                    <option value="Droplet">Droplet</option>
                                                    <option value="Airborne">Airborne</option>
                                                </Form.Select>
                                                {errors.isolationPrecautionDetails && (
                                                    <div className="text-danger small mt-1">Please select precaution details.</div>
                                                )}
                                            </div>
                                            <div>
                                                <Form.Control
                                                    style={{ maxWidth: "200px" }}
                                                    type="date"
                                                    value={profileData.isolationPrecautionsTimestamp || ''}
                                                    onChange={(e) => {
                                                        handleIsolationPrecautionsAnswerChange('isolationPrecautionsTimestamp', e.target.value);
                                                        setErrors(prev => ({ ...prev, isolationPrecautionsTimestamp: false }));
                                                    }}
                                                    isInvalid={errors.isolationPrecautionsTimestamp && !profileData.isolationPrecautionsTimestamp}
                                                />
                                                {errors.isolationPrecautionsTimestamp && !profileData.isolationPrecautionsTimestamp && (
                                                    <div className="text-danger small mt-1">Please select a date.</div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                )}
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

export default PatientMobilityAndSafety;