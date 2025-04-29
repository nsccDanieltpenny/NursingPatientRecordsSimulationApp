import React from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Box
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
  const theme = useTheme();
  const isIpadPortrait = useMediaQuery('(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)');

  const navigate = useNavigate();
  const { id } = useParams();

  // Define the assessments with their corresponding route keys
  const assessmentMapping = [
    { display: 'ADL', routeKey: 'ADL' },
    { display: 'Behaviour/Mood', routeKey: 'Behaviour' },
    { display: 'Cognitive', routeKey: 'Cognitive' },
    { display: 'Elimination', routeKey: 'Elimination' },
    { display: 'Mobility', routeKey: 'Mobility' },
    { display: 'Nutrition', routeKey: 'Nutrition' },
    { display: 'Progress Note', routeKey: 'ProgressNote' },
    { display: 'Safety', routeKey: 'Safety' },
    { display: 'Sensory Aids / Prosthesis / Skin Integrity', routeKey: 'SkinSensoryAid' },
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
    <Card className="assessment-card" sx={{
      borderRadius: '12px',
      padding: '16px',
      height: 'auto',
    }}>
      <Typography variant="h6" className="assessment-card-header" sx={{
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
            className="assessment-list-item"
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
              {React.cloneElement(iconMap[assessment.display] || <NoteIcon color="disabled" />, {
                className: "assessment-icon"
              })}
            </ListItemIcon>
            <ListItemText
              primary={assessment.display}
              primaryTypographyProps={{ fontSize: '1rem' }}
            />
            <ChevronRightIcon className="assessment-chevron" fontSize="small" color="disabled" />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default AssessmentsCard;