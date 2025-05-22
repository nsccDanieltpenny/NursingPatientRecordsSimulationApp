import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import { Snackbar, Alert } from '@mui/material';
import '../css/assessment_styles.css';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';
import removeEmptyValues from '../utils/removeEmptyValues';


const PatientADL = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [initialAnswers, setInitialAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const APIHOST = import.meta.env.VITE_API_URL;
  const readOnly = useReadOnlyMode();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  //checks if there are any changes
  const isDirty = () => {
    return JSON.stringify(removeEmptyValues(answers)) !== JSON.stringify(removeEmptyValues(initialAnswers));
  };

  useEffect(() => {
    const savedData = localStorage.getItem(`patient-adl-${id}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAnswers(parsed);
      setInitialAnswers(parsed);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const defaultState = { bathDate: today };
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

  // const fetchPatientData = async () => {
  //   try {
  //     const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/adl`);
  //     setAnswers(prev => ({ ...prev, ...response.data }));
  //     setInitialAnswers(prev => ({ ...prev, ...response.data }));
  //   } catch (error) {
  //     console.error('Error fetching patient:', error);

  //   }
  // };

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));

    if (question === 'tubShowerOther' && answer) {
      setErrors(prev => ({ ...prev, tubShowerOther: false }));
    }
  };

  const handleSave = () => {
    /*
  if (!answers.tubShowerOther) {
    setErrors(prev => ({ ...prev, tubShowerOther: true }));
    setSnackbar({
      open: true,
      message: 'Please select a bathing method before saving.',
      severity: 'error'
    });
    return;
  }
  */

    try {
    const updatedAnswers = {
    ...answers,
    timestamp: new Date().toISOString(),
  };
    
    const filteredAdlData = removeEmptyValues(updatedAnswers);
      
    if (Object.keys(filteredAdlData).length > 0) {
    localStorage.setItem(`patient-adl-${id}`, JSON.stringify(filteredAdlData));
    } else {
    localStorage.removeItem(`patient-adl-${id}`);
    }
    setAnswers(updatedAnswers);
    setInitialAnswers(updatedAnswers);

      setSnackbar({
        open: true,
        message: 'Patient record saved successfully!',
        severity: 'success'
      });

      // localStorage.setItem(`patient-adl-${id}`, JSON.stringify(answers));
      // setInitialAnswers(answers); // reset dirty check
      // setSnackbar({
      //   open: true,
      //   message: 'Patient record saved successfully!',
      //   severity: 'success'
      // });

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const questions = [
    { id: 'footCare', text: 'Foot Care' },
    { id: 'hairCare', text: 'Hair Care' },
  ];

  useNavigationBlocker(isDirty());

  return (
    <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
      <AssessmentsCard />
      <div className="ms-4 flex-fill assessment-page">
        <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
          <text>ADLs</text>
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

        {/* Bath Date & Tub/Shower/Other */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Hygiene Assessment</h4>
            <button 
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('tubShowerOther', '');
                handleAnswerChange('bathDate', '');
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-grid">
              {/* Assessment content :) i don't know why anyone uses bootstrap lol*/}
              <div className="question-group">
                <label className="question-label">Hygiene Options:</label>
                <div className="radio-group">
                  {['Tub', 'Shower', 'Bed Bath'].map((option) => (
                    <div key={option} className="radio-option">
                      <Form.Check
                        key={option}
                        inline
                        label={option}
                        name="tubShowerOther"
                        type="radio"
                        id={`tubShowerOther-${option}`}
                        checked={answers.tubShowerOther === option}
                        onChange={() => !readOnly && handleAnswerChange('tubShowerOther', option)}
                        disabled={readOnly}
                      />
                    ))}
                  </div>

                </Form.Group>
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label>
                    Bath Date:
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={answers.bathDate || ''}
                    onChange={(e) => !readOnly && handleAnswerChange('bathDate', e.target.value)}
                    disabled={!answers.tubShowerOther || readOnly}
                    className={!answers.tubShowerOther ? 'disabled-date-input' : ''}
                  />
                </Form.Group>
              </div>
            </Form>
          </Card.Body>
        </Card>
        {/* Type of Care */}
        <Card className="assessment-card">
          
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Type of Care:</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('typeOfCare', '');
              }}
              >
              
              Clear
            </button>
          </Card.Header>

          <Card.Body className="assessment-card-body">
            <div className="question-grid">
              <div className="question-group">
                <label className="question-label">Type of Care</label>
                <div className="radio-group">

                  {['Full', 'Assist', 'Independent'].map((option) => (
                    <div key={option} className="radio-option">
                      <Form.Check
                        name="typeOfCare"
                        type="radio"
                        id={`typeOfCare-${option}`}
                        checked={answers.typeOfCare === option}
                        onChange={() => !readOnly && handleAnswerChange('typeOfCare', option)}
                        disabled={readOnly}
                      />
                      <label htmlFor={`typeOfCare-${option}`} className="radio-label">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* Turning */}
        <Card className="assessment-card">

          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Schedule</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                handleAnswerChange('turning', '');
              }}
              >
                clear
              </button>
          </Card.Header>
          
          <Card.Body className="assessment-card-body">
            <div className="question-grid">
              <div className="question-group">
                <label className="question-label">Turning Required:</label>
                <div className="radio-group">
                  {['Yes', 'No'].map((option) => (
                    <div key={option} className="radio-option mb-2">
                      <Form.Check
                        name="turning"
                        type="radio"
                        id={`turning-${option.toLowerCase()}`}
                        checked={answers.turning === option}
                        onChange={() => !readOnly && handleAnswerChange('turning', option)}
                        disabled={readOnly}
                      />
                      <label htmlFor={`typeOfCare-${option}`} className="radio-label">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {answers.turning === 'Yes' && (
                  <div className="d-flex">
                    {['Q2h', 'Q4h', 'QShift'].map((freq) => (
                      <Form.Check
                        key={freq}
                        inline
                        name="turningFrequency"
                        type="radio"
                        label={freq}
                        id={`turningFrequency-${freq}`}
                        checked={answers.turningFrequency === freq}
                        onChange={() => !readOnly && handleAnswerChange('turningFrequency', freq)}
                        disabled={readOnly}
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* Teeth Section */}
        <Card className="assessment-card">

          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Dental Assessment</h4>
            <button 
            className="clear-section-btn"
            onClick={() => {
              handleAnswerChange('teeth', '');
            }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <div className="question-grid">
              <Form.Group className="question-group">
                <label className="question-label">Teeth:</label>
                <div className="radio-group">
                  <div className="radio-label">
                    {['None', 'Natural', 'Dentures',].map((option) => (
                      <div key={option} className="radio-option">
                        <Form.Check
                          inline
                          name="teeth"
                          type="radio"
                          id={`teeth-${option}`}
                          checked={answers.teeth === option}
                          onChange={() => !readOnly && handleAnswerChange('teeth', option)}
                          disabled={readOnly}
                        />
                        <label htmlFor={`teeth-${option}`} className="radio-label">
                          {option}
                        </label>
                        
                      </div>
                    ))}
                  </div>
                </div>
              </Form.Group>

              {answers.teeth === 'Dentures' && (
                <Form.Group className="mb-3">
                  <Form.Label>Denture Type:</Form.Label>
                  <Form.Select
                    value={answers.dentureType || ''}
                    onChange={(e) => handleAnswerChange('dentureType', e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Both">Both</option>
                  </Form.Select>
                </Form.Group>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* Yes/No Questions */}
        <Card className="assessment-card">
          <Card.Header className="assessment-card-header">
            <h4 className="assessment-card-title">Additional Care</h4>
            <button
              className="clear-section-btn"
              onClick={() => {
                questions.forEach(question => {
                  handleAnswerChange(question.id, '');
                });
              }}
            >
              Clear
            </button>
          </Card.Header>
          <Card.Body className="assessment-card-body">
            <Form>
              <div className="mb-2 d-flex justify-content-end">
                <strong className="me-4">Yes</strong>
                <strong>No</strong>
              </div>
              {questions.map((question, index) => (
                <Form.Group key={index} className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-3">{question.text}:</Form.Label>
                  <div className="ms-auto d-flex align-items-center">
                    <Form.Check
                      inline
                      name={question.id}
                      type="radio"
                      id={`${question.id}-yes`}
                      checked={answers[question.id] === 'yes'}
                      onChange={() => !readOnly && handleAnswerChange(question.id, 'yes')}
                      disabled={readOnly}
                    />
                    <Form.Check
                      inline
                      name={question.id}
                      type="radio"
                      id={`${question.id}-no`}
                      checked={answers[question.id] === 'no'}
                      onChange={() => !readOnly && handleAnswerChange(question.id, 'no')}
                      disabled={readOnly}
                    />
                  </div>
                </Form.Group>
              ))}
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

export default PatientADL;
