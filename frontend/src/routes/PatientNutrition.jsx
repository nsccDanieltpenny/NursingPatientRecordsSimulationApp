import react from 'react'
import { useParams } from 'react-router-dom';
import AssessmentSidebar from '../components/AssessmentSidebar'; 



/* Nutrition Page
    ----------------
    This page handles all "Nutrition" information for a given patient

    02/03/2025: Page created.
 */


const PatientNutrition = () => {
    //Gets patient ID from route "/patient/:id/nutriton"
    const { id } = useParams();

    //handle form submission here


    return (
        <div className="container mt-4 d-flex">
            {/*sidebar */}
            <AssessmentSidebar />

            {/* page content*/ }
            <div className="ms-4 flex-fill">
                <h2>Nutrition for Patient: {id}</h2>
                <p>Nutrition Page</p>
            </div>
           
        </div>
    )

};

export default PatientNutrition;