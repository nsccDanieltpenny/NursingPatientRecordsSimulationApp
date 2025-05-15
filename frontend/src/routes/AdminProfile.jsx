import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';

const AdminProfile = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [classes, setClasses] = useState();
  const { user } = useUser();
  const navigate = useNavigate();

  const APIHOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        const response = await axios.get(`${APIHOST}/api/Class`, 
          {
            headers: { Authorization: `Bearer ${user.token}` },
          });
        setClasses(response.data); // Set patient data to state

        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error); // Handle errors during fetching
      }
    };

    fetchData();
  }, []);

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
      <div className="container-fluid">
        <div className="row">
          {classes.map((classData) => (
            <div key={classData.classId}>
              <ClassCard classData={classData} onClick={() => {navigate(`/admin/class/${classData.classId}`)}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
