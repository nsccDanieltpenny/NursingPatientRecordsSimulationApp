import React, { useState } from 'react';
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


const EditableField = ({ label, value, onSave, format }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  //once user has saved their changes, switch editing flag to false
  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  return (
    // This box component is a mess but it works lol *shrug*

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
            onChange={(e) => setEditValue(e.target.value)}
            size="small"
            fullWidth
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

const PatientInfoCard = ({ patientData, onPatientUpdate }) => {
  const [localData, setLocalData] = useState(patientData);

  /**
   *  updates a field in `localData` with a new value and triggers an
   * `onPatientUpdate` callback if provided.
   */
  const handleFieldUpdate = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    console.log(updatedData);
    if (onPatientUpdate) onPatientUpdate(updatedData);
  };

  if (!localData) return null;

  const imgUrl = localData.imageFilename
    ? `http://localhost:5232/images/${localData.imageFilename}`
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
        width: { xs: '100%', md: '30%' }, // Adjusted width
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
              src={`http://localhost:5232/images/${localData.imageFilename}`}
              alt="Patient"
              style={{
                width: '100%',
                height: '100%',
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
      </Box>
    </Card>
  );
};

export default PatientInfoCard;