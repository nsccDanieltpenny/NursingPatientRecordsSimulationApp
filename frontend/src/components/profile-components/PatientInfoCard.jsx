import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Edit, Save, Close } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';


const EditableField = ({ label, value, onSave, format }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  //error validation state
  const [error, setError] = useState('');
    //function to check if the date is in the correct format, 
  //cannot be >120 years old or <0 years old
  const validateDOB = (dateStr) => {
    const enteredDate = new Date(dateStr);
    const today = new Date();
    const oldestDate= new Date();
    
    oldestDate.setFullYear(today.getFullYear() - 120);

    if (isNaN(enteredDate.getTime())) {
      return "Invalid date format. Must be YYYY-MM-DD";
    }

    if (enteredDate > today) {
      return "Date cannot be in the future";
    }

    if (enteredDate < oldestDate) {
      //sorry jeanne calment, but you are not a patient here
      return "Date cannot be more than 120 years ago";
    }
    return ""; // No error

  }
  //once user has saved their changes, switch editing flag to false
  const handleSave = () => {


    if (label === 'DOB') {
      const errorMessage = validateDOB(editValue);
      if (errorMessage) {
        setError(errorMessage);
        return;
      } 
    }

    setError(''); 
    onSave(editValue);
    setIsEditing(false);
  };

  return (

    // I'm using conditional rendering (look for the ternary operator), this basically
    // decides which version of the interface to show. If editing is true, then use the
    // editing component, if false, use basic one. 

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>

      {/* Renders the editing interface when the `isEditing` state is true. */}
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)
            }
            size="small"
            fullWidth
            error={!!error}
            helperText={error}
            slotProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {format && <Typography variant="caption">{format}</Typography>}
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={handleSave} color="primary">
            <Save fontSize="small" />
          </IconButton>

          <IconButton onClick={() => setIsEditing(false)}>
            <Close fontSize="small" />
          </IconButton>

        </Box>
      )
        :
        (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">{value || 'N/A'}</Typography>
            <IconButton
              onClick={() => setIsEditing(true)}
              size="small"
              sx={{ ml: 1 }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>
        )}
    </Box>
  );
};

const PatientInfoCard = ({ patientData, onPatientUpdate, patientImageUrl }) => {
  const { id } = useParams();
  const [localData, setLocalData] = useState(patientData);
  const [originalData, setOriginalData] = useState(patientData);
  const [isSaving, setIsSaving] = useState(false);

  //load saved data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem(`patient-profile-${id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setLocalData(parsedData);
      setOriginalData(parsedData); // Set original data for comparison
    }
  }, [id]);

  // Check if there are changes
  const hasChanges = JSON.stringify(localData) !== JSON.stringify(originalData);

  const handleFieldUpdate = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Saves changes to a patient profile data in local storage and provides
   * feedback to the user.
   * @returns Returns nothing (`undefined`) explicitly, but it may return
   * early with a `return` statement if there are no changes to save.
   */
  const handleSave = () => {
    if (!hasChanges) {
      alert('No changes to save');
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(`patient-profile-${id}`, JSON.stringify(localData));
      setOriginalData(localData); // Update original data after save
      alert('Changes saved!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  const imgUrl = localData.imageFilename
    ? patientImageUrl
    : '/default-patient.png';

  return (
    <Card sx={{
      borderRadius: '12px',
      mb: 2,
      padding: '16px',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }
    }}>

      {/* Placeholder square if there is no image */}
      <Box sx={{
        width: { xs: '100%', md: '30%' },
        minWidth: { xs: '100%', md: '250px' },
        paddingRight: { md: '12px' },
        mb: { xs: 2, md: 0 }
      }}>
        <Box sx={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* conditionally render if there is a photo, else use placeholder */}
          {localData.imageFilename ? (
            <img
              src={imgUrl}
              alt="Patient"
              style={{
                width: '250px',
                height: '250px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = '/default-patient.png';
              }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Photo
            </Typography>
          )}
        </Box>
      </Box>

      {/* Patient Information */}
      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 2,
          color: 'primary.main'
        }}>
          {localData.fullName}
        </Typography>

        <EditableField
          label="DOB"
          value={localData.dob}
          onSave={(value) => handleFieldUpdate('dob', value)}
        />
        <EditableField
          label="Sex"
          value={localData.sex}
          onSave={(value) => handleFieldUpdate('sex', value)}
        />
        <EditableField
          label="Marital Status"
          value={localData.maritalStatus}
          onSave={(value) => handleFieldUpdate('maritalStatus', value)}
        />
        <EditableField
          label="Height (cm)"
          value={localData.height}
          onSave={(value) => handleFieldUpdate('height', value)}
          format="cm"
        />
        <EditableField
          label="Weight (kg)"
          value={localData.weight}
          onSave={(value) => handleFieldUpdate('weight', value)}
          format="kg"
        />
        <EditableField
          label="Next of Kin"
          value={localData.nextOfKin}
          onSave={(value) => handleFieldUpdate('nextOfKin', value)}
        />
        <EditableField
          label="Contact Phone"
          value={localData.nextOfKinPhone}
          onSave={(value) => handleFieldUpdate('nextOfKinPhone', value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          sx={{
            mt: 2,
            fontWeight: hasChanges ? 'bold' : 'normal',
            backgroundColor: hasChanges ? undefined : '#e0e0e0',
            color: hasChanges ? undefined : 'text.secondary',
            '&:hover': {
              backgroundColor: hasChanges ? undefined : '#e0e0e0' //stays grey on hover :D
            }
          }}
        >
          {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
        </Button>
      </Box>

    </Card>
  );
};

export default PatientInfoCard;