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
            if (!parsedProfileData.isolationPrecautions) {
                parsedProfileData.isolationPrecautions = "No"
            }
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
                    const updatedAnswers = {
                        ...filteredMobilityData,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem(`patient-mobility-${id}`, JSON.stringify(updatedAnswers));
                } else {
                    localStorage.removeItem(`patient-mobility-${id}`)
                }
                setMobilityData(filteredMobilityData)
                setInitialMobilityData(filteredMobilityData)
            }

            if (safetyData) {
                const filteredSafetyData = removeEmptyValues(safetyData)
                if (Object.keys(filteredSafetyData).length > 0) {
                    const updatedAnswers = {
                        ...filteredSafetyData,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem(`patient-safety-${id}`, JSON.stringify(updatedAnswers));
                } else {
                    localStorage.removeItem(`patient-safety-${id}`)
                }
                setSafetyData(filteredSafetyData)
                setInitialSafetyData(filteredSafetyData);
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
                {/* Transfer */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Assistance Requirements</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleMobilityAnswerChange('transfer', '');
                            }}
                        >   
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div classname="question-grid">
                            <div className="question-group">
                                <label className="question-label">Transfer:</label>
                                <div className="radio-group">
                                    {transferOptions.map((option) => (
                                        <div key={option.value} className="radio-option">
                                            <Form.Check
                                                
                                                inline
                                                name="transfer"
                                                type="radio"
                                                
                                                checked={mobilityData.transfer === option.value}
                                                onChange={() => !readOnly && handleMobilityAnswerChange('transfer', option.value)}
                                                disabled={readOnly}
                                            />
                                            <label htmlFor={`transfer-${option}`} className="radio-label">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Mobility Aids</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleMobilityAnswerChange('aids', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <Form.Group className="question-group">
                                <label className="question-label">Requirements:</label>
                                <div className="radio-group">
                                    <div className="radio-label">
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
                                </div>
                            </Form.Group>
                        </div>
                    </Card.Body>
                </Card>

                {/* Yes/No Questions */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Equipment Requirements</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                yesOrNoQuestions.forEach(question => {
                                    handleSafetyAnswerChange(question.id, '');
                                });
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <div className="mb-2 d-flex justify-content-end">
                                <strong className="me-2 radio-label">Yes</strong>
                                <strong className="me-3 radio-label">No</strong>
                            </div>
                            {yesOrNoQuestions.map((question, index) => (
                                <Form.Group key={index} className="radio-option">
                                    <Form.Label className="question-label">{question.text}</Form.Label>
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
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                            <h4 className="assessment-card-title">Risk of Injury</h4>
                            <button
                                className="clear-section-btn"
                                onClick={() => {
                                    handleSafetyAnswerChange('fallRiskScale', '');
                                }}
                            >
                                Clear
                            </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <Form.Group className="question-group">
                                <label className="question-label">Fall Risk Scale:</label>
                                <div className="radio-group">
                                    <div className="radio-label"> 
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
                                </div>
                            </Form.Group>
                        </div>
                    </Card.Body>
                </Card>


                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Additional Care</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleIsolationPrecautionsAnswerChange('isolationPrecautions', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-grid">
                            <div className="question-group">
                                <label className="question-label">Isolation Precautions:</label>
                                <div className="radio-group">
                                    <div className="radio-label">    
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
                                </div>
                                {profileData.isolationPrecautions === 'Yes' && (
                                    <div className="question-group">
                                        <div className='d-flex align-items-start'>
                                            <div style={{ maxWidth: '200px' }} className='me-5'>
                                                <label className="question-label">Precaution details:</label>
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
                                                    className="dropdown"
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
                                                <Form.Label className="question-label">Date:</Form.Label>
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
                            </div>
                        </div>
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
