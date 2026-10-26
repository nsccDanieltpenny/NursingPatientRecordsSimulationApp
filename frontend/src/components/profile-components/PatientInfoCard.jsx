import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Edit, Save, Close, PhotoCamera } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import PatientHistoryModal from "../common/PatientHistoryModal";
import {
  uploadPatientImage,
  updatePatientImage,
  deletePatientImage,
  getPatientImageUrl
} from '../../utils/api';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];


const EditableField = ({ label, value, onSave, format }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
    //alert state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  //error validation state
  const [error, setError] = useState('');
  //function to check if the date is in the correct format, 
  //cannot be >120 years old or <0 years old
  const validateDOB = (dateStr) => {
    const enteredDate = new Date(dateStr);
    const today = new Date();
    const oldestDate = new Date();

    oldestDate.setFullYear(today.getFullYear() - 120);

    if (isNaN(enteredDate.getTime())) {
      return "Invalid date format. Must be YYYY-MM-DD";
    }

    if (enteredDate > today) {
      return "Date cannot be in the future";
    }

    if (enteredDate < oldestDate) {
      //sorry jeanne calment, but you are not a patient here --
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
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
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
      ) : (
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

const PatientInfoCard = ({ patientData, onPatientUpdate, patientImageUrl, role }) => {
  const { id } = useParams();
  const [localData, setLocalData] = useState(patientData);
  const [originalData, setOriginalData] = useState(patientData);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Patient photo (admins can add or replace it; saved straight away)
  const isAdmin = role[0] === 'Admin';
  const [imageUrl, setImageUrl] = useState(patientImageUrl);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    setImageUrl(patientImageUrl);
  }, [patientImageUrl]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const hasChanges = JSON.stringify(localData) !== JSON.stringify(originalData);

  const handleFieldUpdate = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!hasChanges) {
      setSnackbar({
        open: true,
        message: 'Patient information successfully saved.',
        severity: 'info'
      });
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(`patient-profile-${id}`, JSON.stringify(localData));
      setOriginalData(localData);
      setSnackbar({
        open: true,
        message: 'Changes successfully saved.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Save failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save.',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openPhotoDialog = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setPhotoError('');
    setPhotoDialogOpen(true);
  };

  const closePhotoDialog = () => {
    if (isUploadingPhoto) return;
    setPhotoDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setPhotoError('');
  };

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError('Please choose a JPG, PNG, WEBP or GIF image.');
      return;
    }

    setPhotoError('');
    setSelectedFile(file);

    // Preview as a data: URL. The CSP allows data: images but not blob: URLs.
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.onerror = () => setPhotoError('That image could not be previewed. Please try another file.');
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;
    setIsUploadingPhoto(true);
    try {
      // 1. Upload the new image to blob storage
      const upload = await uploadPatientImage(selectedFile);
      const newFilename = upload.fileName;

      // 2. Point the patient at it in the database
      const result = await updatePatientImage(id, newFilename);
      const previousFilename = result?.previousImageFilename;

      // 3. Show the new image
      setLocalData(prev => ({ ...prev, imageFilename: newFilename }));
      setOriginalData(prev => ({ ...prev, imageFilename: newFilename }));
      const urlResponse = await getPatientImageUrl(newFilename);
      setImageUrl(urlResponse.url);

      // 4. Remove the old image last, so a failure above never leaves a missing file
      if (previousFilename && previousFilename !== newFilename) {
        try {
          await deletePatientImage(previousFilename);
        } catch (deleteError) {
          console.warn('Old patient image could not be deleted:', deleteError);
        }
      }

      setPhotoDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setSnackbar({ open: true, message: 'Patient photo updated.', severity: 'success' });
    } catch (error) {
      console.error('Patient photo update failed:', error);
      setPhotoError('The photo could not be saved. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const imgUrl = localData.imageFilename && imageUrl
    ? imageUrl
    : '/default-patient.png';

  return (
    <Card sx={{
      borderRadius: '12px',
      mb: 2,
      padding: '10px',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: '100%',
      height: 'auto',
      overflow: 'visible',
      flexShrink: 0,
    }}>
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
        {isAdmin && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PhotoCamera />}
            onClick={openPhotoDialog}
            sx={{ mt: 1, width: '100%' }}
          >
            {localData.imageFilename ? 'Change photo' : 'Add photo'}
          </Button>
        )}
      </Box>

      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 2,
          color: 'primary.main'
        }}>
          {localData.fullName.toUpperCase()}
        </Typography>

        {role[0] === 'Admin' ? (
          <>
            <EditableField
              label="DOB"
              value={localData.dob}
              onSave={(value) => handleFieldUpdate('dob', value)}
            />
            <EditableField
              label="Birth Gender"
              value={localData.sex}
              onSave={(value) => handleFieldUpdate('sex', value)}
            />
            <EditableField
              label="Marital Status"
              value={localData.maritalStatus}
              onSave={(value) => handleFieldUpdate('maritalStatus', value)}
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
            <EditableField
              label="Weight (lbs)"
              value={localData.weight}
              onSave={(value) => handleFieldUpdate('weight', value)}
              format="lbs"
            />
            <EditableField
              label="Height (cm)"
              value={localData.height}
              onSave={(value) => handleFieldUpdate('height', value)}
              format="cm"
            />

            {/*Acute Care information*/}
            {localData.admittingDiagnosis &&             
              <EditableField
                label="Admitting Diagnosis"
                value={localData.admittingDiagnosis}
                onSave={(value) => handleFieldUpdate('admittingDiagnosis', value)}
              />
            }
            {localData.currentIllness && 
              <EditableField
                label="Current Illness"
                value={localData.currentIllness}
                onSave={(value) => handleFieldUpdate('currentIllness', value)}
              />
            }
          </>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">DOB</Typography>
              <Typography variant="body1">{originalData.dob || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Birth Gender</Typography>
              <Typography variant="body1">{originalData.sex || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Marital Status</Typography>
              <Typography variant="body1">{originalData.maritalStatus || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Next of Kin</Typography>
              <Typography variant="body1">{originalData.nextOfKin || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Contact Phone</Typography>
              <Typography variant="body1">{originalData.nextOfKinPhone || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Weight (lbs)</Typography>
              <Typography variant="body1">{originalData.weight || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Height (cm)</Typography>
              <Typography variant="body1">{originalData.height || 'N/A'}</Typography>
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              minWidth: 140,
              py: 1
            }}
          >
            View History
          </Button>

          {role[0] === 'Admin' &&  
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              sx={{
                minWidth: 140,
                py: 1,
                fontWeight: hasChanges ? 'bold' : 'normal',
                backgroundColor: hasChanges ? undefined : '#e0e0e0',
                color: hasChanges ? undefined : 'text.secondary',
                '&:hover': {
                  backgroundColor: hasChanges ? undefined : '#e0e0e0'
                }
              }}
            >
              {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          }
        </Box>
      </Box>

      <Dialog open={photoDialogOpen} onClose={closePhotoDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{localData.imageFilename ? 'Change patient photo' : 'Add patient photo'}</DialogTitle>
        <DialogContent>
          <Box sx={{
            width: '100%',
            aspectRatio: '1',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            {previewUrl ? (
              <img src={previewUrl} alt="New patient photo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : localData.imageFilename ? (
              <img src={imgUrl} alt="Current patient photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Typography variant="body2" color="textSecondary">No Photo</Typography>
            )}
          </Box>
          <Button variant="outlined" component="label" fullWidth disabled={isUploadingPhoto}>
            {selectedFile ? 'Choose a different image' : 'Choose image'}
            <input hidden type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={handlePhotoSelected} />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {selectedFile.name}
            </Typography>
          )}
          {photoError && (
            <Alert severity="error" sx={{ mt: 2 }}>{photoError}</Alert>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            The photo is saved as soon as you click Save photo. JPG, PNG, WEBP or GIF.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePhotoDialog} disabled={isUploadingPhoto}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePhoto}
            disabled={!selectedFile || isUploadingPhoto}
            startIcon={isUploadingPhoto ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isUploadingPhoto ? 'Saving...' : 'Save photo'}
          </Button>
        </DialogActions>
      </Dialog>

      <PatientHistoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patientId={id}
      />

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
    </Card>
  );
};

export default PatientInfoCard;