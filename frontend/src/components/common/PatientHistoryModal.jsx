import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropTypes from 'prop-types';
import api from '../../utils/api';

// Map assessment type names to more readable labels
const assessmentTypeMap = {
  adl: "ADL",
  behaviour: "Behaviour",
  cognitive: "Cognitive",
  elimination: "Elimination",
  mobility: "Mobility & Safety",
  nutrition: "Nutrition",
  progressnote: "Progress Note",
  safety: "Safety",
  skinandsensoryaid: "Skin & Sensory Aid"
};

// Map field names to readable labels
const fieldNameMap = {
  // Common fields
  recordId: "Record ID",
  patientId: "Patient ID",
  nurseId: "Nurse ID",
  
  // Elimination
  catheterInsertion: "Catheter Insertion",
  catheterInsertionDate: "Catheter Insertion Date",
  catheterSize: "Catheter Size",
  eliminationRoutine: "Elimination Routine",
  product: "Incontinence Product",
  eliminationId: "Elimination ID",
  
  // Mobility & Safety
  transfer: "Transfer",
  aids: "Mobility Aid",
  hipProtectors: "Hip Protectors",
  sideRails: "Side Rails",
  crashMats: "Crash Mats",
  bedAlarm: "Bed Alarm",
  fallRiskScale: "Fall Risk Scale",
  mobilityId: "Mobility ID",
  safetyId: "Safety ID",
  
  // Cognitive
  confusion: "Confusion",
  verbal: "Verbal",
  loc: "Level of Consciousness (LOC)",
  mmse: "MMSE Assessment Date",
  cognitiveId: "Cognitive ID",
  
  // Behaviour
  report: "Behaviour Notes",
  behaviourId: "Behaviour ID",
  
  // ADL
  bathDate: "Bath Date",
  tubShowerOther: "Bathing Method",
  typeOfCare: "Type of Care",
  turning: "Turning Required",
  turningFrequency: "Turning Frequency",
  teeth: "Teeth",
  dentureType: "Denture Type",
  footCare: "Foot Care",
  hairCare: "Hair Care",
  adlId: "ADL ID",
  
  // Nutrition
  diet: "Diet Type",
  assist: "Assistance Level",
  intake: "Food Intake",
  specialNeeds: "Special Needs (Fluids/Supplements)",
  date: "Date of Weighing",
  method: "Weighing Method",
  nutritionId: "Nutrition ID",
  
  // Progress Note
  timestamp: "Progress Note Date",
  note: "Progress Notes",
  progressNoteId: "Progress Note ID",
  
  // Sensory Aids & Skin
  skinIntegrity: "Skin Integrity Assessment",
  skinIntegrityFrequency: "Skin Integrity Frequency",
  glasses: "Glasses",
  hearing: "Hearing Aids",
  hearingAidSide: "Hearing Aid Side",
  pressureUlcerRisk: "Pressure Ulcer Risk",
  skinAndSensoryAidsId: "Skin & Sensory Aid ID"
};

const PatientHistoryModal = ({ isOpen, onClose, patientId }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  
  // Navigation state - three levels
  const [currentView, setCurrentView] = useState("list"); // "list" | "assessments" | "detail"
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch patient history when modal opens
  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientHistory();
    }
  }, [isOpen, patientId]);

  // Filter records when date changes
  useEffect(() => {
    if (historyData && selectedDate) {
      const filtered = historyData.history.filter(record => {
        // Convert the record date to AST and get just the date part
        const recordDate = new Date(record.submittedDate).toLocaleDateString('en-US', {
          timeZone: 'America/Halifax',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        // Convert the selected date to AST format for comparison
        const selected = new Date(selectedDate + 'T12:00:00Z').toLocaleDateString('en-US', {
          timeZone: 'America/Halifax',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        return recordDate === selected;
      });
      setFilteredRecords(filtered);
    } else if (historyData) {
      setFilteredRecords(historyData.history);
    }
  }, [selectedDate, historyData]);

  const fetchPatientHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/patients/${patientId}/history`);
      setHistoryData(response.data);
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    } catch (err) {
      console.error("Error fetching patient history:", err);
      setError("Failed to load patient history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentDetail = async (assessmentType, assessmentId) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`api/patients/history/${assessmentType}/${assessmentId}`);
      setAssessmentDetail(response.data);
      setCurrentView("detail");
    } catch (err) {
      console.error("Error fetching assessment detail:", err);
      setError("Failed to load assessment details. Please try again.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Count non-null assessments in a record
  const countAssessments = (record) => {
    let count = 0;
    if (record.adlId) count++;
    if (record.behaviourId) count++;
    if (record.cognitiveId) count++;
    if (record.eliminationId) count++;
    if (record.mobilityId) count++;
    if (record.nutritionId) count++;
    if (record.progressId) count++;
    if (record.safetyId) count++;
    if (record.skinAndSensoryId) count++;
    return count;
  };

  // Get available assessments for a record
  const getAvailableAssessments = (record) => {
    const assessments = [];
    if (record.adlId) assessments.push({ type: "adl", id: record.adlId, name: assessmentTypeMap.adl });
    if (record.behaviourId) assessments.push({ type: "behaviour", id: record.behaviourId, name: assessmentTypeMap.behaviour });
    if (record.cognitiveId) assessments.push({ type: "cognitive", id: record.cognitiveId, name: assessmentTypeMap.cognitive });
    if (record.eliminationId) assessments.push({ type: "elimination", id: record.eliminationId, name: assessmentTypeMap.elimination });
    if (record.mobilityId) assessments.push({ type: "mobility", id: record.mobilityId, name: assessmentTypeMap.mobility });
    if (record.nutritionId) assessments.push({ type: "nutrition", id: record.nutritionId, name: assessmentTypeMap.nutrition });
    if (record.progressId) assessments.push({ type: "progressnote", id: record.progressId, name: assessmentTypeMap.progressnote });
    if (record.safetyId) assessments.push({ type: "safety", id: record.safetyId, name: assessmentTypeMap.safety });
    if (record.skinAndSensoryId) assessments.push({ type: "skinandsensoryaid", id: record.skinAndSensoryId, name: assessmentTypeMap.skinandsensoryaid });
    return assessments;
  };

  // Handle viewing a record's assessments
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setCurrentView("assessments");
  };

  // Handle viewing an assessment detail
  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    fetchAssessmentDetail(assessment.type, assessment.id);
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "detail") {
      setCurrentView("assessments");
      setAssessmentDetail(null);
      setSelectedAssessment(null);
    } else if (currentView === "assessments") {
      setCurrentView("list");
      setSelectedRecord(null);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentView("list");
    setSelectedRecord(null);
    setSelectedAssessment(null);
    setAssessmentDetail(null);
    setError(null);
    onClose();
  };

  // Format date for display in Atlantic Standard Time (UTC-4)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: 'America/Halifax',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Render assessment detail table dynamically
  const renderAssessmentDetail = () => {
    if (!assessmentDetail) return null;

    // Filter out null/undefined values and format the data
    const entries = Object.entries(assessmentDetail).filter(([key, value]) => {
      return value !== null && value !== undefined && value !== "";
    });

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Field</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{fieldNameMap[key] || key}</TableCell>
                <TableCell>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render the main list view
  const renderListView = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <TextField
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          fullWidth
        />
      </Box>

      {filteredRecords.length === 0 ? (
        <Alert severity="info">No records found for the selected date.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell><strong>Submitted By</strong></TableCell>
                <TableCell><strong>Assessments Completed</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.recordId} hover>
                  <TableCell>{formatDate(record.submittedDate)}</TableCell>
                  <TableCell>{record.submittedNurse}</TableCell>
                  <TableCell>{countAssessments(record)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewRecord(record)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  // Render the assessments list view
  const renderAssessmentsView = () => {
    if (!selectedRecord) return null;

    const assessments = getAvailableAssessments(selectedRecord);

    return (
      <>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Record from {formatDate(selectedRecord.submittedDate)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Submitted by: {selectedRecord.submittedNurse}
          </Typography>
        </Box>

        {assessments.length === 0 ? (
          <Alert severity="info">No assessments available for this record.</Alert>
        ) : (
          <List>
            {assessments.map((assessment, index) => (
              <React.Fragment key={`${assessment.type}-${assessment.id}`}>
                <ListItem
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={assessment.name}
                    secondary={`Assessment ID: ${assessment.id}`}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewAssessment(assessment)}
                  >
                    View Details
                  </Button>
                </ListItem>
                {index < assessments.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </>
    );
  };

  // Render the assessment detail view
  const renderDetailView = () => {
    if (!selectedAssessment) return null;

    return (
      <>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {selectedAssessment.name}
          </Typography>
        </Box>

        {loadingDetail ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderAssessmentDetail()
        )}
      </>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Patient History</Typography>
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        {historyData && (
          <Typography variant="subtitle2" color="text.secondary">
            {historyData.patientName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : historyData ? (
          <>
            {currentView === "list" && renderListView()}
            {currentView === "assessments" && renderAssessmentsView()}
            {currentView === "detail" && renderDetailView()}
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PatientHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patientId: PropTypes.number.isRequired
};

export default PatientHistoryModal;