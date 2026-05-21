import { useEffect, useState } from 'react';
import { Fab, useMediaQuery, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ReturnTopActionButton = ({
  threshold = 0.5,
  label = 'Return to Top',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      const scrollPercent = scrollTop / (docHeight - winHeight);
      setVisible(scrollPercent >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', 
    });
  };

  if (!isMobile || !visible) return null;

  return (
    <Fab
      onClick={scrollToTop}
      variant="extended"
      sx={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        boxShadow: 4,
        px: 2,
      }}
    >
      <ArrowUpwardIcon sx={{ mr: 1 }} />
      {label}
    </Fab>
  );
};

export default ReturnTopActionButton;
