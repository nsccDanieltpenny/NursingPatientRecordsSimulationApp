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


const PatientADL = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adlData, setAdlData] = useState({});
  const [initialAdlData, setInitialAdlData] = useState({});
  const [errors, setErrors] = useState({});
  const APIHOST = import.meta.env.VITE_API_URL;
  const readOnly = useReadOnlyMode();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const savedData = localStorage.getItem(`patient-adl-${id}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAdlData(parsed);
      setInitialAdlData(parsed);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const defaultState = { bathDate: today };
      setAdlData(defaultState);
      setInitialAdlData(defaultState);
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`${APIHOST}/api/patients/nurse/patient/${id}/adl`);
      setAdlData(prev => ({ ...prev, ...response.data }));
      setInitialAdlData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching patient:', error);

    }
  };

  const handleAnswerChange = (question, answer) => {
    setAdlData(prev => ({
      ...prev,
      [question]: answer
    }));

    if (question === 'tubShowerOther' && answer) {
      setErrors(prev => ({ ...prev, tubShowerOther: false }));
    }
  };

  const handleSave = () => {
    if (!adlData.tubShowerOther) {
      setErrors(prev => ({ ...prev, tubShowerOther: true }));
      setSnackbar({
        open: true,
        message: 'Please select a bathing method before saving.',
        severity: 'error'
      });
      return;
    }

    try {

      if (adlData) {
        const filteredAdlData = Object.fromEntries(Object.entries(adlData).filter(([_, value]) => value != null && value !== ''));
        if (Object.keys(filteredAdlData).length > 0) {
          localStorage.setItem(`patient-adl-${id}`, JSON.stringify(filteredAdlData));
        } else {
          localStorage.removeItem(`patient-adl-${id}`)
        }
        setInitialAdlData(adlData);
      }

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

  const isDirty = () => {
    return JSON.stringify(adlData) !== JSON.stringify(initialAdlData);
  };

  const questions = [
    { id: 'footCare', text: 'Foot Care' },
    { id: 'hairCare', text: 'Hair Care' },
  ];

  return (
    <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
      <AssessmentsCard />
      <div className="ms-4 flex-fill assessment-page">
        <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
          <text>ADLs</text>
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

        {/* Bath Date & Tub/Shower/Other */}
        <Card className="mt-4 gradient-background">
          <Card.Body>
            <Form>
              <div className="row">
                <Form.Group
                  className={`mb-3 col-md-6 ${errors.tubShowerOther && !adlData.tubShowerOther ? 'warning-highlight' : ''}`}
                >
                  <Form.Label>Hygiene Options:</Form.Label>

                  <div className="d-flex">
                    {['Tub', 'Shower', 'Bed Bath'].map((option) => (
                      <Form.Check
                        key={option}
                        inline
                        label={option}
                        name="tubShowerOther"
                        type="radio"
                        id={`tubShowerOther-${option}`}
                        checked={adlData.tubShowerOther === option}
                        onChange={() => !readOnly && handleAnswerChange('tubShowerOther', option)}
                        isInvalid={errors.tubShowerOther && !adlData.tubShowerOther}
                        disabled={readOnly}
                      />
                    ))}
                  </div>

                  {errors.tubShowerOther && (
                    <div className="text-warning-soft mt-1">
                      Please select a bathing method.
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label>
                    Bath Date:
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={adlData.bathDate || ''}
                    onChange={(e) => !readOnly && handleAnswerChange('bathDate', e.target.value)}
                    disabled={!adlData.tubShowerOther || readOnly}
                    className={!adlData.tubShowerOther ? 'disabled-date-input' : ''}
                  />
                </Form.Group>
              </div>
            </Form>
          </Card.Body>
        </Card>
        {/* Type of Care */}
        <Card className="mt-4 gradient-background">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Type of Care:</Form.Label>
                <div className="d-flex align-items-center">
                  {['Full', 'Assist', 'Independent'].map((opt) => (
                    <Form.Check
                      inline
                      key={opt}
                      name="typeOfCare"
                      type="radio"
                      label={opt}
                      id={`typeOfCare-${opt}`}
                      checked={adlData.typeOfCare === opt}
                      onChange={() => !readOnly && handleAnswerChange('typeOfCare', opt)}
                      disabled={readOnly}
                    />
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* Turning */}
        <Card className="mt-4 gradient-background">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Turning:</Form.Label>
                <div className="d-flex align-items-center mb-2">
                  {['Yes', 'No'].map((opt) => (
                    <Form.Check
                      inline
                      key={opt}
                      name="turning"
                      type="radio"
                      label={opt}
                      id={`turning-${opt.toLowerCase()}`}
                      checked={adlData.turning === opt}
                      onChange={() => !readOnly && handleAnswerChange('turning', opt)}
                      disabled={readOnly}
                    />
                  ))}
                </div>
                {adlData.turning === 'Yes' && (
                  <div className="d-flex">
                    {['Q2h', 'Q4h', 'QShift'].map((freq) => (
                      <Form.Check
                        key={freq}
                        inline
                        name="turningFrequency"
                        type="radio"
                        label={freq}
                        id={`turningFrequency-${freq}`}
                        checked={adlData.turningFrequency === freq}
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
        <Card className="mt-4 gradient-background">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Teeth:</Form.Label>
                <div className="d-flex align-items-center flex-wrap">
                  {['Natural', 'Dentures', 'None'].map((option) => (
                    <Form.Check
                      inline
                      key={option}
                      name="teeth"
                      type="radio"
                      label={option}
                      id={`teeth-${option}`}
                      checked={adlData.teeth === option}
                      onChange={() => !readOnly && handleAnswerChange('teeth', option)}
                      disabled={readOnly}
                    />
                  ))}
                </div>
              </Form.Group>

              {adlData.teeth === 'Dentures' && (
                <Form.Group className="mb-3">
                  <Form.Label>Denture Type:</Form.Label>
                  <Form.Select
                    value={adlData.dentureType || ''}
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
        <Card className="mt-4 gradient-background">
          <Card.Body>
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
                      checked={adlData[question.id] === 'yes'}
                      onChange={() => !readOnly && handleAnswerChange(question.id, 'yes')}
                      disabled={readOnly}
                    />
                    <Form.Check
                      inline
                      name={question.id}
                      type="radio"
                      id={`${question.id}-no`}
                      checked={adlData[question.id] === 'no'}
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
