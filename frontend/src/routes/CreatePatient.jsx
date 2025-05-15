import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { Snackbar, Alert } from '@mui/material';
import '../css/assessment_styles.css';
import '../css/patient_admin_styles.css';
import LazyLoading from "../components/Spinner";
import { useNavigationBlocker } from '../utils/useNavigationBlocker';

const PatientForm = () => {
    const navigate = useNavigate();

    //notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const APIHOST = import.meta.env.VITE_API_URL;
    const IMAGEHOST = import.meta.env.VITE_FUNCTION_URL;

    const { user } = useUser();
    const [image, setImage] = useState(null);
    const [validated, setValidated] = useState(false);
    const [defaultFormValues, setDefaultFormValues] = useState({
        FullName: "",
        Sex: "",
        PatientWristId: "",
        Dob: "",
        ImageFilename: "",
        BedNumber: null,
        NextOfKin: "",
        NextOfKinPhone: "",
        AdmissionDate: new Date().toISOString().split('T')[0],
        DischargeDate: null,
        MaritalStatus: "",
        MedicalHistory: "",
        Weight: "",
        Height: "",
        Allergies: "",
        IsolationPrecautions: "",
        RoamAlertBracelet: "",
        Campus: "",
        Unit: ""
    })
    const [formData, setFormData] = useState(defaultFormValues);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (formData != defaultFormValues) {
                e.preventDefault();
                e.returnValue = ''; // required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [formData]);


    // ---------- LOADING SPINNER ---------------
    const [loading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;


        // ---------- VALIDATION ---------------

        // ---------- Required Fields ----------
        const requiredFields = ["FullName", "Sex", "Dob", "AdmissionDate", "NextOfKin", "NextOfKinPhone", "Height", "Weight", "Allergies", "PatientWristId", "Campus", "Unit"];

        // Check for missing fields
        const missingFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "");

        if (missingFields.length > 0) {
            setSnackbar({
                open: true,
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                severity: 'error',
            });

            return;
        }

        // ----------- Dates ------------------
        const dob = new Date(formData.Dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        // Adjust age if the current date is before the birthday in the current year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        if (dob >= today) {
            setSnackbar({
                open: true,
                message: 'Date of Birth must be in the past.',
                severity: 'error',
            });
            return;
        }

        if (age > 120) {
            setSnackbar({
                open: true,
                message: 'The patient cannot be older than 120 years.',
                severity: 'error',
            });
            return;
        }

        const admissionDate = new Date(formData.AdmissionDate);
        const dischargeDate = formData.DischargeDate ? new Date(formData.DischargeDate) : null;
        if (dischargeDate && dischargeDate <= admissionDate) {
            setSnackbar({
                open: true,
                message: 'Discharge Date must be after Admission Date.',
                severity: 'error',
            });
            return;
        }

        // ----------- Phone ------------------
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(formData.NextOfKinPhone)) {
            setSnackbar({
                open: true,
                message: 'Phone number must be formatted: ###-###-####',
                severity: 'error',
            });
            return;
        }

        setIsLoading(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            let updatedFormData = { ...formData };


            // ------ IMAGE UPLOAD ---------
            if (image !== null) {
                try {
                    // Create a FormData object
                    const imageFormData = new FormData();
                    imageFormData.append("image", image);

                    // Send the image to the server
                    const response = await axios.post(`${IMAGEHOST}/api/ImageUpload`, imageFormData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                    });

                    updatedFormData.ImageFilename = response.data.fileName;
                    console.log("Image uploaded successfully:", response.data.fileName);
                    setSnackbar({
                        open: true,
                        message: 'Image uploaded successfully.',
                        severity: 'success'
                    });

                } catch (error) {
                    setIsLoading(false);
                    console.log("Error uploading image: ", error);
                    setSnackbar({
                        open: true,
                        message: 'Failed to create patient: error when uploading imgae.',
                        severity: 'error'
                    });

                    return;
                }
            }

            // ------- POST PATIENT TO BACKEND ------
            try {
                console.log("formdata", updatedFormData);
                const response = await axios.post(`${APIHOST}/api/patients/create`,
                    updatedFormData,
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                )

                setSnackbar({
                    open: true,
                    message: 'Patient record created successfully!',
                    severity: 'success'
                });

                setValidated(true);
                navigate('/');

            } catch (error) {
                console.error("Error creating patient:", error);
                setSnackbar({
                    open: true,
                    message: 'Failed to create patient: error communicating with server.',
                    severity: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };
    if (loading) {
        return <LazyLoading text="Uploading patient..." />;
    }

    useNavigationBlocker(JSON.stringify(formData) !== JSON.stringify(defaultFormValues));

    return (

        <div className="intake-container my-4 createPatient-page ">
            <Container>
                <h2 className="text-center pb-3 assessment-header">Patient Intake Form</h2>

                <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 border rounded shadow gradient-background">
                    {/* -------- NAME -------- */}
                    <Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleChange}
                                maxLength={70}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Full Name is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- SEX / GENDER -------- */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Birth Gender <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="Sex" value={formData.Sex} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Birth gender is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        {/* NOT INCLUDED IN SUBMIT - WAITING UNTILL FIELD IS ADDED TO BACKEND */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Pronouns <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="Pronouns" onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="He/Him">He/Him</option>
                                    <option value="She/Her">She/Her</option>
                                    <option value="They/Them">They/Them</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Sex is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* -------- DOB -------- */}
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth (DOB) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="Dob"
                                    value={formData.Dob}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Date of Birth is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* -------- MARITAL STATUS -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Marital Status</Form.Label>
                            <Form.Select
                                name="MaritalStatus"
                                value={formData.MaritalStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                                <option value="Common-law">Common-law</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {/* -------- ADMISSION / DISCHARGE -------- */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Admission Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="AdmissionDate"
                                    value={formData.AdmissionDate}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Admission Date is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Discharge Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="DischargeDate"
                                    value={formData.DischargeDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* -------- NEXT OF KIN -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Next of Kin <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="NextOfKin"
                                value={formData.NextOfKin}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Next of Kin is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- NEXT OF KIN PHONE -------- */}
                    <Row className="justify-content-start">
                        <Form.Group className="mb-3">
                            <Form.Label>Next of Kin Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="NextOfKinPhone"
                                value={formData.NextOfKinPhone}
                                onChange={handleChange}
                                placeholder="999-999-9999"
                                maxLength={12}
                                required
                            />

                            <Form.Control.Feedback type="invalid">Next of Kin Phone is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- HEIGHT / WEIGHT -------- */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Height (cm) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    name="Height"
                                    value={formData.Height}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Height is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Weight (lbs) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Weight"
                                    value={formData.Weight}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Weight is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* -------- ROAM ALERT BRACELET -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Roam Alert Bracelet</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="RoamAlertBracelet"
                                    value="Yes"
                                    checked={formData.RoamAlertBracelet === "Yes"}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="RoamAlertBracelet"
                                    value="No"
                                    checked={formData.RoamAlertBracelet === "No"}
                                    onChange={handleChange}
                                />
                            </div>
                        </Form.Group>
                    </Row>

                    {/* -------- PATIENT WRIST ID -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Patient Wrist ID <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="PatientWristId"
                                value={formData.PatientWristId}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Patient Wrist ID is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- BED NUMBER -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Bed Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="BedNumber"
                                value={formData.BedNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    {/* -------- ALLERGIES -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Allergies <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="Allergies"
                                value={formData.Allergies}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Allergies info is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- MEDICAL HISTORY -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Medical History</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                name="MedicalHistory"
                                value={formData.MedicalHistory}
                                onChange={handleChange}
                                maxLength={5000}
                            />
                            <Form.Control.Feedback type="invalid">Allergies info is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* -------- CAMPUS -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Campus <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="Campus" value={formData.Campus} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Ivany">Ivany</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {/* -------- UNIT -------- */}
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Unit <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="Unit" value={formData.Unit} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Temp">Harbourside Hospital</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {/* -------- IMAGE -------- */}
                    <Row>
                        {/* <Form.Group className="mb-3">
                                <Form.Label>Image Filename</Form.Label>
                                <Form.Control
                                    name="ImageFilename"
                                    value={formData.ImageFilename}
                                    onChange={handleChange}
                                />
                        </Form.Group> */}

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Patient image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageUpload}
                            />
                        </Form.Group>

                    </Row>

                    <Row className="mt-2">
                        <Col className="text-end">
                            <Button variant="primary" type="submit" className="w-20">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

            </Container>
        </div>
    );
};

export default PatientForm;