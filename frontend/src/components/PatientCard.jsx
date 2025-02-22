import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const PatientCard = () => {

  // const [patientData, setPatientData] = useState([]);
  
  //     useEffect(() => {
  //         const fetchData = async () => {
  //             try {
  //                 console.log('Fetching Patient data...');
  //                 // const response = await axios.get('http://localhost:5232/');
  //                 console.log('Response:', response);
  //                 setPatientData(response.data);
  //             } catch (error) {
  //                 console.error('Error fetching data:', error);
  //                 console.error('Axios error config:', error.config);
  //                 console.error('Axios error request:', error.request);
  //                 console.error('Axios error response:', error.response);
  //             }
  //         };
  //     }, []);
      
  return (
    <div className="container mb-1">
      <Card style={{ width: '9rem', height: '9rem' }}>
        <Card.Body>
            <Card.Text> Bed # </Card.Text>
            <Card.Text>
                Patient Name
            </Card.Text>
            <Button variant="primary">Records</Button>
        </Card.Body>
      </Card>
    </div>
  ); 
}

export default PatientCard;
