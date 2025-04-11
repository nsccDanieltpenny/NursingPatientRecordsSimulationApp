import React, { useEffect, useState } from 'react';
import { Card, Box, Typography } from '@mui/material';

const LabelValue = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value || 'N/A'}</Typography>
  </Box>
);

const PatientInfoCard = ({ patientData }) => {
  const [patientInfo, setPatientInfo] = useState(patientData);

  // Load data from localStorage based on patient ID
  useEffect(() => {
    if (patientData && patientData.id) {
      const savedData = JSON.parse(localStorage.getItem(`patientInfo-${patientData.id}`));
      if (savedData) {
        setPatientInfo(savedData);
      }
    }
  }, [patientData]);

  // Save data to localStorage based on patient ID
  useEffect(() => {
    if (patientInfo && patientInfo.id) {
      localStorage.setItem(`patientInfo-${patientInfo.id}`, JSON.stringify(patientInfo));
    }
  }, [patientInfo]);

  if (!patientInfo) return null;

  const imgUrl = patientInfo.imageFilename
    ? `http://localhost:5232/images/${patientInfo.imageFilename}`
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
          {patientInfo.fullName}
        </Typography>

        <LabelValue label="DOB" value={patientInfo.dob} />
        <LabelValue label="Sex" value={patientInfo.sex} />
        <LabelValue label="Marital Status" value={patientInfo.maritalStatus} />
        <LabelValue label="Height" value={`${patientInfo.height} cm`} />
        <LabelValue label="Weight" value={`${patientInfo.weight} kg`} />
        <LabelValue label="Next of Kin" value={patientInfo.nextOfKin} />
        <LabelValue label="Next of kin phone" value={patientInfo.nextOfKinPhone} />
      </Box>
    </Card>
  );
};

export default PatientInfoCard;