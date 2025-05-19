import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

// Define the three main shifts with their time ranges (in 24-hour format)
const SHIFTS = [
  { name: "Morning", start: 6, end: 10, color: "#FFB74D" },   // 6 AM - 10 AM
  { name: "Afternoon", start: 12, end: 16, color: "#64B5F6" }, // 12 PM - 4 PM
  { name: "Evening", start: 18, end: 22, color: "#9575CD" }    // 6 PM - 10 PM
];

// Map attribute names to more readable labels
const attributeNameMap = {
  // Elimination
  "catheterInsertion": "Catheter Insertion",
  "catheterInsertionDate": "Catheter Insertion Date",
  "catheterSize": "Catheter Size",
  "eliminationRoutine": "Elimination Routine",
  "product": "Incontinence Product",
  // Mobility & Safety
  "transfer": "Transfer",
  "aids": "Mobility Aid",
  "hipProtectors": "Hip Protectors",
  "sideRails": "Side Rails",
  "crashMats": "Crash Mats",
  "bedAlarm": "Bed Alarm",
  "fallRiskScale": "Fall Risk Scale",
  // Profile
  "isolationPrecautions": "Isolation Precautions",
  "isolationPrecautionDetails": "Isolation Precaution Details",
  "isolationPrecautionsTimestamp": "Isolation Precaution Date",
  "weight": "Weight",
  // Cognitive
  "confusion": "Confusion",
  "verbal": "Verbal",
  "loc": "Level of Consciousness (LOC)",
  "mmse": "MMSE Assessment Date",
  // Behaviour
  "report": "Behaviour Notes",
  // ADL
  "bathDate": "Bath Date",
  "tubShowerOther": "Bathing Method",
  "typeOfCare": "Type of Care",
  "turning": "Turning Required",
  "turningFrequency": "Turning Frequency",
  "teeth": "Teeth",
  "dentureType": "Denture Type",
  "footCare": "Foot Care",
  "hairCare": "Hair Care",
  // Nutrition
  "diet": "Diet Type",
  "assist": "Assistance Level",
  "intake": "Food Intake",
  "specialNeeds": "Special Needs (Fluids/Supplements)",
  "date": "Date of Weighing",
  "method": "Weighing Method",
  // Progress Note
  "timestamp": "Progress Note Date",
  "note": "Progress Notes",
  // Sensory Aids & Skin
  "skinIntegrity": "Skin Integrity Assessment",
  "skinIntegrityFrequency": "Skin Integrity Frequency",
  "glasses": "Glasses",
  "hearing": "Hearing Aids",
  "hearingAidSide": "Hearing Aid Side",
  "pressureUlcerRisk": "Pressure Ulcer Risk",
  "skinIntegrityTurningSchedule": "Turning Schedule",
  "turningScheduleFrequency": "Turning Frequency",
  "skinIntegrityDressings": "Dressings"
};

function getShiftForDateTime(dateStr) {
  try {
    // Parse the ISO date string
    const utcDate = new Date(dateStr);
    
    if (isNaN(utcDate.getTime())) {
      console.warn(`Invalid date string for shift detection: ${dateStr}`);
      return "Other";
    }
    
    // Manually adjust for Atlantic Daylight Time (UTC-3)
    const localTime = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
    
    // Get the hour in local time
    const hour = localTime.getHours();
    return SHIFTS.find((s) => hour >= s.start && hour < s.end)?.name || "Other";
  } catch (error) {
    console.error(`Error determining shift for ${dateStr}:`, error);
    return "Other";
  }
}

function formatTime(dateStr) {
  try {
    // Parse the ISO date string
    const utcDate = new Date(dateStr);
    
    if (isNaN(utcDate.getTime())) {
      console.warn(`Invalid date string: ${dateStr}`);
      return "Unknown time";
    }
    
    // Manually adjust for Atlantic Daylight Time (UTC-3)
    // Create a new date object with the adjusted time
    const localTime = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
    
    // Format the time
    return localTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error(`Error formatting time for ${dateStr}:`, error);
    return "Unknown time";
  }
}

function formatDate(dateStr) {
  try {
    // Parse the ISO date string
    const utcDate = new Date(dateStr);
    
    if (isNaN(utcDate.getTime())) {
      console.warn(`Invalid date string: ${dateStr}`);
      return "Unknown date";
    }
    
    // Manually adjust for Atlantic Daylight Time (UTC-3)
    const localTime = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
    
    // Format the date
    return localTime.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date for ${dateStr}:`, error);
    return "Unknown date";
  }
}

function formatDateForInput(date) {
  try {
    // Adjust to Atlantic Daylight Time (UTC-3)
    const localDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    
    // Format as YYYY-MM-DD
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error(`Error formatting date for input: ${date}`, error);
    return '';
  }
}

// Format date for input field (YYYY-MM-DD)
//function formatDateForInput(date) {
 // return date.toISOString().split('T')[0];
//}

// Get current date formatted for input
const getCurrentDate = () => {
  return formatDateForInput(new Date());
};

// Helper to compare dates without time
function isSameDay(date1, date2) {
  try {
    // Parse both dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    // For date1 (the record date from the database), convert from UTC to Atlantic Time
    const localD1 = new Date(d1.getTime() - (3 * 60 * 60 * 1000));
    
    // For date2 (the filter date), we need to use the date as is, since it's already in local time
    const localD2 = d2;
    
    // Compare year, month, and day
    const sameDay = (
      localD1.getFullYear() === localD2.getFullYear() &&
      localD1.getMonth() === localD2.getMonth() &&
      localD1.getDate() === localD2.getDate()
    );
    
    return sameDay;
  } catch (error) {
    console.error(`Error comparing dates: ${date1} and ${date2}`, error);
    return false;
  }
}

const PatientHistoryModal = ({ isOpen, onClose, patientId }) => {
  const [history, setHistory] = useState([]);
  const [filteredDate, setFilteredDate] = useState(getCurrentDate()); // Set current date as default
  const [filteredAttribute, setFilteredAttribute] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeShift, setActiveShift] = useState(0); // 0 = All shifts
  const [error, setError] = useState(null);
  const [uniqueAttributes, setUniqueAttributes] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchData();
      
      // Set current date as default only on first open
      if (isFirstOpen) {
        setFilteredDate(getCurrentDate());
        setIsFirstOpen(false);
      }
    } else if (!isOpen) {
      // Reset first open flag when modal is closed
      setIsFirstOpen(true);
    }
  }, [isOpen, patientId, isFirstOpen]);

  // Extract unique attribute names for the filter dropdown
  useEffect(() => {
    if (history.length > 0) {
      const attributes = [...new Set(history.map(item => item.attributeName))];
      setUniqueAttributes(attributes.sort());
    }
  }, [history]);

  const fetchData = async () => {
    if (!patientId) {
      setError("Patient ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Using the correct API endpoint
      const res = await fetch("https://nursingdemo-e2exe0gzhhhkcdea.eastus-01.azurewebsites.net/api/history");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      
      console.log("Fetched data:", data); // Debug log
      
      // Filter by patientId from metadata
      const filteredData = data.filter(item => {
        try {
          if (item.metadata) {
            const metadata = JSON.parse(item.metadata);
            return metadata.PatientId == patientId; 
          }
          return false;
        } catch (e) {
          console.error("Error parsing metadata:", e);
          return false;
        }
      });
      
      console.log(`Filtered data for patient ${patientId}:`, filteredData); // Debug log
      
      if (filteredData.length === 0) {
        console.warn(`No history data found for patient ${patientId}`);
      }
      
      setHistory(filteredData);
    } catch (error) {
      console.error("Error fetching change history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get the actual value, checking for initial value in metadata
  const getActualValue = (item) => {
    if (item.oldValue === "(initial value)" || item.oldValue === "()") {
      try {
        if (item.metadata) {
          const metadata = JSON.parse(item.metadata);
          if (metadata.InitialValue) {
            return metadata.InitialValue;
          }
        }
      } catch (e) {
        console.error("Error parsing metadata for initial value:", e);
      }
    }
    return item.oldValue || 'N/A';
  };

  const groupByDateAndShift = () => {
  // First filter by selected date and attribute if any
  let filtered = [...history]; // Create a copy to avoid mutation
  
  if (filteredDate) {
    // Create a date object from the filter date string
    // The filter date is already in local time (from the date picker)
    const [year, month, day] = filteredDate.split('-').map(Number);
    const filterDate = new Date(year, month - 1, day);
    
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.changeDate);
      return isSameDay(itemDate, filterDate);
    });
  }
  
  if (filteredAttribute) {
    filtered = filtered.filter(item => item.attributeName === filteredAttribute);
    console.log(`After attribute filter (${filteredAttribute}):`, filtered.length);
  }
  
  // Group by date first
  const dateGroups = {};
filtered.forEach((item) => {
  const utcDate = new Date(item.changeDate);
  // Convert to Atlantic Time
  const localDate = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
  const dateKey = localDate.toLocaleDateString();
  
  if (!dateGroups[dateKey]) {
    dateGroups[dateKey] = [];
  }
  dateGroups[dateKey].push(item);
});
  
  // Then for each date, group by shift
  const result = {};
  Object.entries(dateGroups).forEach(([date, items]) => {
    result[date] = {};
    
    // Initialize all shifts
    SHIFTS.forEach(shift => {
      result[date][shift.name] = [];
    });
    result[date]["Other"] = [];
    
    // Sort items into shifts
    items.forEach(item => {
      const shift = getShiftForDateTime(item.changeDate);
      result[date][shift].push(item);
    });
    
    // Remove empty shifts
    Object.keys(result[date]).forEach(shift => {
      if (result[date][shift].length === 0) {
        delete result[date][shift];
      }
    });
  });
  
  return result;
};

  const getShiftColor = (shiftName) => {
    const shift = SHIFTS.find(s => s.name === shiftName);
    return shift?.color || "#9E9E9E"; // Default gray for "Other"
  };

  const getDisplayAttributeName = (attributeName) => {
    return attributeNameMap[attributeName.toLowerCase()] || attributeName;
  };

  const groupedHistory = groupByDateAndShift();
  const dates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a)); // Sort dates newest first

  const handleShiftChange = (event, newValue) => {
    setActiveShift(newValue);
  };

  const handleAttributeChange = (event) => {
    setFilteredAttribute(event.target.value);
  };

  const handleClearFilters = () => {
    setFilteredDate("");
    setFilteredAttribute("");
  };

  const handleDetailsOpen = (itemId) => {
    setDetailsOpen(itemId);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(null);
  };

  
  const dialogProps = {
    open: isOpen,
    onClose,
    fullWidth: true,
    maxWidth: "md",
    disablePortal: true,
    keepMounted: false
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Patient History
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3, mt: 0.5 }}>
          <Grid item xs={12} md={5}>
            <TextField
              type="date"
              value={filteredDate}
              onChange={(e) => setFilteredDate(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              label="Filter by date"
              InputLabelProps={{ shrink: true }}
              // Show both raw and formatted date
              helperText={filteredDate ? (() => {
                try {
                  const parts = filteredDate.split('-');
                  if (parts.length === 3) {
                    const year = parts[0];
                    const month = new Date(filteredDate).toLocaleString('default', { month: 'short' });
                    const day = parseInt(parts[2], 10);
                    return `Showing records for ${month} ${day}, ${year} (${filteredDate})`;
                  }
                  return `Showing records for ${filteredDate}`;
                } catch (e) {
                  return `Showing records for ${filteredDate}`;
                }
              })() : ""}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="attribute-filter-label">Filter by attribute</InputLabel>
              <Select
                labelId="attribute-filter-label"
                value={filteredAttribute}
                onChange={handleAttributeChange}
                label="Filter by attribute"
              >
                <MenuItem value="">
                  <em>All attributes</em>
                </MenuItem>
                {uniqueAttributes.map((attr) => (
                  <MenuItem key={attr} value={attr}>
                    {getDisplayAttributeName(attr)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              fullWidth
              sx={{ height: '100%' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={activeShift}
            onChange={handleShiftChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Shifts" />
            {SHIFTS.map((shift, index) => (
              <Tab 
                key={shift.name}
                label={shift.name}
                icon={<AccessTimeIcon />}
                iconPosition="start"
                sx={{
                  '& .MuiTab-iconWrapper': {
                    color: shift.color
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" sx={{ p: 2 }}>
            Error loading data: {error}
          </Typography>
         ) : history.length === 0 ? (
          <Typography variant="body1" sx={{ p: 2 }}>No changes found for this patient.</Typography>
        ) : dates.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No records match the current filters. Try changing the date or attribute filter.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </Box>
        ) : (
          dates.map(date => (
            <Paper key={date} sx={{ mb: 3, p: 0, borderRadius: 2, overflow: 'hidden' }} elevation={2}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1.5 }}>
                <Typography variant="h6">
                  {formatDate(date)}
                </Typography>
              </Box>
              
              {Object.entries(groupedHistory[date])
                .filter(([shiftName]) => {
                  if (activeShift === 0) return true; // "All Shifts" selected
                  return shiftName === SHIFTS[activeShift - 1]?.name;
                })
                .map(([shiftName, records]) => (
                  <Box key={shiftName} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Chip 
                        label={shiftName}
                        size="small"
                        sx={{
                          bgcolor: getShiftColor(shiftName),
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1
                        }}
                      />
                      <Typography variant="subtitle2" color="text.secondary">
                        {shiftName === "Morning" ? "6 AM - 10 AM" :
                          shiftName === "Afternoon" ? "12 PM - 4 PM" :
                          shiftName === "Evening" ? "6 PM - 10 PM" : "Other Times"}
                      </Typography>
                    </Box>
                    
                    <List sx={{ pl: 1 }}>
                      {records.map((item, index) => (
                        <React.Fragment key={item.changeHistoryId || index}>
                          <ListItem sx={{ display: 'block', py: 1, px: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.entityType}: {getDisplayAttributeName(item.attributeName)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(item.changeDate)}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2">
                              Changed from: <Box component="span" sx={{ fontStyle: 'italic' }}>
                                {getActualValue(item)}
                              </Box>
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Updated by: Nurse {item.nurseId || 'Unknown'} via {item.source}
                              </Typography>
                              
                              {item.metadata && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<InfoIcon fontSize="small" />}
                                  onClick={() => handleDetailsOpen(item.changeHistoryId)}
                                  sx={{ minWidth: '100px', py: 0.5 }}
                                >
                                  View Details
                                </Button>
                              )}
                            </Box>
                            
                            {/* Details Dialog */}
                            {detailsOpen === item.changeHistoryId && (
                            <Dialog 
                              open={true} 
                              onClose={handleDetailsClose}
                              maxWidth="sm"
                              fullWidth
                            >
                              <DialogTitle>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="h6">Change Details</Typography>
                                  <IconButton edge="end" color="inherit" onClick={handleDetailsClose} aria-label="close">
                                    <CloseIcon />
                                  </IconButton>
                                </Box>
                              </DialogTitle>
                              <DialogContent dividers>
                                <Card variant="outlined" sx={{ mb: 2 }}>
                                  <CardContent>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                      {getDisplayAttributeName(item.attributeName)}
                                    </Typography>
                                    
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Old Value
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {getActualValue(item)}
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Changed By
                                      </Typography>
                                      <Typography variant="body1">
                                        {item.source === "System" ? "Nurse System" : `Nurse ${item.nurseId || 'Unknown'}`}
                                      </Typography>
                                    </Box>
                                    
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">
                                        Change Time
                                      </Typography>
                                      <Typography variant="body1">
                                        {(() => {
                                          try {
                                            // Parse the ISO date string
                                            const utcDate = new Date(item.changeDate);
                                            
                                            if (isNaN(utcDate.getTime())) {
                                              return "Unknown time";
                                            }
                                            
                                            // Manually adjust for Atlantic Daylight Time (UTC-3)
                                            const localTime = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
                                            
                                            // Format the date and time
                                            return localTime.toLocaleString([], {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            });
                                          } catch (error) {
                                            console.error(`Error formatting change time: ${item.changeDate}`, error);
                                            return "Unknown time";
                                          }
                                        })()}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                                
                                {/* Optional Advanced Details (collapsed by default) */}
                                <Accordion sx={{ mb: 1 }}>
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="subtitle2">Advanced Details</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                          Entity Type
                                        </Typography>
                                        <Typography variant="body2">
                                          {item.entityType === "Adl" ? "Patient Daily Record" : 
                                          item.entityType === "Profile" ? "Patient Profile" :
                                          item.entityType === "Elimination" ? "Elimination Record" :
                                          item.entityType === "Nutrition" ? "Nutrition Record" :
                                          item.entityType === "Cognitive" ? "Cognitive Assessment" :
                                          item.entityType === "Behaviour" ? "Behaviour Record" :
                                          item.entityType === "MobilitySafety" ? "Mobility & Safety" :
                                          item.entityType === "SensoryAidsSkin" ? "Sensory Aids & Skin" :
                                          item.entityType}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                          Operation
                                        </Typography>
                                        <Typography variant="body2">
                                          {item.operation === "INSERT" ? "Added" :
                                          item.operation === "UPDATE" ? "Updated" :
                                          item.operation === "DELETE" ? "Removed" :
                                          item.operation}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                          Source
                                        </Typography>
                                        <Typography variant="body2">
                                          {item.source}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                                
                                {item.metadata && (
                                  <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                      <Typography variant="subtitle2">Metadata</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Box
                                        sx={{
                                          bgcolor: 'grey.50',
                                          p: 1.5,
                                          borderRadius: 1,
                                          maxHeight: '200px',
                                          overflow: 'auto'
                                        }}
                                      >
                                        {(() => {
                                          try {
                                            const metadata = JSON.parse(item.metadata);
                                            // Filter out technical fields that users don't need to see
                                            const userFriendlyFields = Object.entries(metadata).filter(
                                              ([key]) => !['PatientId', 'InitialValue', 'RawTimestamp'].includes(key)
                                            );
                                            if (typeof value === 'string' && 
                                                  (value.includes('T') || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(value))) {
                                                try {
                                                  const utcDate = new Date(value);
                                                  if (!isNaN(utcDate.getTime())) {
                                                    // Manually adjust for Atlantic Daylight Time (UTC-3)
                                                    const localTime = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
                                                    
                                                    displayValue = localTime.toLocaleString([], {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                    });
                                                  } else {
                                                    displayValue = value;
                                                  }
                                                } catch (e) {
                                                  // If date parsing fails, use the original value
                                                  displayValue = value;
                                                }
                                              }
                                            
                                            return (
                                              <Grid container spacing={1}>
                                                {userFriendlyFields.map(([key, value]) => {
                                                  // Format dates if the value looks like a date
                                                  let displayValue = value;
                                                  if (typeof value === 'string' && 
                                                      (value.includes('T') || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(value))) {
                                                    try {
                                                      displayValue = new Date(value).toLocaleString([], {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                      });
                                                    } catch (e) {
                                                      // If date parsing fails, use the original value
                                                      displayValue = value;
                                                    }
                                                  }
                                                  
                                                  return (
                                                    <Grid item xs={12} key={key}>
                                                      <Typography variant="caption" color="text.secondary">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()} {/* Add spaces before capital letters */}
                                                      </Typography>
                                                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                        {displayValue !== null && displayValue !== undefined ? 
                                                          displayValue.toString() : 'N/A'}
                                                      </Typography>
                                                    </Grid>
                                                  );
                                                })}
                                              </Grid>
                                            );
                                          } catch (e) {
                                            return (
                                              <Typography variant="body2">
                                                {item.metadata}
                                              </Typography>
                                            );
                                          }
                                        })()}
                                      </Box>
                                    </AccordionDetails>
                                  </Accordion>
                                )}
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleDetailsClose} color="primary" variant="contained">
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
                            )}
                          </ListItem>
                          {index < records.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                ))}
            </Paper>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary"
          tabIndex={0}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistoryModal;