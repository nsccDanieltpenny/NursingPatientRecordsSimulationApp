import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import api from '../utils/api';
import AssessmentsCard from '../components/profile-components/AssessmentsCard';
import '../css/assessment_styles.css';
import { Snackbar, Alert } from '@mui/material';
import useReadOnlyMode from '../utils/useReadOnlyMode';
import { useNavigationBlocker } from '../utils/useNavigationBlocker';

// Define all checklist items with their property prefixes
const CHECKLIST_ITEMS = [
    { prefix: 'createHomeChart', name: 'Home Chart - existing/update' },
    { prefix: 'returnHomeChart', name: 'Home Chart - returned to family' },
    { prefix: 'notifyPCNurse', name: 'P.C. Nurse notified' },
    { prefix: 'notifyContinuingCare', name: 'Continuing Care notified' },
    { prefix: 'familySupport', name: 'Family support' },
    { prefix: 'getAppointments', name: 'Able to get to appointments' },
    { prefix: 'consultGeriatricNav', name: 'Consult geriatric navigator' },
    { prefix: 'provideFollowUpAppts', name: 'Follow-up appointments given to patient/caregiver' },
    { prefix: 'provideRx', name: 'Rx(s) given' },
    { prefix: 'assessBlisterPack', name: 'Need for blister packaging assessed' },
    { prefix: 'returnOwnMeds', name: 'Own medications returned' },
    { prefix: 'obtainAffordMeds', name: 'Able to obtain/afford medications' },
    { prefix: 'prepareMedCalendar', name: 'Medication calendar prepared' },
    { prefix: 'teachHighRiskMeds', name: 'High risk medication teaching completed' },
    { prefix: 'orderTeachVTE', name: 'VTE prophylaxis ordered/taught' },
    { prefix: 'demonstrateAdminTech', name: 'Patient/Caregiver demonstrate administration technique' },
    { prefix: 'familyAwareDischarge', name: 'Family aware of discharge' },
    { prefix: 'equipmentReady', name: 'Equipment Ready' },
    { prefix: 'completePASS', name: 'PASS completed' },
    { prefix: 'completeTOA', name: 'TOA completed' },
    { prefix: 'returnValuables', name: 'Valuables returned' },
    { prefix: 'arrangeTransportation', name: 'Transportation Arranged' }
];

const PatientDischargeChecklist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dischargeData, setDischargeData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const readOnly = useReadOnlyMode();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Check if there are any changes
    const isDirty = () => {
        const current = JSON.stringify(dischargeData);
        const initial = JSON.stringify(initialData);
        return current !== initial;
    };

    // Fetch discharge checklist data on component mount
    useEffect(() => {
        const fetchDischargeChecklistData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/patients/${id}/dischargechecklist`);
                const checklistData = response.data || {};

                // Initialize with data from backend
                const initializedData = {
                    PatientId: parseInt(id),
                    ...checklistData
                };

                setDischargeData(initializedData);
                setInitialData(JSON.parse(JSON.stringify(initializedData)));
                console.log(initializedData); 
            } catch (error) {
                console.error('Error fetching discharge checklist data:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading discharge checklist data',
                    severity: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDischargeChecklistData();
    }, [id]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty()) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty()]);

    // Update a field in the discharge checklist
    const handleFieldChange = (fieldName, value) => {
        setDischargeData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Save function
    const handleSave = async () => {
        try {
            // Get rotation from sessionStorage
            const storedRotation = sessionStorage.getItem('selectedRotation');
            if (!storedRotation) {
                setSnackbar({
                    open: true,
                    message: 'No rotation selected. Please select a rotation first.',
                    severity: 'error'
                });
                return;
            }

            const rotation = JSON.parse(storedRotation);

            const payload = {
                ...dischargeData,
                PatientId: parseInt(id),
                RotationId: rotation.rotationId
            };

            await api.put(`/api/patients/${id}/dischargechecklist`, payload);

            // Update initial data to reflect saved state
            setInitialData(JSON.parse(JSON.stringify(dischargeData)));

            setSnackbar({
                open: true,
                message: 'Discharge checklist saved successfully!',
                severity: 'success'
            });

            // Refresh data from server
            const response = await api.get(`/api/patients/${id}/dischargechecklist`);
            const checklistData = response.data || {};
            
            const updatedData = {
                PatientId: parseInt(id),
                ...checklistData
            };

            setDischargeData(updatedData);
            setInitialData(JSON.parse(JSON.stringify(updatedData)));
        } catch (error) {
            console.error('Error saving discharge checklist data:', error);
            setSnackbar({
                open: true,
                message: 'Error saving discharge checklist data',
                severity: 'error'
            });
        }
    };

    // Helper to get field value with proper formatting
    const getFieldValue = (prefix, suffix) => {
        const fieldName = `${prefix}${suffix}`;
        const value = dischargeData[fieldName];
        
        // Handle date fields - convert from ISO to YYYY-MM-DD format
        if (suffix === 'InitiatedDate' || suffix === 'CompletedDate') {
            if (!value) return '';
            // If it's already in YYYY-MM-DD format, return as is
            if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return value;
            }
            // Otherwise try to parse and format
            try {
                const date = new Date(value);
                return date.toISOString().split('T')[0];
            } catch {
                return '';
            }
        }
        
        return value || '';
    };

    useNavigationBlocker(isDirty());

    if (isLoading) {
        return (
            <div className="container mt-4 d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 d-flex assessment-page" style={{ cursor: readOnly ? 'not-allowed' : 'text' }}>
            <AssessmentsCard />

            <div className="ms-4 flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-4 assessment-header">
                    <text>Discharge Checklist</text>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/patients/${id}`)}
                        >
                            Go Back to Profile
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={!isDirty() || readOnly}
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

                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Discharge Information</h4>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <div className="question-group">
                            <div className="d-flex align-items-center gap-4">
                                <div style={{ minWidth: '250px' }}>
                                    <label className="question-label">Target Discharge Date:</label>
                                    <Form.Control
                                        type="date"
                                        value={getFieldValue('', 'targetDischargeDate')}
                                        onChange={(e) => handleFieldChange('targetDischargeDate', e.target.value)}
                                        disabled={readOnly}
                                        style={{color: '#ffffff'}}
                                    />
                                </div>
                                <div className="d-flex align-items-center" style={{ marginTop: '28px' }}>
                                    <Form.Check
                                        type="checkbox"
                                        label="High-risk discharge"
                                        checked={getFieldValue('', 'highRiskDischarge') || false}
                                        onChange={(e) => handleFieldChange('highRiskDischarge', e.target.checked)}
                                        disabled={readOnly}
                                        style={{ transform: 'scale(1.1)', color: '#ffffff', textAlign: 'center' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="assessment-card">
                    <Card.Header className="assessment-card-header">
                        <h4 className="assessment-card-title">Discharge Checklist Items</h4>
                    </Card.Header>
                    <Card.Body className="assessment-card-body">
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Item</th>
                                    <th style={{ width: '5%', textAlign: 'center' }}>Not Applicable</th>
                                    <th style={{ width: '15%' }}>Date Initiated</th>
                                    <th style={{ width: '40%' }}>Comments</th>
                                    <th style={{ width: '15%' }}>Date Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CHECKLIST_ITEMS.map((item) => (
                                    <tr key={item.prefix}>
                                        <td style={{ verticalAlign: 'middle', fontWeight: '500', fontSize: '.8em' }}>
                                            {item.name}
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <Form.Check
                                                type="checkbox"
                                                checked={getFieldValue(item.prefix, 'NotApplicable') || false}
                                                onChange={(e) => handleFieldChange(`${item.prefix}NotApplicable`, e.target.checked)}
                                                disabled={readOnly}
                                                style={{ transform: 'scale(1.2)' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={getFieldValue(item.prefix, 'InitiatedDate')}
                                                onChange={(e) => handleFieldChange(`${item.prefix}InitiatedDate`, e.target.value)}
                                                disabled={readOnly}
                                                style={{color: '#000000'}}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                value={getFieldValue(item.prefix, 'Comments')}
                                                onChange={(e) => handleFieldChange(`${item.prefix}Comments`, e.target.value)}
                                                placeholder="Enter comments..."
                                                disabled={readOnly}
                                                style={{ resize: 'vertical', color: '#000000' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={getFieldValue(item.prefix, 'CompletedDate')}
                                                onChange={(e) => handleFieldChange(`${item.prefix}CompletedDate`, e.target.value)}
                                                disabled={readOnly}
                                                style={{color: '#000000'}}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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

export default PatientDischargeChecklist;