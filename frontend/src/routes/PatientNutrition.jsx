import react, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import AssessmentSidebar from '../components/AssessmentSidebar'; 
import NavigationButtons from '../components/NavigationButtons'; 



/* Nutrition Page
    ----------------
    This page handles all "Nutrition" information for a given patient

    02/03/2025: Page created.
 */


const PatientNutrition = () => {
    //Gets patient ID from route "/patient/:id/nutriton"
    const { id } = useParams();

    //state to store answers
    const [answers, setAnswers] = useState({
        diet: ''
    });

    //handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };
    //define routes for back/next
    const prevPageRoute = `/patient/${id}/cognitive`;
    const nextPageRoute = `/patient/${id}/elimination`; 



    return (
        <div className="container mt-4 d-flex">
            {/*sidebar */}
            <AssessmentSidebar />

            {/* page content*/ }
            <div className="ms-4 flex-fill">
                <h2>Nutrition</h2>

                {/* diet */ }
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Diet:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        inline
                                        name="diet"
                                        type="radio"
                                        id="diet-puree"
                                        label="Puree"
                                        checked={answers.diet === 'Puree'}
                                        onChange={() => handleAnswerChange('diet', 'Puree')}
                                    />
                                    <Form.Check
                                        inline
                                        name="diet"
                                        type="radio"
                                        id="diet-minced"
                                        label="Minced"
                                        checked={answers.diet === 'Minced'}
                                        onChange={() => handleAnswerChange('diet', 'Minced')}
                                    />
                                    <Form.Check
                                        inline
                                        name="diet"
                                        type="radio"
                                        id="diet-regular"
                                        label="Regular"
                                        checked={answers.diet === 'Regular'}
                                        onChange={() => handleAnswerChange('diet', 'Regular')}
                                    />
                                    <Form.Check
                                        inline
                                        name="diet"
                                        type="radio"
                                        id="diet-liquid"
                                        label="Liquid"
                                        checked={answers.diet === 'Liquid'}
                                        onChange={() => handleAnswerChange('diet', 'Liquid')}
                                    />
                                    <Form.Check
                                        inline
                                        name="diet"
                                        type="radio"
                                        id="diet-npo"
                                        label="NPO"
                                        checked={answers.diet === 'NPO'}
                                        onChange={() => handleAnswerChange('diet', 'NPO')}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Assist</Form.Label>
                                <Form.Control
                                    type="text"
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Intake</Form.Label>
                                    <Form.Control
                                        type="text"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                    />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Dietary Supplement</Form.Label>
                                <Form.Control
                                    type="text"
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                    <Card className="mt-4">
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <Form.Group className="mb-3 col-sm">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control
                                            type="text"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3 col-sm">
                                        <Form.Label>Date of Weighing</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3 col-sm">
                                        <Form.Label>Weighing Method</Form.Label>
                                        <Form.Control
                                            type="text"
                                        />
                                    </Form.Group>
                                </div>
                            </Form>
                        </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>IV Solution/Rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Special Needs & Preferences</Form.Label>
                                    <Form.Control
                                        type="text"
                                    />
                                </Form.Group>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-5">
                    <Card.Body>
                        <NavigationButtons
                            prevPage={prevPageRoute}
                            nextPage={nextPageRoute}
                        />
                    </Card.Body>
                </Card>
            </div>
        </div>
    )

};

export default PatientNutrition;