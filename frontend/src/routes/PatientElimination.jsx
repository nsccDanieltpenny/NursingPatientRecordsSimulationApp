import react, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';



import AssessmentSidebar from '../components/AssessmentSidebar'; 
import NavigationButtons from '../components/NavigationButtons'; 




/* Elimination Page
    ----------------
    This page handles all "Elimination" information for a given patient

    02/03/2025: Page created.
 */


const PatientElimination = () => {
    //Gets patient ID from route "/patient/:id/elimination"
    const { id } = useParams();

    //state to store answers
    const [answers, setAnswers] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: ''
    });

    //function to handle answer changes
    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };


    //array of questions with their indentifiers and text
    const questions = [
        { id: 'question1', text: 'Incontinent of Bladder ' },
        { id: 'question2', text: 'Incontinent of Bowel ' },
        { id: 'question3', text: 'Day/Night Product' },
        { id: 'question4', text: 'Catheter Insertion' }
    ];

    //define routes for back/next
    const prevPageRoute = `/patient/${id}/nutrition`;
    const nextPageRoute = `/patient/${id}/mobility`; 

   
    return (
        <div className="container mt-4 d-flex">
            {/* sidebar */}
            <AssessmentSidebar />


            {/* page content */ }
            <div className="ms-4 flex-fill">
                <h2>Elimination</h2>
                {/* Yes/No questions */}
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <div className="mb-2 d-flex justify-content-end">
                                <strong className="me-4">Yes</strong>
                                <strong>No</strong>
                            </div>
                            {questions.map((question, index) => (
                                <Form.Group key={index} className="mb-3 d-flex align-items-center">
                                    <Form.Label className="me-3">{question.text}</Form.Label>
                                    <div className="ms-auto d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-yes`}
                                            checked={answers[question.id] === 'yes'}
                                            onChange={() => handleAnswerChange(question.id, 'yes')}
                                        />
                                        <Form.Check
                                            inline
                                            name={question.id}
                                            type="radio"
                                            id={`${question.id}-no`}
                                            checked={answers[question.id] === 'no'}
                                            onChange={() => handleAnswerChange(question.id, 'no')}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Last Bowel movement, Routine questions. Catheter insertion date (will only accept input if relevant)*/ }
                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Bowel Movement</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.lastBowelMovement}
                                    onChange={(e) => handleAnswerChange('lastBowelMovement', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bowel Routine</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={answers.bowelRoutine}
                                    onChange={(e) => handleAnswerChange('bowelRoutine', e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>


                    <Card className="mt-4">
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bladder Routine</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answers.bladderRoutine}
                                        onChange={(e) => handleAnswerChange('bladderRoutine', e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Catheter Insertion Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={answers.catheterInsertionDate}
                                    onChange={(e) => handleAnswerChange('catheterInsertionDate', e.target.value)}
                                    disabled={answers.question4 !== 'yes'}
                                />
                            </Form.Group>
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

export default PatientElimination;