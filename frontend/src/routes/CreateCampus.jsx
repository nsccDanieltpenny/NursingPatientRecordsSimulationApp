import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { Snackbar, Alert } from '@mui/material';

  const CreateCampus = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [validated, setValidated] = React.useState(false);
    const [campuses, setCampuses] = React.useState([]);

    const [snackbar, setSnackbar] = React.useState({
      open: false,
      message: '',
      severity: 'success',
    }); 

    const [formData, setFormData] = React.useState({
      name: '',
      address: ''
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

      const requiredFields = ['name', 'address'];
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

      try {

        console.log("Posting formData:", formData);
        await axios.post(`/api/campus`, formData);

        setSnackbar({
          open: true,
          message: 'Campus created successfully!',
          severity: 'success'
        });
        setValidated(true);
        navigate('/admin');
      } catch (err) {
        const msg = err.response?.data?.message || 'Server error creating campus';
        setSnackbar({
          open: true,
          message: msg,
          severity: 'error'
        });
      }

    };



  return (
    <div className="intake-container my-4">
      <Container>
        <h2 className="text-center">Create a Campus</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          {/* NAME OF CAMPUS*/}
          <Row className="mb-3">
            <Form.Group  md="6" controlId="name">
              <Form.Label>Campus Name <span className="text-danger">*</span></Form.Label>
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

            {/* ADDRESS */}
            <Form.Group  md="6" controlId="address">
              <Form.Label>Address <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter campus address"
                name="address"
                value={formData.description}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Address is required.</Form.Control.Feedback>

            </Form.Group>
          </Row>

          </Form>
          <Row className="mt-2">
            <Col className="text-end">
          <Button variant="primary" type="submit" onClick={handleSubmit} className='w-20'>
            Create Campus
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

export default CreateCampus