import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';


const PatientNEWS2  = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const readOnly = useReadOnlyMode();

    // Score states for each section (local only, not sent to backend)
    const [respirationScore, setRespirationScore] = useState(0);
    const [spO2Scale1Score, setSpO2Scale1Score] = useState(0);
    const [spO2Scale2Score, setSpO2Scale2Score] = useState(0);
    const [oxygenScore, setOxygenScore] = useState(0);
    const [bloodPressureScore, setBloodPressureScore] = useState(0);
    const [pulseScore, setPulseScore] = useState(0);
    const [consciousnessScore, setConsciousnessScore] = useState(0);
    const [temperatureScore, setTemperatureScore] = useState(0);

    //notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Function to get current date-time
    const getCurrentDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
        return localISOTime;
    };

    // Check if there are any changes
    const isDirty = () => {
        return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
    };

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem(`patient-news2-${id}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed);
            setInitialAnswers(parsed);
        } else {
            const defaultState = {
                timestamp: getCurrentDateTime()
            };
            setAnswers(defaultState);
            setInitialAnswers(defaultState);
            // fetchPatientData();
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

    // Handle field changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    // Calculate score for each section
    const calculateRespirationScore = (rate) => {
        if (!rate) return 0;
        if (rate <= 8) return 3;
        if (rate >= 9 && rate <= 11) return 1;
        if (rate >= 12 && rate <= 20) return 0;
        if (rate >= 21 && rate <= 24) return 2;
        if (rate >= 25) return 3;
        return 0;
    };

    const calculateSpO2Scale1Score = (scale1) => {
        if (!scale1) return 0;
        if (scale1 <= 91) return 3;
        if (scale1 == 92 || scale1 == 93) return 2;
        if (scale1 == 94 || scale1 == 95) return 1;
        if (scale1 >= 96) return 0;
        return 0;
    };

    const calculateSpO2Scale2Score = (scale2) => {
        if (!scale2) return 0;
        if (scale2 <= 83) return 3;
        if (scale2 == 84 || scale2 == 85) return 2;
        if (scale2 == 86 || scale2 == 87) return 1;
        if ((scale2 >= 88 && scale2 <= 92) || (scale2 >= 93 && answers.onOxygen === "False")) return 0;
        if (answers.onOxygen === "True" && (scale2 == 93 || scale2 == 94)) return 1;
        if (answers.onOxygen === "True" && (scale2 == 95 || scale2 == 96)) return 2;
        if (answers.onOxygen === "True" && scale2 >= 97) return 3;
        return 0;
    };

    const calculateOxygenScore = (onOxygen) => {
        if (onOxygen === 'True') return 2;
        
        return 0;
    };

    const calculateBloodPressureScore = (systolic) => {
        if (!systolic) return 0;
        if (systolic <= 90) return 3;
        if (systolic >= 91 && systolic <= 100) return 2;
        if (systolic >= 101 && systolic <= 110) return 1;
        if (systolic >= 111 && systolic <= 219) return 0;
        if (systolic >= 220) return 3;
        return 0;
    };

    const calculatePulseScore = (bpm) => {
        if (!bpm) return 0;
        if (bpm <= 40) return 3;
        if (bpm >= 41 && bpm <= 50) return 1;
        if (bpm >= 51 && bpm <= 90) return 0;
        if (bpm >= 91 && bpm <= 110) return 1;
        if (bpm >= 111 && bpm <= 130) return 2;
        if (bpm >= 131) return 3;
        return 0;
    };

    const calculateConsciousnessScore = (consciousness) => {
        if (consciousness !== 'Alert') return 3;
        return 0;
    };

    const calculateTemperatureScore = (temp) => {
        if (!temp) return 0;
        if (temp <= 35.0) return 3;
        if (temp >= 35.1 && temp <= 36.0) return 1;
        if (temp >= 36.1 && temp <= 38.0) return 0;
        if (temp >= 38.1 && temp <= 39.0) return 1;
        if (temp >= 39.1) return 2;
        return 0;
    };

    // Render score box component
    const renderScoreBox = (score) => {
        return (
            <div style={{
                minWidth: '100px',
                padding: '15px',
                backgroundColor: '#2c3e50',
                border: '2px solid #3498db',
                borderRadius: '8px',
                textAlign: 'center',
                marginLeft: '20px'
            }}>
                <div style={{color: '#ecf0f1', fontSize: '14px', marginBottom: '5px'}}>Score</div>
                <div style={{color: '#3498db', fontSize: '24px', fontWeight: 'bold'}}>{score}</div>
            </div>
        );
    };

    // Calculate scores whenever answers change
    useEffect(() => {
        setRespirationScore(calculateRespirationScore(answers.respirationRate));
        setSpO2Scale1Score(calculateSpO2Scale1Score(answers.spO2Scale1));
        setSpO2Scale2Score(calculateSpO2Scale2Score(answers.spO2Scale2));
        setOxygenScore(calculateOxygenScore(answers.onOxygen));
        setBloodPressureScore(calculateBloodPressureScore(answers.bpSystolic));
        setPulseScore(calculatePulseScore(answers.pulseBPM));
        setConsciousnessScore(calculateConsciousnessScore(answers.consciousness));
        setTemperatureScore(calculateTemperatureScore(answers.temperatureC));
    }, [answers.respirationRate, answers.spO2Scale1, answers.spO2Scale2, answers.onOxygen, 
        answers.bpSystolic, answers.pulseBPM, answers.consciousness, answers.temperatureC]);

    // Calculate total score and store in answers for backend
    useEffect(() => {
        const total = respirationScore + spO2Scale1Score + spO2Scale2Score + oxygenScore + 
                     bloodPressureScore + pulseScore + consciousnessScore + temperatureScore;
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            totalScore: total
        }));
    }, [respirationScore, spO2Scale1Score, spO2Scale2Score, oxygenScore, bloodPressureScore, 
        pulseScore, consciousnessScore, temperatureScore]);

    // Save function for the Save button
    const handleSave = () => {
      try {
        const updatedAnswers = {
      ...answers,
      timestamp: new Date().toISOString(),
    };

    const filteredNoteData = removeEmptyValues(updatedAnswers);

    if (Object.keys(filteredNoteData).length > 0) {
      localStorage.setItem(`patient-news2-${id}`, JSON.stringify(filteredNoteData));
    } else {
      localStorage.removeItem(`patient-news2-${id}`);
    }

        setAnswers(updatedAnswers);
        setInitialAnswers(updatedAnswers);
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
            {/* Sidebar */}
            <AssessmentsCard />

            {/* Content */}
            <div className="ms-4 flex-fill">
                {/* Title & Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>NEWS2 Assessment</text>
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

                {/* Respiration */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Respirations</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('respirationRate', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Breaths/min:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.respirationRate || ''}
                                        onChange={(e) =>
                                            handleAnswerChange('respirationRate', e.target.value)
                                        }
                                        className="dropdown"
                                    />
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(respirationScore)}
                    </Card.Body>
                </Card>

                {/* SpO2 */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">SpO2 Scales</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('spO2Scale1', '');
                                handleAnswerChange('spO2Scale2', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">SpO2 Scale 1:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.spO2Scale1 || ''}
                                        onChange={(e) =>
                                            handleAnswerChange('spO2Scale1', e.target.value)
                                        }
                                        className="dropdown"
                                    />

                                    <label style={{marginTop: '8px'}} className="question-label">SpO2 Scale 2:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.spO2Scale2 || ''}
                                        onChange={(e) =>
                                            handleAnswerChange('spO2Scale2', e.target.value)
                                        }
                                        className="dropdown"
                                    />
                                </div>
                            </div>
                        </Form>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            {renderScoreBox(spO2Scale1Score)}
                            {renderScoreBox(spO2Scale2Score)}
                        </div>
                    </Card.Body>
                </Card>

                {/* Air/Oxygen */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Air or Oxygen</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('onOxygen', '');
                                handleAnswerChange('oxygenFlowRate', '');
                                handleAnswerChange('oxygenDevice', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Air or Oxygen:</label>
                                    <Form.Select
                                        value={answers.onOxygen || ''}
                                        onChange={(e) => !readOnly && handleAnswerChange('onOxygen', e.target.value)}
                                        disabled={readOnly}
                                        className="dropdown"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="False">Air</option>
                                        <option value="True">Oxygen</option>
                                    </Form.Select>
                                    {answers.onOxygen === 'True' && (
                                    <>
                                    <label style={{marginTop: '8px'}} className="question-label">Oxygen Flow Rate (L/min):</label>
                                        <Form.Control
                                            type="number"
                                            value={answers.oxygenFlowRate || ''}
                                            onChange={(e) => handleAnswerChange('oxygenFlowRate', e.target.value)}
                                            className="dropdown"
                                            style={{color: '#ffffff', marginTop: '8px'}}
                                        />

                                        <label style={{marginTop: '8px'}} className="question-label">Oxygen Device:</label>

                                        <Form.Control
                                            type="text"
                                            value={answers.oxygenDevice || ''}
                                            onChange={(e) => handleAnswerChange('oxygenDevice', e.target.value)}
                                            className="dropdown"
                                            style={{color: '#ffffff', marginTop: '8px'}}
                                        />
                                    </>
                                    )}
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(oxygenScore)}
                    </Card.Body>
                </Card>

                {/* Blood Pressure */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Blood Pressure</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('bpSystolic', '');
                                handleAnswerChange('bpDiastolic', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Systolic:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.bpSystolic || ''}
                                        onChange={(e) =>
                                            handleAnswerChange('bpSystolic', e.target.value)
                                        }
                                        className="dropdown"
                                    />
                                    
                                    <label style={{marginTop: '8px'}} className="question-label">Diastolic:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.bpDiastolic || ''}
                                        onChange={(e) =>
                                            handleAnswerChange('bpDiastolic', e.target.value)
                                        }
                                        className="dropdown"
                                    />
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(bloodPressureScore)}
                    </Card.Body>
                </Card>

                {/* Pulse */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Pulse</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('pulseBPM', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">BPM:</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.pulseBPM || ''}
                                        onChange={(e) => handleAnswerChange('pulseBPM', e.target.value)}
                                        className="dropdown"
                                    />
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(pulseScore)}
                    </Card.Body>
                </Card>

                {/* Conciousness */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Consciousness</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('consciousness', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Consciousness:</label>
                                    <p style={{color: '#cccccc'}}>For NEW onset of confusion (no score if chronic)</p>
                                    <Form.Select
                                        value={answers.consciousness || ''}
                                        onChange={(e) => !readOnly && handleAnswerChange('consciousness', e.target.value)}
                                        disabled={readOnly}
                                        className="dropdown"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Alert">Alert</option>
                                        <option value="Confusion">Confusion</option>
                                        <option value="Verbal">Verbal</option>
                                        <option value="Pain">Pain</option>
                                        <option value="Unresponsive">Unresponsive</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(consciousnessScore)}
                    </Card.Body>
                </Card>

                {/* Temperature */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Temperature</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('temperatureC', '');
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <Form style={{flex: 1}}>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Temperature (°C):</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.temperatureC || ''}
                                        onChange={(e) => handleAnswerChange('temperatureC', e.target.value)}
                                        disabled={readOnly}
                                        className="dropdown"
                                    />
                                </div>
                            </div>
                        </Form>
                        {renderScoreBox(temperatureScore)}
                    </Card.Body>
                </Card>

                {/* Score/Response */}
                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Score/Response</h4>
                        <button 
                            className="clear-section-btn"
                            onClick={() => {
                                handleAnswerChange('monitoringFrequency', '');
                                handleAnswerChange('escalationOfCare', false);
                            }}
                        >
                            Clear
                        </button>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Form>
                            <div className="question-grid">
                                <div className="question-group">
                                    <label className="question-label">Total Score:</label>
                                    <div style={{
                                        padding: '20px',
                                        backgroundColor: '#2c3e50',
                                        border: '3px solid #3498db',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{color: '#ecf0f1', fontSize: '16px', marginBottom: '8px'}}>TOTAL SCORE</div>
                                        <div style={{color: '#3498db', fontSize: '36px', fontWeight: 'bold'}}>{answers.totalScore || 0}</div>
                                    </div>

                                    <label style={{marginTop: '8px'}} className="question-label">Monitoring Frequency (Hours):</label>
                                    <Form.Control
                                        type="number"
                                        value={answers.monitoringFrequency || ''}
                                        onChange={(e) => handleAnswerChange('monitoringFrequency', e.target.value)}
                                        disabled={readOnly}
                                        className="dropdown"
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Escalation of Care"
                                        checked={answers.escalationOfCare || false}
                                        onChange={(e) => handleAnswerChange('escalationOfCare', e.target.checked)}
                                        disabled={readOnly}
                                        style={{ marginLeft: '15px', marginTop: '12px', color: '#ffffff' }}
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

export default PatientNEWS2;
