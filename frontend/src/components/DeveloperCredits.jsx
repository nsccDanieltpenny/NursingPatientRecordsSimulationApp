import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar, 
  Collapse,
  Divider
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CloseIcon from '@mui/icons-material/Close';

const developers = [
  { name: "Tsira Mamaladze", role: "Project Manager, Frontend Developer, QA" },
  { name: "Katelyn Clements", role: "UI Designer, Frontend Developer" },
  { name: "Mitchell Yetman", role: "Backend Developer, QA" },
  { name: "Dylan Cunningham", role: "UI/UX Design/Development, Frontend Development, DevOps"},
  { name: "Hannah Osmond", role: "Full-Stack Developer, QA"},
  { name: "Kangjie Su", role: "Database Designer, Backend Developer, DevOps"}
  
];

const DeveloperCredits = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Collapse in={expanded} orientation="horizontal" collapsedSize={0}>
        <Paper
          elevation={6}
          sx={{
            p: 2,
            maxWidth: 300,
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 71, 128, 0.9)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
              Development Team
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setExpanded(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
          
          <Box sx={{ 
            maxHeight: 500, 
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
            },
          }}>
            {developers.map((dev, index) => (
              <Box 
                key={index} 
                display="flex" 
                alignItems="center" 
                gap={2} 
                py={1}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: '#FFD700',
                  color: '#004780',
                  fontWeight: 'bold'
                }}>
                  {dev.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {dev.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {dev.role}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Collapse>
      
      {!expanded && (
        <IconButton
          onClick={() => setExpanded(true)}
          sx={{
            backgroundColor: '#004780',
            color: 'white',
            '&:hover': {
              backgroundColor: '#003366',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            width: 34,
            height: 34,
          }}
        >
          <PeopleAltIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default DeveloperCredits;