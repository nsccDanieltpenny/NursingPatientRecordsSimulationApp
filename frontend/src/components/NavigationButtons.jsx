import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/* Navigation Button
   ----------------------------
   Created: 02/03/2025

   This component provides two buttons, "Back" and "Next" for assessment pages. 
   */

const NavigationButtons = ({ prevPage, nextPage }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (prevPage) {
            navigate(prevPage);
        }
    };

    const handleNext = () => {
        if (nextPage) {
            navigate(nextPage);
        }
    };

    return (
        <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleBack} disabled={!prevPage}>
                Back
            </Button>
            <Button variant="primary" onClick={handleNext} disabled={!nextPage}>
                Next
            </Button>
        </div>
    );
};

export default NavigationButtons;
