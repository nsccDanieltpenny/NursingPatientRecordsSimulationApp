import React from 'react';
import { Box, Card, Typography } from '@mui/material';



const LabelValue = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value || 'N/A'}</Typography>
  </Box>
);

const MedicalInfoCard = ({ patientData }) => {
  if (!patientData) return null;

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

      <LabelValue label="Admission Date" value={patientData.admissionDate} />
      <LabelValue 
        label="Roam Alert Bracelet" 
        value={patientData.roamAlertBracelet ? '⚠️ Yes' : 'No'} 
      />

      {patientData.allergies && (
        <Box sx={{ 
          backgroundColor: 'warning.light', 
          borderRadius: '8px',
          padding: '12px',
          mb: 2
        }}>
          <LabelValue 
            label="Allergies" 
            value={patientData.allergies} 
          />
        </Box>
      )}

      <LabelValue 
        label="Isolation Precautions" 
        value={patientData.isolationPrecautions} 
      />
      <LabelValue 
        label="Medical History" 
        value={patientData.medicalHistory} 
      />
    </Card>
  );
};

export default MedicalInfoCard;