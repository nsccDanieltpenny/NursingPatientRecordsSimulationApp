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
    // 'ADLs',
     'Sensory Aids / Prosthesis',
    // 'Skin Integrity',
    // 'Behaviour/Mood',
    // 'Progress Note',
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
                    url = '/api/nutritions/1'
                }

                if (assessment == 'Elimination') {
                    url = '/api/eliminations/1'
                }

                if (assessment == 'Mobility') {
                    url = '/api/mobilities/1'
                }

                if (assessment == 'Cognitive') {
                    url = '/api/cognitives/1'
                }

                if (assessment == 'Sensory Aids / Prosthesis') {
                    url = '/api/skinsensoryaid/1'
                }

                if (assessment == 'Safety') {
                    url = '/api/safety/1'
                }
                //checks if the current location path includes this routeName
                // const isActive = location.pathname.includes(routeName);

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