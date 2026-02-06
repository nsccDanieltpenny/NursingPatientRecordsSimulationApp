import { React, useState, useEffect, cloneElement } from 'react';
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
  DirectionsWalk as MobilityandSafetyIcon,
  Checklist as ADLIcon,
  Psychology as CognitiveIcon,
  // Security as SafetyIcon,
  Hearing as SensoryAidsIcon,
  Note as NoteIcon,
  ChevronRight as ChevronRightIcon,
  Mood as MoodIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentRoutes } from '../../utils/routeConfig';
import api from '../../utils/api';

const AssessmentsCard = () => {
  const theme = useTheme();
  const isIpadPortrait = useMediaQuery('(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)');
  const [rotationAssessments, setRotationAssessments] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getRotationAssessments = async (rotationId) => {
    // Check cache first
    const cacheKey = `rotation-${rotationId}-assessments`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      setRotationAssessments(JSON.parse(cached));
      return;
    }

    // Fetch from API if not cached
    try {
      const resp = await api.get(`api/rotations/${rotationId}/assessments`);
      setRotationAssessments(resp.data);
      // Cache the response
      sessionStorage.setItem(cacheKey, JSON.stringify(resp.data));
    } catch (err) {
      console.error('Error fetching rotation assessments:', err);
    }
  }

  useEffect(() => {
    // Get rotation from sessionStorage
    const storedRotation = sessionStorage.getItem('selectedRotation');
    if (storedRotation) {
      const rotation = JSON.parse(storedRotation);
      getRotationAssessments(rotation.rotationId);
    } else {
      // Fallback to rotation ID 1 if none selected
      getRotationAssessments(1);
    }
  }, []);

//   // Define the assessments with their corresponding route keys
// const assessmentMapping = [
//     { display: 'ADL', routeKey: 'ADL' },
//     { display: 'Cognitive', routeKey: 'Cognitive' },
//     { display: 'Elimination', routeKey: 'Elimination' },
//     { display: 'Mobility / Safety', routeKey: 'MobilityAndSafety' }, // Combined
//     { display: 'Nutrition', routeKey: 'Nutrition' },
//     { display: 'Sensory Aids / Prosthesis / Skin Integrity', routeKey: 'SkinSensoryAid' },
//     { display: 'Behaviour', routeKey: 'Behaviour' },
//     { display: 'Progress Notes', routeKey: 'ProgressNote' },
//     // { display: 'Safety', routeKey: 'Safety' },
//   ];

  const iconMap = {
    'ADL': <ADLIcon color="primary" />,
    'Cognitive': <CognitiveIcon color="primary" />,
    'Elimination': <EliminationIcon color="primary" />,
    'MobilityAndSafety': <MobilityandSafetyIcon color="primary" />,
    'Nutrition': <NutritionIcon color="primary" />,
    'SkinSensoryAid': <SensoryAidsIcon color="primary" />,
    'Behaviour': <MoodIcon color="primary" />,
    'ProgressNote': <NoteIcon color="primary" />,
    'AcuteProgress': <NoteIcon color="primary" />
     // 'Safety': <SafetyIcon color="primary" />,
  };
  
  const handleNavigation = (routeKey) => {
    const routeTemplate = assessmentRoutes[routeKey];
    if (!routeTemplate) {
      console.error(`No route defined for ${routeKey}`);
      return;
    }
    navigate(routeTemplate.replace(':id', id));
  };

  // console.log('AssessmentsCard component loaded');

  return ( 
    <Card className="assessment-card" sx={{
      borderRadius: '12px',
      padding: '16px',
      height: 'auto',
      width: isIpadPortrait ? '100%' : 'auto',
      minWidth: isIpadPortrait ? '100%' : 'auto',
      maxWidth: isIpadPortrait ? '100%' : 'auto',
      
    }}>
      <Typography variant="h6" className="assessment-card-header" sx={{
        fontWeight: 600,
        mb: 2,
        color: 'text.primary'
      }}>
        Patient Assessments
      </Typography>
      <List disablePadding>
        {rotationAssessments.map((assessment) => (
          <ListItem
            key={assessment.name}
            className="assessment-list-item"
            button
            onClick={() => handleNavigation(assessment.routeKey)}
            sx={{
              py: 2.5,
              mb: 1,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid transparent',
              '&:hover': { 
                backgroundColor: 'action.hover',
                transform: 'translateX(4px)',
                borderColor: 'primary.main',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              },
              '&:active': {
                transform: 'scale(0.98)',
                backgroundColor: 'action.selected'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              {cloneElement(iconMap[assessment.routeKey] || <NoteIcon color="disabled" />, {
                className: "assessment-icon"
              })}
            </ListItemIcon>
            <ListItemText
              primary={assessment.name}
            />
            <ChevronRightIcon className="assessment-chevron" fontSize="small" color="disabled" />
          </ListItem>
        ))}
      </List>
    </Card>

  );
};

export default AssessmentsCard;
