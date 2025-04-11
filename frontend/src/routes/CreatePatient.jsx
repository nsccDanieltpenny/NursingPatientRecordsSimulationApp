import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useUser } from "../context/UserContext";

const PatientForm = () => {

    const {user} = useUser();
    const [formData, setFormData] = useState({        
        fullName: "",
        sex: "",
        patientWristId: "",
        dob: "",
        imageFilename: "",
        bedNumber: "",
        nextOfKin: "",
        nextOfKinPhone: "",
        admissionDate: "",
        dischargeDate: "",
        maritalStatus: "",
        medicalHistory: "",
        weight: "",
        height: "",
        allergies: "",
        isolationPrecautions: "",
        roamAlertBracelet: "",
    });    

    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
        e.stopPropagation();
        } else {
            try {
                console.log("formdata",formData);
                
                const response = await axios.post("http://localhost:5232/api/patients/create",
                    {patient:formData},
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                )
                console.log('Response:', response.data);
                alert("Patient created successfully!")
                console.log("Patient created successfully!",formData);
            } catch (error) {
                console.error("Error creating patient:", error);
                alert("Failed to create patient.");
            }
        }
        setValidated(true);
    };

    return (
        <Container className="my-4">
        <h2 className="text-center">Create Patient</h2>
        
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Full Name is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sex <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="sex" value={formData.sex} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Sex is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Marital Status</Form.Label>
                        <Form.Control
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth (DOB) <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Date of Birth is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Admission Date <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="date"
                            name="admissionDate"
                            value={formData.admissionDate}
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
                            name="dischargeDate"
                            value={formData.dischargeDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Next of Kin <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="nextOfKin"
                            value={formData.nextOfKin}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Next of Kin is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Next of Kin Phone <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="tel"
                            name="nextOfKinPhone"
                            value={formData.nextOfKinPhone}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Next of Kin Phone is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Height <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="height"
                            value={formData.height}
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
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Weight is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Roam Alert Bracelet</Form.Label>
                        <Form.Control
                            name="roamAlertBracelet"
                            value={formData.roamAlertBracelet}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Image Filename</Form.Label>
                        <Form.Control
                            name="imageFilename"
                            value={formData.imageFilename}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Patient Wrist ID <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="patientWristId"
                            value={formData.patientWristId}
                            onChange={handleChange}
                            required
                            />
                            <Form.Control.Feedback type="invalid">Patient Wrist ID is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bed Number</Form.Label>
                        <Form.Control
                            rows={2}
                            name="bedNumber"
                            value={formData.bedNumber}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Allergies <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Allergies info is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Isolation Precautions <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="isolationPrecautions"
                            value={formData.isolationPrecautions}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Isolation Precautions are required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Medical History</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Button variant="primary" type="submit" className="w-20">
                Submit
            </Button>
        </Form>

        </Container>

        
    );
};

export default PatientForm;
