import React from 'react';
import { Card, Box, Typography } from '@mui/material';

const LabelValue = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value || 'N/A'}</Typography>
  </Box>
);

const PatientInfoCard = ({ patientData }) => {
  if (!patientData) return null;

  const imgUrl = patientData.imageFilename
    ? `http://localhost:5232/images/${patientData.imageFilename}`
    : '/default-patient.png';

  return (
    <Card sx={{
      borderRadius: '12px',
      mb: 2,
      padding: '16px',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      {/* Patient Photo */}
      <Box sx={{
        width: { xs: '100%', md: '40%' },
        paddingRight: { md: '16px' },
        mb: { xs: 2, md: 0 }
      }}>
        <img
          src={imgUrl}
          alt="Patient"
          style={{
            width: '100%',
            borderRadius: '8px',
            aspectRatio: '1',
            objectFit: 'cover',
            maxHeight: '300px'
          }}
          onError={(e) => {
            e.target.src = '/default-patient.png';
          }}
        />
      </Box>

      {/* Patient Information */}
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        <Typography variant="h5" sx={{
          fontWeight: 600,
          mb: 2,
          color: 'primary.main'
        }}>
          {patientData.fullName}
        </Typography>

        <LabelValue label="DOB" value={patientData.dob} />
        <LabelValue label="Sex" value={patientData.sex} />
        <LabelValue label="Marital Status" value={patientData.maritalStatus} />
        <LabelValue label="Height" value={`${patientData.height} cm`} />
        <LabelValue label="Weight" value={`${patientData.weight} kg`} />
        <LabelValue label="Next of Kin" value={patientData.nextOfKin} />
        <LabelValue label="Next of kin phone" value={patientData.nextOfKinPhone} />
      </Box>
    </Card>
  );
};

export default PatientInfoCard;