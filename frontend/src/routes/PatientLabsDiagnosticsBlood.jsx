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

const PatientLabsDiagnosticsBlood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [labsData, setLabsData] = useState([]);
    const [diagnosticsData, setDiagnosticsData] = useState([]);
    const [bloodData, setBloodData] = useState([]);
    const [initialData, setInitialData] = useState({ labs: [], diagnostics: [], blood: [] });
    const [isLoading, setIsLoading] = useState(true);
    const readOnly = useReadOnlyMode();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Check if there are any changes
    const isDirty = () => {
        const current = JSON.stringify({ labs: labsData, diagnostics: diagnosticsData, blood: bloodData });
        const initial = JSON.stringify(initialData);
        return current !== initial;
    };

    // Fetch labs data on component mount
    useEffect(() => {
        const fetchLabsData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/patients/${id}/labs`);
                const rawData = response.data;

                // Map backend data (PascalCase) to frontend format (camelCase)
                const mappedData = Array.isArray(rawData) ? rawData.map(item => ({
                    id: item.labsDiagnosticsAndBloodId || item.id || 0,
                    patientId: item.patientId || parseInt(id),
                    type: item.type || '',
                    value: item.value || '',
                    orderedDate: item.orderedDate || null,
                    completedDate: item.completedDate || null
                })) : [];

                // Separate data by type
                const labs = mappedData.filter(item => item.type === 'Labs');
                const diagnostics = mappedData.filter(item => item.type === 'Diagnostics');
                const blood = mappedData.filter(item => item.type === 'Blood');

                setLabsData(labs);
                setDiagnosticsData(diagnostics);
                setBloodData(blood);
                setInitialData({ labs, diagnostics, blood });
            } catch (error) {
                console.error('Error fetching labs data:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading labs data',
                    severity: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLabsData();
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

    // Add new row to specific table
    const handleAddRow = (type) => {
        const newRow = {
            id: 0, // 0 indicates a new entry
            patientId: parseInt(id),
            type: type,
            value: '',
            orderedDate: null,
            completedDate: null
        };

        if (type === 'Labs') {
            setLabsData([...labsData, newRow]);
        } else if (type === 'Diagnostics') {
            setDiagnosticsData([...diagnosticsData, newRow]);
        } else if (type === 'Blood') {
            setBloodData([...bloodData, newRow]);
        }
    };

    // Update a specific row
    const handleRowChange = (type, index, field, value) => {
        if (type === 'Labs') {
            const updated = [...labsData];
            updated[index] = { ...updated[index], [field]: value };
            setLabsData(updated);
        } else if (type === 'Diagnostics') {
            const updated = [...diagnosticsData];
            updated[index] = { ...updated[index], [field]: value };
            setDiagnosticsData(updated);
        } else if (type === 'Blood') {
            const updated = [...bloodData];
            updated[index] = { ...updated[index], [field]: value };
            setBloodData(updated);
        }
    };

    // Clear entire table
    const handleClearTable = (type) => {
        if (type === 'Labs') {
            setLabsData([]);
        } else if (type === 'Diagnostics') {
            setDiagnosticsData([]);
        } else if (type === 'Blood') {
            setBloodData([]);
        }
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

            // Combine all data
            const allLabs = [...labsData, ...diagnosticsData, ...bloodData];

            const payload = {
                rotationId: rotation.rotationId,
                labs: allLabs
            };

            await api.put(`/api/patients/${id}/labs`, payload);

            // Update initial data to reflect saved state
            setInitialData({ labs: labsData, diagnostics: diagnosticsData, blood: bloodData });

            setSnackbar({
                open: true,
                message: 'Labs data saved successfully!',
                severity: 'success'
            });

            // Refresh data from server
            const response = await api.get(`/api/patients/${id}/labs`);
            const rawData = response.data;
            
            const mappedData = Array.isArray(rawData) ? rawData.map(item => ({
                id: item.labsDiagnosticsAndBloodId || item.id || 0,
                patientId: item.patientId || parseInt(id),
                type: item.type || '',
                value: item.value || '',
                orderedDate: item.orderedDate || null,
                completedDate: item.completedDate || null
            })) : [];

            setLabsData(mappedData.filter(item => item.type === 'Labs'));
            setDiagnosticsData(mappedData.filter(item => item.type === 'Diagnostics'));
            setBloodData(mappedData.filter(item => item.type === 'Blood'));
            setInitialData({ labs: mappedData.filter(item => item.type === 'Labs'), diagnostics: mappedData.filter(item => item.type === 'Diagnostics'), blood: mappedData.filter(item => item.type === 'Blood') });
        } catch (error) {
            console.error('Error saving labs data:', error);
            setSnackbar({
                open: true,
                message: 'Error saving labs data',
                severity: 'error'
            });
        }
    };

    // Render table component
    const renderTable = (title, type, data, valueName) => {
        return (
            <Card className="assessment-card">
                <Card.Header className="assessment-card-header">
                    <h4 className="assessment-card-title">{title}</h4>
                    <div className="d-flex gap-2">
                        <button 
                            className="clear-section-btn"
                            onClick={() => handleClearTable(type)}
                            disabled={readOnly || data.length === 0}
                        >
                            Clear All
                        </button>
                        <Button 
                            size="sm"
                            variant="primary"
                            onClick={() => handleAddRow(type)}
                            disabled={readOnly}
                        >
                            + Add Entry
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="assessment-card-body">
                    {data.length === 0 ? (
                        <p className="text-muted">No entries. Click "Add Entry" to create one.</p>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '33%' }}>Ordered Date</th>
                                    <th style={{ width: '34%' }}>{valueName}</th>
                                    <th style={{ width: '33%' }}>Completed Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={row.orderedDate || ''}
                                                onChange={(e) => handleRowChange(type, index, 'orderedDate', e.target.value)}
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={row.value || ''}
                                                onChange={(e) => handleRowChange(type, index, 'value', e.target.value)}
                                                placeholder="Enter description or value"
                                                disabled={readOnly}
                                                style={{ color: '#000000' }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={row.completedDate || ''}
                                                onChange={(e) => handleRowChange(type, index, 'completedDate', e.target.value)}
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
                    <text>Labs / Diagnostics / Blood</text>
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

                {renderTable('Lab Work / Specimens', 'Labs', labsData, "Lab Work / Specimens")}
                {renderTable('Diagnostics', 'Diagnostics', diagnosticsData, "Diagnostics / Procedures / X-Ray")}
                {renderTable('Blood Work', 'Blood', bloodData, "Blood Work")}
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

export default PatientLabsDiagnosticsBlood;