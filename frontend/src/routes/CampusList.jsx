import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import CampusCard from '../components/CampusCard'
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import "../css/campus_list.css"
import { IconButton } from '@mui/material';
import ConfirmModal from '../components/ConfirmModal';



const CampusList = () => {
  // API data loading state
    const [dataLoading, setDataLoading] = useState(true);
    const [classes, setClasses] = useState();
    const [campuses,setCampuses] = useState();
    const { user } = useUser();
    const navigate = useNavigate();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [selectedCampusId, setSelectedCampusId] = useState(null);
    const [expandedCampusId, setExpandedCampusId] = useState(null);
    const [showFailConfirm, setShowFailConfirm] = useState(false);


    const toggleCampus = (campusId) => {
    setExpandedCampusId(prev =>
        prev === campusId ? null : campusId
    );
    };


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

      //Fetch Campus data
      try {
        const response = await axios.get('/api/campus');
        setCampuses(response.data);
        
      } catch(error){
        console.error('Error fetching campus data:', error); // Handle errors during fetching

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



const handleCampusEdit = async(id) =>{
    navigate(`/admin/campus/${id}/edit`)
}


const handleCampusDeleteClick = (id) => {
  setSelectedCampusId(id);
  setShowClearConfirm(true);
};


const confirmCampusDelete = async () => {
  try {
    await axios.delete(`${APIHOST}/api/campus/${selectedCampusId}`);

    const response = await axios.get('/api/campus');
    setCampuses(response.data);
  } catch (error) {
    console.error('Error deleting campus:', error);
    setShowFailConfirm(true)
  }

  setShowClearConfirm(false);
  setSelectedCampusId(null);
};


  if (dataLoading) return <div>Loading classes...</div>;

  return (
    <div>
      {/* Delete Confirmation */}
      <ConfirmModal
        open={showClearConfirm}
        title="Delete campus?"
        message={`Are you sure you want delete this campus?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmCampusDelete}
        onCancel={() => setShowClearConfirm(false)}
        danger
      />
      {/* Failed Delete Alert */}
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

      <div className="container vw-100">

        <h1 className="mb-3 text-center"> Campuses </h1>

        <div className="mb-3 text-center">
          <button className="btn btn-primary"  onClick={() => {navigate('/admin/campus/create')}}>
            <i className="bi bi-plus"></i> Add Campus
          </button>
        </div>

          {/* Display all campuses */}
        <div className="col">

            {campuses.map((campus) => {
                console.log("Campus id",campus.campusId)
                
                
                const campusClasses = classes.filter(classData => {
                    const match = classData.campusId === campus.campusId;
                    console.log(match);
                    return match;
                });

            
        
                const isExpanded = expandedCampusId === campus.campusId;

                return (
                <div key={campus.campusId} className="campus-list-card card mb-3 w-50 mx-auto">
                    {/* Campus List*/}
                    <div
                    className="campus-card card-body d-flex justify-content-between align-items-center cursor-pointer"
                    onClick={() => toggleCampus(campus.campusId)}
                    >
                    <div>
                        <h3 className="mb-0">{campus.name}</h3>
                        <p className="text-muted">
                        {campusClasses.length} classes
                        </p>
                    </div>

                    <div className="d-flex gap-5">
                      
                      <IconButton
                            size="medium"
                            onClick={(e)=> {
                              e.stopPropagation();
                              handleCampusEdit(campus.campusId)
                            }}
                            sx={{
                              position: 'absolute',
                              top: 30,
                              right: 80,
                              zIndex: 10,
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              boxShadow: 2,
                              '&:hover': {
                                backgroundColor: '#78abf8',
                                color: '#fff',
                              },
                            }}
                          >
                            <FaPencilAlt size={18} style={{ pointerEvents: 'none' }} />
                      </IconButton>

                      <IconButton
                        size="medium"
                        onClick={(e) =>{
                          e.stopPropagation();
                          handleCampusDeleteClick(campus.campusId)
                        }}
                        sx={{
                          position: 'absolute',
                          top: 30,
                          right: 20,
                          zIndex: 10,
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          boxShadow: 2,
                          '&:hover': {
                            backgroundColor: '#f44336',
                            color: '#fff',
                          },
                        }}
                      >
                        <FaTrash size={18} style={{ pointerEvents: 'none' }} />
                      </IconButton>

                    </div>
                  </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                    <div className="expanded-card card-body border-top">
                        <div className="d-flex justify-content-between mb-3">
                        <h4>Classes</h4>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                            navigate('/admin/class/create', {
                                state: { campusId: campus.campusId }
                            })
                            }
                        >
                            <i className="bi bi-plus"></i> Add Class
                        </button>
                        </div>

                        {campusClasses.length === 0 && (
                        <p className="text-muted">No classes for this campus.</p>
                        )}

                        {campusClasses.map(classData => (
                        <ClassCard
                            key={classData.id}
                            classData={classData}
                            onClick={() =>
                            navigate(`/admin/class/${classData.id}`)
                            }
                            onDelete={() =>
                            handleClassDelete(classData.id)
                            }
                          
                        />
                        ))}
                    </div>
                    )}
                </div>
                );
            })}
        </div>


      </div>
      
    </div>
  )
}

export default CampusList
