import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import { FaTrashAlt } from 'react-icons/fa';
import { dummyClassData } from '../utils/dummyClassData';


const AdminProfile = () => {
  // API data loading state
  // const [dataLoading, setDataLoading] = useState(true);
  // const [classes, setClasses] = useState();

  // Dummy data loading state
  const [classes, setClasses] = useState(dummyClassData);

  const { user } = useUser();
  const navigate = useNavigate();


  const APIHOST = import.meta.env.VITE_API_URL;


  // temporarily use dummy data
  //turn this back on when ready to fetch from backend
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setDataLoading(true);

  //       const response = await axios.get('/api/classes');
  //       setClasses(response.data); // Set patient data to state

  //       setDataLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error); // Handle errors during fetching
  //     }
  //   };

  //   fetchData();
  // }, []);

const handleDelete = async (classId) => {

  try {
    await axios.delete(`${APIHOST}/api/classes/${classId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setClasses((prevClasses) =>
      prevClasses.filter((cls) => cls.classId !== classId)
    );
  } catch (error) {
    console.error('Error deleting class:', error);
    alert("Failed to delete class. Try again?");
  }
};


  //if (dataLoading) return <div>Loading classes...</div>;

  return (
    <div>
      <h1 className="mb-3 text-center"> Classes </h1>
      <div className="mb-3 text-center">
        <button className="btn btn-primary"  onClick={() => {navigate('/admin/class/create')}}>
          <i className="bi bi-plus"></i> Create Class
        </button>
      </div>
      
      {/* display all classes */}
      <div className="container-fluid">
        <div className="row">
          {classes.map((classData) => (
            <div key={classData.classId}>
         
              <ClassCard 
              classData={classData} 
              onClick={() => {navigate(`/admin/class/${classData.classId}`)} }
              onDelete={() => handleDelete(classData.classId)} 
              />
                
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
