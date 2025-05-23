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
  FormHelperText,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import api from '../../utils/api';

// Define the three main shifts with their time ranges (in 24-hour format)
const SHIFTS = [
  { name: "Morning", start: 6, end: 12, color: "#FFB74D" },  
  { name: "Afternoon", start: 12, end: 18, color: "#64B5F6" }, 
  { name: "Evening", start: 18, end: 24, color: "#9575CD" }    
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

// Constants
const TIMEZONE_OFFSET = 3; // Atlantic Daylight Time (UTC-3)

// Helper function to convert UTC date to Atlantic Time
function utcToAtlantic(utcDate) {
  if (!utcDate || isNaN(utcDate.getTime())) return null;
  return new Date(utcDate.getTime() - (TIMEZONE_OFFSET * 60 * 60 * 1000));
}

// Format time (HH:MM AM/PM)
function formatTime(dateStr) {
  try {
    const utcDate = new Date(dateStr);
    if (isNaN(utcDate.getTime())) return "Unknown time";
    
    const atlanticDate = utcToAtlantic(utcDate);
    return atlanticDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error(`Error formatting time: ${error.message}`);
    return "Unknown time";
  }
}

// Format date (Month Day, Year)
function formatDate(dateStr) {
  try {
    const utcDate = new Date(dateStr);
    if (isNaN(utcDate.getTime())) return "Unknown date";
    
    const atlanticDate = utcToAtlantic(utcDate);
    return atlanticDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date: ${error.message}`);
    return "Unknown date";
  }
}

// Format date for input (YYYY-MM-DD)
function formatDateForInput(date) {
  try {
    if (!date || isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error(`Error formatting date for input: ${error.message}`);
    return '';
  }
}

// Get current date formatted for input
const getCurrentDate = () => {
  return formatDateForInput(new Date());
};

// Get shift for a given date/time
function getShiftForDateTime(dateStr) {
  try {
    const utcDate = new Date(dateStr);
    if (isNaN(utcDate.getTime())) return "Other";
    
    const atlanticDate = utcToAtlantic(utcDate);
    const hour = atlanticDate.getHours();
    
    return SHIFTS.find((s) => hour >= s.start && hour < s.end)?.name || "Other";
  } catch (error) {
    console.error(`Error determining shift: ${error.message}`);
    return "Other";
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
    const fetchData = async () => {
      if (!patientId) {
        setError("Patient ID is required");
        return;
      }
  
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/api/history");
        
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
        
        if (filteredData.length === 0) {
          console.warn(`No history data found for patient ${patientId}`);
        }
        
        setHistory(filteredData);
      } catch (error) {
        console.error("Error fetching change history:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

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

  // Group history items by date and shift
const groupByDateAndShift = () => {
  // Start with all history items
  let filtered = [...history];
  
  // Apply date filter if selected
  if (filteredDate) {
    const [filterYear, filterMonth, filterDay] = filteredDate.split('-').map(Number);
    
    filtered = filtered.filter(item => {
      const itemUtcDate = new Date(item.changeDate);
      if (isNaN(itemUtcDate.getTime())) return false;
      
      const itemAtlanticDate = utcToAtlantic(itemUtcDate);
      if (!itemAtlanticDate) return false;
      
      // Check if the Atlantic date matches the filter date
      return (
        itemAtlanticDate.getFullYear() === filterYear &&
        itemAtlanticDate.getMonth() === filterMonth - 1 && // JavaScript months are 0-based
        itemAtlanticDate.getDate() === filterDay
      );
    });
  }
  
  // Apply attribute filter if selected
  if (filteredAttribute) {
    filtered = filtered.filter(item => item.attributeName === filteredAttribute);
  }
  
  // Create result object
  const result = {};
  
  // If we have filtered items and a date filter, group them
  if (filtered.length > 0 && filteredDate) {
    // Use the filter date as the key
    const [year, month, day] = filteredDate.split('-').map(Number);
    const filterDateObj = new Date(year, month - 1, day);
    
    // Format the date for display
    const displayDate = filterDateObj.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Initialize the result with the filter date
    result[displayDate] = {};
    
    // Initialize all shifts
    SHIFTS.forEach(shift => {
      result[displayDate][shift.name] = [];
    });
    result[displayDate]["Other"] = [];
    
    // Sort items into shifts
    filtered.forEach(item => {
      const shift = getShiftForDateTime(item.changeDate);
      result[displayDate][shift].push(item);
    });
    
    // Remove empty shifts
    Object.keys(result[displayDate]).forEach(shift => {
      if (result[displayDate][shift].length === 0) {
        delete result[displayDate][shift];
      }
    });
  } else if (filtered.length > 0) {
    // If we have items but no date filter, group by their actual dates
    filtered.forEach(item => {
      const utcDate = new Date(item.changeDate);
      const atlanticDate = utcToAtlantic(utcDate);
      if (!atlanticDate) return;
      
      // Format the date for display
      const displayDate = atlanticDate.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Initialize date group if it doesn't exist
      if (!result[displayDate]) {
        result[displayDate] = {};
        SHIFTS.forEach(shift => {
          result[displayDate][shift.name] = [];
        });
        result[displayDate]["Other"] = [];
      }
      
      // Add item to the appropriate shift
      const shift = getShiftForDateTime(item.changeDate);
      result[displayDate][shift].push(item);
    });
    
    // Remove empty shifts
    Object.keys(result).forEach(dateKey => {
      Object.keys(result[dateKey]).forEach(shift => {
        if (result[dateKey][shift].length === 0) {
          delete result[dateKey][shift];
        }
      });
    });
  }
  
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
  setFilteredDate('');
  setFilteredAttribute('');
  setActiveShift(0); // Reset to "All Shifts"
  
  // Force a re-render of the grouped history
  setHistory([...history]); 
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
              slotProps={{
                inputLabel: { shrink: true }
              }}
              /**  helperText={filteredDate ? (() => {
                  try {
                    const [year, month, day] = filteredDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return `Showing records for ${date.toLocaleDateString([], {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} (${filteredDate})`;
                  } catch (e) {
                    return `Showing records for ${filteredDate}`;
                  }
                })() : ""} */
            />
          </Grid>

          <Grid item xs={12} md={5}>
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

              {/* Add an invisible helper text to maintain consistent height */}
              <FormHelperText sx={{ visibility: 'hidden' }}>Placeholder</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              fullWidth
                sx={{ 
                height: '38px', 
                alignSelf: 'flex-start', 
                mt: '0px' 
              }}
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

          ) : !filteredDate && !filteredAttribute ? (
            // Show a message when no filters are applied
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please select a date or attribute filter to view patient history.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can filter by date, attribute, or both to narrow down the results.
              </Typography>
            </Box>

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
                    {date}
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
                          {shiftName === "Morning" ? "6 AM - 12 AM" :
                            shiftName === "Afternoon" ? "12 PM - 6 PM" :
                            shiftName === "Evening" ? "6 PM - 12 PM" : "Other Times"}
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
                                  Updated by: Nurse {item.nurseId || 'Unknown'} 
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
                                      </Grid>
                                    </AccordionDetails>
                                  </Accordion>                           
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

PatientHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patientId: PropTypes.string.isRequired
};

export default PatientHistoryModal;
