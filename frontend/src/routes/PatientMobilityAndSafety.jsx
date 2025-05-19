import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import AssessmentSummaryButton from '../components/common/AssessmentSummaryButton';
import '../css/assessment_summary.css';
import { set } from 'react-hook-form';
import '../css/assessment_styles.css';
import { useDefaultDate } from '../utils/useDefaultDate';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';

const PatientMobilityAndSafety = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialMobilityData, setInitialMobilityData] = useState({});
    const [mobilityData, setMobilityData] = useState({});
    const [initialSafetyData, setInitialSafetyData] = useState({});
    const [safetyData, setSafetyData] = useState({});
    const [initialProfileData, setInitialProfileData] = useState({ isolationPrecautions: "No" });
    const [profileData, setProfileData] = useState({ isolationPrecautions: "No" });
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

    //checks if there are any changes
    const isDirty = () => {
        return (
            JSON.stringify(removeEmptyValues(mobilityData)) !== JSON.stringify(removeEmptyValues(initialMobilityData)) ||
            JSON.stringify(removeEmptyValues(safetyData)) !== JSON.stringify(removeEmptyValues(initialSafetyData)) ||
            JSON.stringify(removeEmptyValues(profileData)) !== JSON.stringify(removeEmptyValues(initialProfileData))
        );
    };

    //load data from localstorage when component mounts
    useEffect(() => {
        const savedMobilityData = localStorage.getItem(`patient-mobility-${id}`);
        if (savedMobilityData) {
            const parsedMobilityData = JSON.parse(savedMobilityData)
            setMobilityData(parsedMobilityData);
            setInitialMobilityData(parsedMobilityData);
        }

        const savedSafetyData = localStorage.getItem(`patient-safety-${id}`);
        if (savedSafetyData) {
            const parsedSafetyData = JSON.parse(savedSafetyData)
            setSafetyData(parsedSafetyData);
            setInitialSafetyData(parsedSafetyData);
        }

        const savedProfileData = localStorage.getItem(`patient-profile-${id}`);
        if (savedProfileData) {
            const parsedProfileData = JSON.parse(savedProfileData);
            setProfileData(parsedProfileData);
            setInitialProfileData(parsedProfileData);
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
        if (question == "isolationPrecautions" && answer == 'Yes') {
            setProfileData(prevAnswers => ({
                ...prevAnswers,
                isolationPrecautionsTimestamp: currentDate,
                [question]: answer
            }));
            return;
        }

        if (question == 'isolationPrecautions' && answer == "No") {
            const profileDataCopy = { ...profileData }
            if (profileDataCopy.isolationPrecautionDetails) delete profileDataCopy.isolationPrecautionDetails
            if (profileDataCopy.isolationPrecautionsTimestamp) delete profileDataCopy.isolationPrecautionsTimestamp
            profileDataCopy[question] = answer;
            setErrors(prev => ({ ...prev, isolationPrecautionsTimestamp: false, isolationPrecautionDetails: false }));
            setProfileData(profileDataCopy);
            return;
        }

        setProfileData(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Save function for the Save button
    const handleSave = () => {
        try {
            if (profileData.isolationPrecautions === 'Yes') {
                if (!profileData.isolationPrecautionDetails) {
                    setErrors(prev => ({ ...prev, isolationPrecautionDetails: true }));
                    setSnackbar({
                        open: true,
                        message: 'Please provide isolation precautions details.',
                        severity: 'error'
                    });
                    return;
                }
                if (!profileData.isolationPrecautionsTimestamp) {
                    setErrors(prev => ({ ...prev, isolationPrecautionsTimestamp: true }));
                    setSnackbar({
                        open: true,
                        message: 'Please provide an isolation precautions date.',
                        severity: 'error'
                    });
                    return;
                }
            }

            // Save to localStorage only if there's actual data
            if (mobilityData) {
                const filteredMobilityData = removeEmptyValues(mobilityData)
                if (Object.keys(filteredMobilityData).length > 0) {
                    localStorage.setItem(`patient-mobility-${id}`, JSON.stringify(filteredMobilityData));
                } else {
                    localStorage.removeItem(`patient-mobility-${id}`)
                }
                setInitialMobilityData(mobilityData);
            }

            if (safetyData) {
                const filteredSafetyData = removeEmptyValues(safetyData)
                if (Object.keys(filteredSafetyData).length > 0) {
                    localStorage.setItem(`patient-safety-${id}`, JSON.stringify(filteredSafetyData));
                } else {
                    localStorage.removeItem(`patient-safety-${id}`)
                }
                setInitialSafetyData(safetyData);
            }

            if (profileData) {
                const filteredProfileData = removeEmptyValues(profileData)
                if (Object.keys(filteredProfileData).length > 0) {
                    localStorage.setItem(`patient-profile-${id}`, JSON.stringify(filteredProfileData));
                } else {
                    localStorage.removeItem(`patient-profile-${id}`)
                }
                setInitialProfileData(profileData);
            }
            setSnackbar({
                open: true,
                message: 'Patient record saved successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    const yesOrNoQuestions = [
        { id: 'hipProtectors', text: 'Hip Protectors' },
        { id: 'sideRails', text: 'Side Rails ' },
        { id: 'crashMats', text: 'Crash Mats' },
        { id: 'bedAlarm', text: 'Bed Alarm ' },
    ];

    const transferOptions = [
        { value: 'I', label: 'Independent (I)' },
        { value: 'Ax1', label: 'Assist x 1 (Ax1)' },
        { value: 'Ax2', label: 'Assist x 2 (Ax2)' },
        { value: 'ML', label: 'Mechanical Lift (ML)' }
    ]

    const aidsOptions = ['Walker', 'Cane', 'Wheelchair'];
    const fallRiskScaleOptions = ['Low', 'High'];

    useNavigationBlocker(isDirty());

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
                        <Button
                            variant="primary"
                            onClick={() => navigate(`patients/${id}`)}
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
                {/* Transfer */}
                <Card className="mt-4 gradient-background">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Transfer:</Form.Label>
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
                                <Form.Label>Aids:</Form.Label>
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
                                <Form.Label>Fall Risk Scale:</Form.Label>
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
                                <Form.Label>Isolation Precautions:</Form.Label>
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
                                        <div className='d-flex align-items-start'>
                                            <div style={{ maxWidth: '200px' }} className='me-5'>
                                                <Form.Label className="fs-6 fw-semibold">Precaution details:</Form.Label>
                                                <Form.Select
                                                    style={{ border: errors.isolationPrecautionDetails ? "4px solid #ffc107" : "none" }}
                                                    value={profileData.isolationPrecautionDetails || ''}
                                                    onChange={(e) => {
                                                        handleIsolationPrecautionsAnswerChange(
                                                            'isolationPrecautionDetails',
                                                            e.target.value
                                                        );
                                                        setErrors(prev => ({ ...prev, isolationPrecautionDetails: false }));
                                                    }}
                                                    isInvalid={errors.isolationPrecautionDetails}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Contact">Contact</option>
                                                    <option value="Droplet">Droplet</option>
                                                    <option value="Airborne">Airborne</option>
                                                </Form.Select>
                                                {errors.isolationPrecautionDetails && (
                                                    <div className="text-warning small mt-1">Please select precaution details.</div>
                                                )}
                                            </div>
                                            <div style={{ maxWidth: '200px' }}>
                                                <Form.Label className="fs-6 fw-semibold">Date:</Form.Label>
                                                <Form.Control
                                                    style={{ border: errors.isolationPrecautionsTimestamp ? "4px solid #ffc107" : "none" }}
                                                    type="date"
                                                    value={profileData.isolationPrecautionsTimestamp}
                                                    onChange={(e) => {
                                                        handleIsolationPrecautionsAnswerChange('isolationPrecautionsTimestamp', e.target.value);
                                                        setErrors(prev => ({ ...prev, isolationPrecautionsTimestamp: false }));
                                                    }}
                                                    isInvalid={errors.isolationPrecautionsTimestamp && !profileData.isolationPrecautionsTimestamp}
                                                />
                                                {errors.isolationPrecautionsTimestamp && (
                                                    <div className="text-warning small mt-1">Please select a date.</div>
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
