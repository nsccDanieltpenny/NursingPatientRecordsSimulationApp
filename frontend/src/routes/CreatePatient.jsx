import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { Snackbar, Alert } from '@mui/material';

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
    const [formData, setFormData] = useState({
        FullName: "",
        Sex: "",
        PatientWristId: "",
        Dob: "",
        ImageFilename: "",
        BedNumber: null,
        NextOfKin: "",
        NextOfKinPhone: "",
        AdmissionDate: "",
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
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

                    if (!response) {
                        throw new Error("Failed to communicate with remote image stoarge");
                    }
    
                    updatedFormData.ImageFilename = response.data.fileName;
                    console.log("Image uploaded successfully:", response.data.fileName);
                    setSnackbar({
                        open: true,
                        message: 'Image uploaded successfully.',
                        severity: 'success'
                    });

                } catch (error) {
                    console.log("Error uploading image: ", error);
                    console.log("Function response: ", response);
                    setSnackbar({
                        open: true,
                        message: 'Error: Failed to upload image.',
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
                    message: 'Failed to create patient record.',
                    severity: 'error'
                  });
            }
        }
    };

    return (
        <div className="intake-container my-4">
            <Container>
                <h2 className="text-center pb-3">Create Patient</h2>

                <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 border rounded shadow">
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Full Name is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Pronouns<span className="text-danger">*</span></Form.Label>
                                <Form.Select name="Sex" value={formData.Sex} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="He/Him">he/him</option>
                                    <option value="She/Her">she/her</option>
                                    <option value="They/Them">they/them</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Sex is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
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

                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Marital Status</Form.Label>
                            <Form.Control
                                name="MaritalStatus"
                                value={formData.MaritalStatus}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>  
                    
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

                    <Row className="justify-content-start">
                        <Form.Group className="mb-3">
                            <Form.Label>Next of Kin Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                // type="number"
                                name="NextOfKinPhone"
                                value={formData.NextOfKinPhone}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Next of Kin Phone is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Height <span className="text-danger">*</span></Form.Label>
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
                                <Form.Label>Weight <span className="text-danger">*</span></Form.Label>
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

                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Roam Alert Bracelet</Form.Label>
                            <Form.Control
                                name="RoamAlertBracelet"
                                value={formData.RoamAlertBracelet}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

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

                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Bed Number</Form.Label>
                            <Form.Control
                                type="number"
                                name="BedNumber"
                                value={formData.BedNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

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
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group classname="mb-3">
                            <Form.Label>Campus</Form.Label>
                            <Form.Select name="Campus" value={formData.Campus} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Ivany">Ivany</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group classname="mb-3">
                            <Form.Label>Unit</Form.Label>
                            <Form.Select name="Unit" value={formData.Unit} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Temp">Harbourside Hospital</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

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
                      onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Alert 
                        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
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