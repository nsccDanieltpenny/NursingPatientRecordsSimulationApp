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
import AssessmentsCard from '../components/profile-components/AssessmentsCard';



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
              {isDirty() ? 'Save Changes' : 'No Changes'}
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
            <Form>
              <div className="mb-2 d-flex justify-content-end">
                <strong className="me-2 radio-label">Yes</strong>
                <strong className="me-3 radio-label">No</strong>
              </div>
              <Form.Group className="radio-option">
                <label className="question-label">Skin Integrity:</label>
                <div className="ms-auto d-flex align-items-center">
                  <Form.Check
                    inline
                    name="skinIntegrity"
                    type="radio"
                    id="skinIntegrity-yes"
                    checked={answers.skinIntegrity === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrity', 'yes')}
                    disabled={readOnly}
                  />
                  <Form.Check
                    inline
                    name="skinIntegrity"
                    type="radio"
                    id="skinIntegrity-no"
                    checked={answers.skinIntegrity === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrity', 'no')}
                    disabled={readOnly}
                  />
                </div>
              </Form.Group>

              {answers.skinIntegrity === 'yes' && (
                <div className="question-group">
                  <label className="question-label">Frequency:</label>
                  <div className="radio-group">
                    {['Q2h', 'Q4h', 'QShift'].map(freq => (
                      <div key={freq} className="radio-option">
                        <Form.Check
                          inline
                          name="skinIntegrityFrequency"
                          type="radio"
                          id={`skinIntegrityFrequency-${freq}`}
                          checked={answers.skinIntegrityFrequency === freq}
                          onChange={() => !readOnly && handleAnswerChange('skinIntegrityFrequency', freq)}
                          disabled={readOnly}
                        />
                        <label htmlFor={`skinIntegrityFrequency-${freq}`} className="radio-label">
                          {freq}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form>
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
            <Form>
              <div className="mb-2 d-flex justify-content-end">
                <strong className="me-2 radio-label">Yes</strong>
                <strong className="me-3 radio-label">No</strong>
              </div>

              {/* Glasses */}
              <Form.Group className="radio-option">
                <label className="question-label">Glasses:</label>
                <div className="ms-auto d-flex align-items-center">
                  <Form.Check
                    inline
                    name="glasses"
                    type="radio"
                    id="glasses-yes"
                    checked={answers.glasses === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('glasses', 'yes')}
                    disabled={readOnly}
                  />
                  <Form.Check
                    inline
                    name="glasses"
                    type="radio"
                    id="glasses-no"
                    checked={answers.glasses === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('glasses', 'no')}
                    disabled={readOnly}
                  />
                </div>
              </Form.Group>

              {/* Hearing */}
              <Form.Group className="radio-option">
                <label className="question-label">Hearing Aids:</label>
                <div className="ms-auto d-flex align-items-center">
                  <Form.Check
                    inline
                    name="hearing"
                    type="radio"
                    id="hearing-yes"
                    checked={answers.hearing === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('hearing', 'yes')}
                    disabled={readOnly}
                  />
                  <Form.Check
                    inline
                    name="hearing"
                    type="radio"
                    id="hearing-no"
                    checked={answers.hearing === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('hearing', 'no')}
                    disabled={readOnly}
                  />
                </div>
              </Form.Group>

              {answers.hearing === 'yes' && (
                <div className="question-group">
                  <label className="question-label">Hearing Aid Side:</label>
                  <Form.Select
                    value={answers.hearingAidSide || ''}
                    onChange={(e) => handleAnswerChange('hearingAidSide', e.target.value)}
                    className="dropdown"
                  >
                    <option value="">-- Select --</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="both">Both</option>
                  </Form.Select>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* Pressure Ulcer Risk */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Pressure Ulcer Risk</h4>
            <button 
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('pressureUlcerRisk', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <Form>
              <div className="question-grid">
                <div className="question-group">
                  <label className="question-label">Risk Level:</label>
                  <div className="radio-group">
                    {['Low', 'Medium', 'High', 'Very High'].map(label => (
                      <div key={label} className="radio-option">
                        <Form.Check
                          inline
                          name="pressureUlcerRisk"
                          type="radio"
                          id={`pressureUlcerRisk-${label}`}
                          checked={answers.pressureUlcerRisk === label}
                          onChange={() => !readOnly && handleAnswerChange('pressureUlcerRisk', label)}
                          disabled={readOnly}
                        />
                        <label htmlFor={`pressureUlcerRisk-${label}`} className="radio-label">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Skin Integrity - Turning Schedule */}
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
            <Form>
              <div className="mb-2 d-flex justify-content-end">
                <strong className="me-2 radio-label">Yes</strong>
                <strong className="me-3 radio-label">No</strong>
              </div>
              <Form.Group className="radio-option">
                <label className="question-label">Turning Schedule:</label>
                <div className="ms-auto d-flex align-items-center">
                  <Form.Check
                    inline
                    name="skinIntegrityTurningSchedule"
                    type="radio"
                    id="turningSchedule-yes"
                    checked={answers.skinIntegrityTurningSchedule === 'yes'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrityTurningSchedule', 'yes')}
                    disabled={readOnly}
                  />
                  <Form.Check
                    inline
                    name="skinIntegrityTurningSchedule"
                    type="radio"
                    id="turningSchedule-no"
                    checked={answers.skinIntegrityTurningSchedule === 'no'}
                    onChange={() => !readOnly && handleAnswerChange('skinIntegrityTurningSchedule', 'no')}
                    disabled={readOnly}
                  />
                </div>
              </Form.Group>

              {answers.skinIntegrityTurningSchedule === 'yes' && (
                <div className="question-group">
                  <label className="question-label">Frequency:</label>
                  <div className="radio-group">
                    {['Q2h', 'Q4h', 'QShift'].map(freq => (
                      <div key={freq} className="radio-option">
                        <Form.Check
                          inline
                          name="turningScheduleFrequency"
                          type="radio"
                          id={`turningScheduleFrequency-${freq}`}
                          checked={answers.turningScheduleFrequency === freq}
                          onChange={() => !readOnly && handleAnswerChange('turningScheduleFrequency', freq)}
                          disabled={readOnly}
                        />
                        <label htmlFor={`turningScheduleFrequency-${freq}`} className="radio-label">
                          {freq}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* Skin Integrity - Dressings */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Dressings</h4>
            <button 
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('skinIntegrityDressings', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <Form>
              <div className="question-grid">
                <div className="question-group full-width">
                  <label className="question-label">Dressings:</label>
                  <Form.Control
                    type="text"
                    value={answers.skinIntegrityDressings || ''}
                    onChange={e => !readOnly && handleAnswerChange('skinIntegrityDressings', e.target.value)}
                    disabled={readOnly}
                    className="text-input"
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

export default PatientSkinSensoryAid;
