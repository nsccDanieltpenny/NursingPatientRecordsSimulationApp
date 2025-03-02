import react from 'react'
import { useParams } from 'react-router-dom';


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
        <div className="container mt-4">
            <h2>Elimination for Patient: {id}</h2>
            <p>Elimination Page</p>
        </div>
    )

};

export default PatientElimination;