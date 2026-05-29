
import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import ConfirmModal from '../components/ConfirmModal';

const AdminProfile = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const [showFailConfirm, setShowFailConfirm] = useState(false);
  
  const APIHOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get('/api/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
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
      setShowFailConfirm(true)
    }
  };

  if (dataLoading) return <div>Loading classes...</div>;

  return (
    <div>
      <ConfirmModal
        open={showFailConfirm}
        title="Failed to delete"
        message={`The attempt to delete failed. Please try again.`}
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={() => {
          setShowFailConfirm(false);
        }}
        onCancel={() => setShowFailConfirm(false)}
      />

      <h1 className="mb-3 text-center"> Classes </h1>
      <div className="mb-3 text-center">
        <button className="btn btn-primary" onClick={() => {navigate('/admin/class/create')}}>
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
  );
};

export default AdminProfile;
