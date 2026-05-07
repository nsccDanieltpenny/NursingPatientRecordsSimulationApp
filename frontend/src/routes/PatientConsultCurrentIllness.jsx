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

const PatientConsultCurrentIllness = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consultsData, setConsultsData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [currentIllness, setCurrentIllness] = useState('');
    const [initialCurrentIllness, setInitialCurrentIllness] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const readOnly = useReadOnlyMode();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Check if there are any changes
    const isDirty = () => {
        const consultsChanged = JSON.stringify(consultsData) !== JSON.stringify(initialData);
        const illnessChanged = currentIllness !== initialCurrentIllness;
        return consultsChanged || illnessChanged;
    };

    // Fetch consults data and patient data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch consults
                const consultsResponse = await api.get(`/api/patients/${id}/consults`);
                const consults = consultsResponse.data || [];
                setConsultsData(consults);
                setInitialData(consults);

                // Fetch patient data for current illness
                const patientResponse = await api.get(`/api/patients/${id}`);
                const patientData = patientResponse.data;
                const illness = patientData.currentIllness || '';
                setCurrentIllness(illness);
                setInitialCurrentIllness(illness);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading data',
                    severity: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

    // Add new row
    const handleAddRow = () => {
        const newRow = {
            consultId: 0, // 0 indicates a new entry
            patientId: parseInt(id),
            consultType: 'Dietitian',
            dateSent: null,
            dateReplied: null,
            consultName: ''
        };
        setConsultsData([...consultsData, newRow]);
    };

    // Update a specific row
    const handleRowChange = (index, field, value) => {
        const updated = [...consultsData];
        updated[index] = { ...updated[index], [field]: value };
        setConsultsData(updated);
    };

    // Clear entire table
    const handleClearTable = () => {
        setConsultsData([]);
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

            // Save consults and current illness via PUT endpoint
            const consultsPayload = {
                rotationId: rotation.rotationId,
                consults: consultsData,
                currentIllness: currentIllness
            };

            await api.put(`/api/patients/${id}/consults`, consultsPayload);

            // Refresh data from server
            const consultsResponse = await api.get(`/api/patients/${id}/consults`);
            const consults = consultsResponse.data || [];
            
            setConsultsData(consults);
            setInitialData(consults);
            setInitialCurrentIllness(currentIllness);

            setSnackbar({
                open: true,
                message: 'Data saved successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving data:', error);
            setSnackbar({
                open: true,
                message: 'Error saving data',
                severity: 'error'
            });
        }
    };

    // Render current illness card
    const renderCurrentIllnessCard = () => {
        return (
            <Card className="assessment-card mb-3">
                <Card.Header className="assessment-card-header">
                    <h4 className="assessment-card-title">Current Illness</h4>
                </Card.Header>
                <Card.Body className="assessment-card-body">
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={currentIllness}
                        onChange={(e) => setCurrentIllness(e.target.value)}
                        placeholder="Enter current illness details..."
                        disabled={readOnly}
                        style={{ color: '#ffffff' }}
                    />
                </Card.Body>
            </Card>
        );
    };

    // Render consults table
    const renderConsultsTable = () => {
        return (
            <Card className="assessment-card">
                <Card.Header className="assessment-card-header">
                    <h4 className="assessment-card-title">Consults</h4>
                    <div className="d-flex gap-2">
                        <button 
                            className="clear-section-btn"
                            onClick={handleClearTable}
                            disabled={readOnly || consultsData.length === 0}
                        >
                            Clear All
                        </button>
                        <Button 
                            size="sm"
                            variant="primary"
                            onClick={handleAddRow}
                            disabled={readOnly}
                        >
                            + Add Entry
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="assessment-card-body">
                    {consultsData.length === 0 ? (
                        <p className="text-muted">No entries. Click "Add Entry" to create one.</p>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '20%' }}>Type</th>
                                    <th style={{ width: '25%' }}>Date Sent</th>
                                    <th style={{ width: '25%' }}>Date Replied</th>
                                    <th style={{ width: '30%' }}>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultsData.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Select
                                                value={row.consultType || ''}
                                                onChange={(e) => handleRowChange(index, 'consultType', e.target.value)}
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            >
                                                <option value="Dietitian">Dietitian</option>
                                                <option value="Continuing Care NS">Continuing Care NS</option>
                                                <option value="Occupational Therapy">Occupational Therapy</option>
                                                <option value="Palliative Care">Palliative Care</option>
                                                <option value="Pharmacy">Pharmacy</option>
                                                <option value="Physiotherapy">Physiotherapy</option>
                                                <option value="Social Work">Social Work</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={row.dateSent || ''}
                                                onChange={(e) => handleRowChange(index, 'dateSent', e.target.value)}
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={row.dateReplied || ''}
                                                onChange={(e) => handleRowChange(index, 'dateReplied', e.target.value)}
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={row.consultName || ''}
                                                onChange={(e) => handleRowChange(index, 'consultName', e.target.value)}
                                                placeholder="Enter consult name"
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        );
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
                    <text>Consults / Current Illness</text>
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

                {renderCurrentIllnessCard()}
                {renderConsultsTable()}
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

export default PatientConsultCurrentIllness;