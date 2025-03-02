import react from 'react'
import { useParams } from 'react-router-dom';

import AssessmentSidebar from '../components/AssessmentSidebar'; 



/* Elimination Page
    ----------------
    This page handles all "Elimination" information for a given patient

    02/03/2025: Page created.
 */


const PatientElimination = () => {
    //Gets patient ID from route "/patient/:id/elimination"
    const { id } = useParams();

    //handle form submission here


    return (
        <div className="container mt-4 d-flex">
            {/* sidebar */}
            <AssessmentSidebar />


            {/* page content */ }
            <div className="ms-4 flex-fill">
                <h2>Elimination for Patient: {id}</h2>
                <p>Elimination Page</p>
            </div>
           
        </div>
    )

};

export default PatientElimination;