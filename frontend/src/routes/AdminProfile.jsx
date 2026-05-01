import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import CampusCard from '../components/CampusCard'
import { FaTrashAlt } from 'react-icons/fa';


const AdminProfile = () => {
  // API data loading state
  const [dataLoading, setDataLoading] = useState(true);
  const [classes, setClasses] = useState();

  const { user } = useUser();
  const navigate = useNavigate();


  const APIHOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      //Fetch Class data
      try {
        setDataLoading(true);

        const response = await axios.get('/api/classes');
        console.log("classes",response.data)
        setClasses(response.data); // Set class data to state
        
        //What it looks like Nov 1 2025:
        // description : "Something something class 1"
        // endDate: "2025-11-29"
        // id: 1
        // instructorId: 1
        // joinCode: "KSDPJF"
        // name: "Class 1`"
        // startDate: "2025-11-01"
        // studentCount: 0

        
      } catch (error) {
        console.error('Error fetching class data:', error); // Handle errors during fetching
      }

    setDataLoading(false);

    };

    fetchData();
  }, []);




const handleClassDelete = async (id) => {

  try {
    await axios.delete(`${APIHOST}/api/classes/${id}`);

    const response = await axios.get('/api/classes');
    setClasses(response.data);
  } catch (error) {
    console.error('Error deleting class:', error);
    alert("Failed to delete class. Try again?");
  }
};

  if (dataLoading) return <div>Loading classes...</div>;

  return (
    <div>
      <h1 className="mb-3 text-center"> Classes </h1>
      <div className="mb-3 text-center">
        <button className="btn btn-primary"  onClick={() => {navigate('/admin/class/create')}}>
          <i className="bi bi-plus"></i> Create Class
        </button>
      </div>
      
      {/* display all classes */}
      <div className="container-fluid min-vw-100">
        
        <div className="row">

          {classes.map((classData) => (
            <div key={classData.id} className="col-12 mb-3 w-50">
              <ClassCard
                classData={classData}
                onClick={() => { navigate(`/admin/class/${classData.id}`) }}
                onDelete={() => handleClassDelete(classData.id)}
              />
                
            </div>
          ))}
        </div>

      </div>

      
    </div>
  )
}

export default AdminProfile
