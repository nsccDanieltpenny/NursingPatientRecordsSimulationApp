import React from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  Restaurant as NutritionIcon,
  Wc as EliminationIcon,
  DirectionsWalk as MobilityIcon,
  Checklist as ADLIcon,
  Psychology as CognitiveIcon,
  Security as SafetyIcon,
  Hearing as SensoryAidsIcon,
  Note as NoteIcon,
  ChevronRight as ChevronRightIcon,
  Mood as MoodIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentRoutes } from '../../utils/routeConfig';

const AssessmentsCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Define the assessments with their corresponding route keys
  const assessmentMapping = [
    { display: 'Nutrition', routeKey: 'Nutrition' },
    { display: 'Elimination', routeKey: 'Elimination' },
    { display: 'Mobility', routeKey: 'Mobility' },
    { display: 'ADL', routeKey: 'ADL' },
    { display: 'Cognitive', routeKey: 'Cognitive' },
    { display: 'Safety', routeKey: 'Safety' },
    { display: 'Sensory Aids / Prosthesis / Skin Integrity', routeKey: 'SkinSensoryAid' },
    { display: 'Behaviour/Mood', routeKey: 'Behaviour' },
    { display: 'Progress Note', routeKey: 'ProgressNote' },
  ];

  const iconMap = {
    'Nutrition': <NutritionIcon color="primary" />,
    'Elimination': <EliminationIcon color="primary" />,
    'Mobility': <MobilityIcon color="primary" />,
    'ADL': <ADLIcon color="primary" />,
    'Cognitive': <CognitiveIcon color="primary" />,
    'Safety': <SafetyIcon color="primary" />,
    'Sensory Aids / Prosthesis / Skin Integrity': <SensoryAidsIcon color="primary" />,
    'Behaviour/Mood': <MoodIcon color="primary" />,
    'Progress Note': <NoteIcon color="primary" />
  };

  const handleNavigation = (routeKey) => {
    const routeTemplate = assessmentRoutes[routeKey];
    if (!routeTemplate) {
      console.error(`No route defined for ${routeKey}`);
      return;
    }
    navigate(routeTemplate.replace(':id', id));
  };
  
  console.log('AssessmentsCard component loaded');
  
  return (
    <Card sx={{
      borderRadius: '12px',
      padding: '16px',
      height: '100%',
      backgroundColor: 'background.paper'
    }}>
      <Typography variant="h6" sx={{
        fontWeight: 600,
        mb: 2,
        color: 'text.primary'
      }}>
        Patient Assessments
      </Typography>
      <List disablePadding>
        {assessmentMapping.map((assessment) => (
          <ListItem
            key={assessment.display}
            button
            onClick={() => handleNavigation(assessment.routeKey)}
            sx={{
              py: 2.5,
              mb: 1,
              borderRadius: '8px',
              transition: 'transform 0.2s',
              '&:hover': { backgroundColor: 'action.hover' },
              '&:active': { 
                transform: 'scale(0.98)',
                backgroundColor: 'action.selected'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              {iconMap[assessment.display] || <NoteIcon color="disabled" />}
            </ListItemIcon>
            <ListItemText 
              primary={assessment.display}
              primaryTypographyProps={{ fontSize: '1rem' }}
            />
            <ChevronRightIcon fontSize="small" color="disabled" />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default AssessmentsCard;