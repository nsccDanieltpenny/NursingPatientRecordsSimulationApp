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
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentRoutes } from '../../utils/routeConfig';


const AssessmentsCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const assessments = [
    'Nutrition',
    'Elimination',
    'Mobility',
    'ADL',
    'Cognitive'
  ];

  const iconMap = {
    Nutrition: <NutritionIcon color="primary" />,
    Elimination: <EliminationIcon color="primary" />,
    Mobility: <MobilityIcon color="primary" />,
    ADL: <ADLIcon color="primary" />,
    Cognitive: <CognitiveIcon color="primary" />
  };

  const handleNavigation = (assessmentType) => {
    const routeTemplate = assessmentRoutes[assessmentType];
    if (!routeTemplate) {
      console.error(`No route defined for ${assessmentType}`);
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
        {assessments.map((assessment) => (
          <ListItem
            key={assessment}
            button
            onClick={() => handleNavigation(assessment)}
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
              {iconMap[assessment]}
            </ListItemIcon>
            <ListItemText 
              primary={assessment} 
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