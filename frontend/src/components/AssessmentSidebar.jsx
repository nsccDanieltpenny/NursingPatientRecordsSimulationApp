import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

/* Assessment Sidebar Component
   ----------------------------
   Created: 02/03/2025

   This component provides a sidebar for the assessment pages, allowing for users to switch between assessment pages
   without the need to return back to the patient profile page. 
   */

const assessments = [
    'Cognitive',
    'Nutrition',
    'Elimination',
    'Mobility',
    'Safety',
    'ADL',
    'Sensory Aids/Prosthesis/Skin Integrity',
    'Behaviour/Mood',
    'Progress Note',
];


const AssessmentSidebar = () => {
    const { id } = useParams();
    const location = useLocation();

    return (
        <div className="list-group" style={{ width: '200px' }}>
            {assessments.map((assessment) => {
                // const routeName = assessment.toLowerCase().replace(/\s+/g, '');
                // const url = `/patient/${id}/${routeName}`;

                let url;

                if (assessment == 'Nutrition') {
                    url = `/api/patients/nurse/patient/${id}/nutrition`
                }

                if (assessment == 'Elimination') {
                    url = `/api/patients/nurse/patient/${id}/elimination`
                }

                if (assessment == 'Mobility') {
                    url = `/api/patients/nurse/patient/${id}/mobility`
                }

                if (assessment == 'Cognitive') {
                    url = `/api/patients/nurse/patient/${id}/cognitive`
                }

                if (assessment == 'Sensory Aids/Prosthesis/Skin Integrity') {
                    url = `/api/patients/nurse/patient/${id}/skinandsensoryaid`
                }

                if (assessment == 'Safety') {
                    url = `/api/patients/nurse/patient/${id}/safety`
                }

                if (assessment == 'ADL') {
                    url = `/api/patients/nurse/patient/${id}/adl`
                }

                if (assessment == 'Behaviour/Mood') {
                    url = `/api/patients/nurse/patient/${id}/behaviour`
                }

                if (assessment == 'Progress Note') {
                    url = `/api/patients/nurse/patient/${id}/progressnote`
                }
                //checks if the current location path includes this routeName
                //const isActive = location.pathname.includes(routeName);

                return (
                    <Link
                        key={assessment}
                        to={url}
                        className={`list-group-item list-group-item-action active`}
                    >
                        {assessment}
                    </Link>
                );
            })}
        </div>
    );
};

export default AssessmentSidebar;
