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

// Map field names to readable labels
const fieldNameMap = {
  // Common fields
  recordId: "Record ID",
  patientId: "Patient ID",
  nurseId: "Nurse ID",
  
  // ADL fields
  adlId: "ADL ID",
  bathDate: "Bath Date",
  tubShowerOther: "Bathing Method",
  typeOfCare: "Type of Care",
  turning: "Turning Schedule",
  turningFrequency: "Turning Frequency",
  teeth: "Teeth",
  dentureType: "Denture Type",
  mouthCare: "Mouth Care",
  footCare: "Foot Care",
  hairCare: "Hair Care",
  
  // Behaviour fields
  behaviourId: "Behaviour ID",
  report: "Behaviour Report",
  
  // Cognitive fields
  cognitiveId: "Cognitive ID",
  speech: "Speech/Verbal",
  loc: "Level of Consciousness (LOC)",
  mmse: "MMSE Date",
  confusion: "Confusion",
  
  // Elimination fields
  eliminationId: "Elimination ID",
  dayOrNightProduct: "Day or Night Product",
  lastBowelMovement: "Last Bowel Movement",
  routine: "Elimination Routine",
  catheterInsertionDate: "Catheter Insertion Date",
  catheterInsertion: "Catheter Insertion",
  catheterSize: "Catheter Size",
  
  //Mobility & Safety fields
  mobilityAndSafetyId: "Mobility & Safety ID",
  transfer: "Transfer",
  aids: "Mobility Aids",
  bedMobility: "Bed Mobility",
  hipProtectors: "Hip Protectors",
  sideRails: "Side Rails",
  fallRiskScale: "Fall Risk Scale",
  crashMats: "Crash Mats",
  bedAlarm: "Bed Alarm",

  // Nutrition fields
  nutritionId: "Nutrition ID",
  diet: "Diet Type",
  assist: "Assistance Level",
  intake: "Food Intake",
  weight: "Weight",
  date: "Date of Weighing",
  method: "Weighing Method",
  specialNeeds: "Special Needs",
  feedingTube: "Feeding Tube",
  feedingTubeDate: "Feeding Tube Date",
  ngTube: "NG Tube",
  ngTubeDate: "NG Tube Date",
  
  // Progress Note fields
  progressNoteId: "Progress Note ID",
  timestamp: "Timestamp",
  note: "Progress Notes",
  
  // Skin & Sensory Aid fields
  skinAndSensoryAidsId: "Skin & Sensory Aid ID",
  skinIntegrity: "Skin Integrity",
  skinIntegrityFrequency: "Skin Integrity Check Frequency",
  glasses: "Glasses",
  hearing: "Hearing Aids",
  hearingAidSide: "Hearing Aid Side",
  pressureUlcerRisk: "Pressure Ulcer Risk",
  skinIntegrityTurningSchedule: "Turning Schedule",
  turningScheduleFrequency: "Turning Frequency",
  skinIntegrityDressings: "Dressings"
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

  const fetchAssessmentDetail = async (assessmentTypeId, tableRecordId) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`api/patients/history/assessment/${assessmentTypeId}/${tableRecordId}`);
      setAssessmentDetail(response.data);
      setCurrentView("detail");
    } catch (err) {
      console.error("Error fetching assessment detail:", err);
      setError("Failed to load assessment details. Please try again.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Count assessments in a record
  const countAssessments = (record) => {
    return record.assessmentSubmissions?.length || 0;
  };

  // Get available assessments for a record
  const getAvailableAssessments = (record) => {
    return record.assessmentSubmissions || [];
  };

  // Handle viewing a record's assessments
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setCurrentView("assessments");
  };

  // Handle viewing an assessment detail
  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    fetchAssessmentDetail(assessment.assessmentTypeId, assessment.tableRecordId);
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
                <TableCell><strong>Rotation</strong></TableCell>
                <TableCell><strong>Assessments Completed</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.recordId} hover>
                  <TableCell>{formatDate(record.submittedDate)}</TableCell>
                  <TableCell>{record.submittedNurse}</TableCell>
                  <TableCell>{record.rotationName}</TableCell>
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
          <Typography variant="body2" color="text.secondary">
            Rotation: {selectedRecord.rotationName}
          </Typography>
        </Box>

        {assessments.length === 0 ? (
          <Alert severity="info">No assessments available for this record.</Alert>
        ) : (
          <List>
            {assessments.map((assessment, index) => (
              <React.Fragment key={assessment.submissionId}>
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
                    primary={assessment.assessmentTypeName}
                    secondary={`Submission ID: ${assessment.submissionId}`}
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
            {selectedAssessment.assessmentTypeName}
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