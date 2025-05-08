import React, { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';

const LabelValue = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value || 'N/A'}</Typography>
  </Box>
);

const MedicalInfoCard = ({ patientData }) => {
  const [medicalInfo, setMedicalInfo] = useState(patientData);

  // Load data from localStorage based on patient ID
  useEffect(() => {
    if (patientData && patientData.id) {
      const savedData = JSON.parse(localStorage.getItem(`medicalInfo-${patientData.id}`));
      if (savedData) {
        setMedicalInfo(savedData);
      }
    }
  }, [patientData]);

  // Save data to localStorage based on patient ID
  useEffect(() => {
    if (medicalInfo && medicalInfo.id) {
      localStorage.setItem(`medicalInfo-${medicalInfo.id}`, JSON.stringify(medicalInfo));
    }
  }, [medicalInfo]);

  if (!medicalInfo) return null;

  return (
    <Card sx={{
      borderRadius: '12px',
      padding: '16px',
      mt: 2
    }}>
      <Typography variant="h6" sx={{
        fontWeight: 500,
        mb: 2,
        color: 'text.primary'
      }}>
        Medical Information
      </Typography>

      <LabelValue label="Admission Date" value={medicalInfo.admissionDate} />
      <LabelValue 
        label="Roam Alert Bracelet" 
        value={medicalInfo.roamAlertBracelet ? 'Yes' : 'No'} 
      />

      {medicalInfo.allergies && (
        <Box sx={{
          backgroundColor: 'warning.light',
          borderRadius: '8px',
          padding: '12px',
          mb: 2,
          marginLeft: '-7px', //adjusted margin to align with other fields lol
        }}>
          <LabelValue 
            label="Allergies" 
            value={medicalInfo.allergies} 
          />
        </Box>
      )}

      <LabelValue 
        label="Isolation Precautions" 
        value={medicalInfo.isolationPrecautions} 
      />
      <LabelValue 
        label="Medical History" 
        value={medicalInfo.medicalHistory} 
      />
    </Card>
  );
};

export default MedicalInfoCard;