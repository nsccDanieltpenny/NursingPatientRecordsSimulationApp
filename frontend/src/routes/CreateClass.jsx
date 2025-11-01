import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { Snackbar, Alert } from '@mui/material';

  const CreateClass = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [validated, setValidated] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({
      open: false,
      message: '',
      severity: 'success',
    }); 

    const [formData, setFormData] = React.useState({
      name: '',
      description: '',
      startDate: '',
      endDate: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.currentTarget;

      const requiredFields = ['name', 'description', 'startDate', 'endDate'];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].toString().trim() === ''
      );

      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: `Please fill out all required fields: ${missingFields.join(', ')}`,
          severity: 'error'
        });
        return;
      }

      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        setSnackbar({
          open: true,
          message: 'Start date must be before end date.',
          severity: 'error'
        });
        return;
      }

      try {
        await axios.post(`/api/classes`, formData);

        setSnackbar({
          open: true,
          message: 'Class created successfully!',
          severity: 'success'
        });
        setValidated(true);
        navigate('/admin');
      } catch (err) {
        const msg = err.response?.data?.message || 'Server error creating class';
        setSnackbar({
          open: true,
          message: msg,
          severity: 'error'
        });
      }
    };



//VERY VERY rudimentary create class form. 
  return (
    <div className="intake-container my-4">
      <Container>
        <h2 className="text-center">Create a Class</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          {/* NAME OF CLASS*/}
          <Row className="mb-3">
            <Form.Group  md="6" controlId="name">
              <Form.Label>Class Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter class name"
                name="name"
                value={formData.name}
                onChange={handleChange}
             
              />
              <Form.Control.Feedback type="invalid">
                Class name is required.
              </Form.Control.Feedback>
            </Form.Group>

            {/* DESCRIPTION */}
            <Form.Group  md="6" controlId="description">
              <Form.Label>Description<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter class description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Description is required.</Form.Control.Feedback>

            </Form.Group>
          </Row>

          {/* START DATE AND END DATE */}
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="startDate">
              <Form.Label>Start Date<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}

              />
              <Form.Control.Feedback type="invalid">Start Date is required.</Form.Control.Feedback>

            </Form.Group>

            <Form.Group as={Col} md="6" controlId="endDate">
              <Form.Label>End Date<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">End Date is required.</Form.Control.Feedback>

            </Form.Group>
          </Row>

          {/* <Row className="mb-3">
            <Form.Group  md="6" controlId="instructorId">
              <Form.Label>Instructor ID<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Enter instructor ID"
                name="instructorId"
                value={formData.instructorId}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Instructor ID is required.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group md="6" controlId="instructorName">
              <Form.Label>Instructor Name<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter instructor name"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Instructor name is required.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group md="6" controlId="campus">
              <Form.Label>Campus<span className='text-danger'>*</span></Form.Label>
              <Form.Select
                required
                type="text"
                placeholder="Enter campus location"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
              >
                <option value="">Select campus</option>
                <option value="Ivany">Ivany</option>
          
              </Form.Select>
            </Form.Group>
          </Row> */}
          </Form>
          <Row className="mt-2">
            <Col className="text-end">
          <Button variant="primary" type="submit" onClick={handleSubmit} className='w-20'>
            Create Class
          </Button>
          </Col>
            </Row>
         


        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        </Container>
    
    </div>
  )
}

export default CreateClass