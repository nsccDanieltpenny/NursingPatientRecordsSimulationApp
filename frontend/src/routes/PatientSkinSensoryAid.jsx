import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentSummaryButton from '../components/common/AssessmentSummaryButton';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';



const PatientSkinSensoryAid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [initialAnswers, setInitialAnswers] = useState({});
  const readOnly = useReadOnlyMode();


  const APIHOST = import.meta.env.VITE_API_URL;

  //notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Compare JSON to detect changes
  const isDirty = () => {
    return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
  };


  // Load saved or fetched data, and remember initial state
  useEffect(() => {
    const saved = localStorage.getItem(`patient-skinsensoryaid-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      setInitialAnswers(parsed);
    }
    // else {
    //   // fetchPatientData();
    // }
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

  // const fetchPatientData = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${APIHOST}/api/patients/nurse/patient/${id}/skinandsensoryaid`
  //     );
  //     setAnswers(data);
  //     setInitialAnswers(data);
  //   } catch (err) {
  //     console.error('Error fetching patient:', err);
  //   }
  // };

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  // Only saves when something changed
  const handleSave = () => {
  try {
    const updatedAnswers = {
      ...answers,
      timestamp: new Date().toISOString(),
    };

    const filteredSkinAndSensoryData = removeEmptyValues(updatedAnswers);

    if (Object.keys(filteredSkinAndSensoryData).length > 0) {
      localStorage.setItem(
        `patient-skinsensoryaid-${id}`,
        JSON.stringify(filteredSkinAndSensoryData)
      );
    } else {
      localStorage.removeItem(`patient-skinsensoryaid-${id}`);
    }

    setAnswers(updatedAnswers);
    setInitialAnswers(updatedAnswers);

      setSnackbar({
        open: true,
        message: 'Patient record saved successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error saving data:', err);
      setSnackbar({
        open: true,
        message: 'Error: Failed to save patient data.',
        severity: 'error'
      });
    }
  };

  const questions = [
    { id: 'glasses', text: 'Glasses' },
    { id: 'hearing', text: 'Hearing' },
  ];

  useNavigationBlocker(isDirty());

  return (
    <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
      <AssessmentsCard />
      <div className="ms-4 flex-fill">
        <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
          <text>Sensory Aids / Prothesis / Skin Integrity</text>
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

        {/* Skin Integrity */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Skin Integrity Assessment</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('skinIntegrity', '');
                handleAnswerChange('skinIntegrityFrequency', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-group">
              <label className="question-label">Skin Integrity:</label>
              <div className="radio-group">
                <div className="radio-option">
                  <Form.Check
                    name="skinIntegrity"
                    type="radio"
                    id="skinIntegrity-yes"
                    checked={answers.skinIntegrity === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrity', 'yes')}
                    disabled={readOnly}
                  />
                  <label htmlFor="skinIntegrity-yes" className="radio-label">Yes</label>
                </div>
                <div className="radio-option">
                  <Form.Check
                    name="skinIntegrity"
                    type="radio"
                    id="skinIntegrity-no"
                    checked={answers.skinIntegrity === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrity', 'no')}
                    disabled={readOnly}
                  />
                  <label htmlFor="skinIntegrity-no" className="radio-label">No</label>
                </div>
              </div>
            </div>

            {answers.skinIntegrity === 'yes' && (
              <div className="question-group">
                <label className="question-label">Frequency:</label>
                <div className="radio-group">
                  {['Q2h', 'Q4h', 'QShift'].map(freq => (
                    <div key={freq} className="radio-option">
                      <Form.Check
                        name="skinIntegrityFrequency"
                        type="radio"
                        id={`skinFreq-${freq}`}
                        checked={answers.skinIntegrityFrequency === freq}
                        onChange={() => !readOnly && handleAnswerChange('skinIntegrityFrequency', freq)}
                        disabled={readOnly}
                      />
                      <label htmlFor={`skinFreq-${freq}`} className="radio-label">{freq}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Sensory Aids */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Sensory Aids</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('glasses', '');
                handleAnswerChange('hearing', '');
                handleAnswerChange('hearingAidSide', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-group">
              <label className="question-label">Glasses:</label>
              <div className="radio-group">
                <div className="radio-option">
                  <Form.Check
                    name="glasses"
                    type="radio"
                    id="glasses-yes"
                    checked={answers.glasses === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('glasses', 'yes')}
                    disabled={readOnly}
                  />
                  <label htmlFor="glasses-yes" className="radio-label">Yes</label>
                </div>
                <div className="radio-option">
                  <Form.Check
                    name="glasses"
                    type="radio"
                    id="glasses-no"
                    checked={answers.glasses === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('glasses', 'no')}
                    disabled={readOnly}
                  />
                  <label htmlFor="glasses-no" className="radio-label">No</label>
                </div>
              </div>
            </div>

            <div className="question-group">
              <label className="question-label">Hearing Aids:</label>
              <div className="radio-group">
                <div className="radio-option">
                  <Form.Check
                    name="hearing"
                    type="radio"
                    id="hearing-yes"
                    checked={answers.hearing === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('hearing', 'yes')}
                    disabled={readOnly}
                  />
                  <label htmlFor="hearing-yes" className="radio-label">Yes</label>
                </div>
                <div className="radio-option">
                  <Form.Check
                    name="hearing"
                    type="radio"
                    id="hearing-no"
                    checked={answers.hearing === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('hearing', 'no')}
                    disabled={readOnly}
                  />
                  <label htmlFor="hearing-no" className="radio-label">No</label>
                </div>
              </div>
            </div>

            {answers.hearing === 'yes' && (
              <div className="question-group">
                <label className="question-label">Hearing Aid Side:</label>
                <Form.Select
                  value={answers.hearingAidSide || ''}
                  onChange={(e) => !readOnly && handleAnswerChange('hearingAidSide', e.target.value)}
                  className="dropdown"
                  disabled={readOnly}
                >
                  <option value="">Select Side</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </Form.Select>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Pressure Ulcer Risk */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Pressure Ulcer Risk</h4>
            <button
              className="clear-section-btn"
              onClick={() => handleAnswerChange('pressureUlcerRisk', '')}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-group">
              <label className="question-label">Risk Level:</label>
              <div className="radio-group">
                {['Low', 'Medium', 'High', 'Very High'].map(label => (
                  <div key={label} className="radio-option">
                    <Form.Check
                      name="pressureUlcerRisk"
                      type="radio"
                      id={`pressureRisk-${label}`}
                      checked={answers.pressureUlcerRisk === label}
                      onChange={() => !readOnly && handleAnswerChange('pressureUlcerRisk', label)}
                      disabled={readOnly}
                    />
                    <label htmlFor={`pressureRisk-${label}`} className="radio-label">{label}</label>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Turning Schedule */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Turning Schedule</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('skinIntegrityTurningSchedule', '');
                handleAnswerChange('turningScheduleFrequency', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-group">
              <label className="question-label">Turning Schedule:</label>
              <div className="radio-group">
                <div className="radio-option">
                  <Form.Check
                    name="skinIntegrityTurningSchedule"
                    type="radio"
                    id="turningSchedule-yes"
                    checked={answers.skinIntegrityTurningSchedule === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrityTurningSchedule', 'yes')}
                    disabled={readOnly}
                  />
                  <label htmlFor="turningSchedule-yes" className="radio-label">Yes</label>
                </div>
                <div className="radio-option">
                  <Form.Check
                    name="skinIntegrityTurningSchedule"
                    type="radio"
                    id="turningSchedule-no"
                    checked={answers.skinIntegrityTurningSchedule === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrityTurningSchedule', 'no')}
                    disabled={readOnly}
                  />
                  <label htmlFor="turningSchedule-no" className="radio-label">No</label>
                </div>
              </div>
            </div>

            {answers.skinIntegrityTurningSchedule === 'yes' && (
              <div className="question-group">
                <label className="question-label">Frequency:</label>
                <div className="radio-group">
                  {['Q2h', 'Q4h', 'QShift'].map(freq => (
                    <div key={freq} className="radio-option">
                      <Form.Check
                        name="turningScheduleFrequency"
                        type="radio"
                        id={`turningFreq-${freq}`}
                        checked={answers.turningScheduleFrequency === freq}
                        onChange={() => !readOnly && handleAnswerChange('turningScheduleFrequency', freq)}
                        disabled={readOnly}
                      />
                      <label htmlFor={`turningFreq-${freq}`} className="radio-label">{freq}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Dressings */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Dressings</h4>
            <button
              className="clear-section-btn"
              onClick={() => handleAnswerChange('skinIntegrityDressings', '')}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-group">
              <label className="question-label">Skin Integrity - Dressings:</label>
              <Form.Control
                type="text"
                value={answers.skinIntegrityDressings || ''}
                onChange={e => !readOnly && handleAnswerChange('skinIntegrityDressings', e.target.value)}
                disabled={readOnly}
                className="text-input"
              />
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

export default PatientSkinSensoryAid;
