import react from 'react'
import { useParams } from 'react-router-dom';

import AssessmentSidebar from '../components/AssessmentSidebar'; 



/* Mobility Page
    ----------------
    This page handles all "Mobility" information for a given patient

    02/03/2025: Page created.
 */


const PatientMobility = () => {
    //Gets patient ID from route "/patient/:id/mobility"
    const { id } = useParams();

    //handle form submission here


    return (
        <div className="container mt-4 d-flex">
            {/* sidebar */}
            <AssessmentSidebar />

            {/* content */}
            <div className="ms-4 flex-fill">
                <h2> Mobility for Patient: {id}</h2>
                <p>Mobility Page</p>
            </div>
        </div>
    )

};

export default PatientMobility;