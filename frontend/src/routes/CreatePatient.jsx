import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useUser } from "../context/UserContext";

const PatientForm = () => {

    const { user } = useUser();
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
                console.log("formdata", formData);

                const response = await axios.post("http://localhost:5232/api/patients/create",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                )

                alert("Patient created successfully!");
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
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Full Name is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sex <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="Sex" value={formData.Sex} onChange={handleChange} required>
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
                                name="MaritalStatus"
                                value={formData.MaritalStatus}
                                onChange={handleChange}
                            />
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
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                    </Col>
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
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Roam Alert Bracelet</Form.Label>
                            <Form.Control
                                name="RoamAlertBracelet"
                                value={formData.RoamAlertBracelet}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Image Filename</Form.Label>
                            <Form.Control
                                name="ImageFilename"
                                value={formData.ImageFilename}
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
                                name="PatientWristId"
                                value={formData.PatientWristId}
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
                                name="BedNumber"
                                value={formData.BedNumber}
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
                                name="Allergies"
                                value={formData.Allergies}
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
                                name="IsolationPrecautions"
                                value={formData.IsolationPrecautions}
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
                                name="MedicalHistory"
                                value={formData.MedicalHistory}
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