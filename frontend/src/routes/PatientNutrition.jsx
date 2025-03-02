import react from 'react'
import { useParams } from 'react-router-dom';


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
        <div className="container mt-4">
            <h2>Nutrition for Patient: {id}</h2>
            <p>Nutrition Page</p>
        </div>
    )

};

export default PatientNutrition;