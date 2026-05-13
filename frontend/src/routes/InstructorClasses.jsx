import { use, useEffect,useState } from "react";
import AssessmentModal from "../components/AssessmentsModal";
import { useParams, Link, useNavigate  } from 'react-router-dom';
import "../css/class_list.css"
import axios from '../utils/api';
import { useUser } from '../context/UserContext';




const InstructorClasses = () => {
    const [classData, setClassData] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const { user } = useUser();
    const [assessments, setAssessments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/classes/${user.classId}`);
                setClassData(response.data);
                setSelectedClassId(response.data.classId);
                console.log("class" ,response.data)
            } catch (error) {
                console.error(error);
            }
        };

        if (user?.classId) fetchData();

        const fetchAssessments = async () =>{
            try {
                const res = await axios.get(`/api/records`, {
                    params: {
                        classIds: user.classId
                    }
                }
                    
                );
                console.log("records ", res.data);
                setAssessments(res.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchAssessments()

    }, [user]);

    const handleAssessmentClick = (id) =>{
        const filtered = assessments.filter(a => a.nurseId === id);
        setSelectedData(filtered)
        setIsModalOpen(true)
        
    }

    return (
        
        <div className="pageContainer">
            
            {/* ASSESSMENT MODAL COMPONENT */}
            <AssessmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={selectedData || []}
            mode="records"
            />

            <h1 className="mt-2 align-self-center">Your Classes</h1>

            <div className="classContent">

                {/* SIDEBAR */}
                <aside className="sidebar">
                    {classData && (
                        <button
                            className={classData.classId === selectedClassId ? "sidebar-item-active" : "sidebar-item"}
                            onClick={() => setSelectedClassId(classData.classId)}
                        >
                            <div style={{fontSize: "large", fontWeight: "bold"}}>{classData.name}</div>
                            <div>{classData.students.length} students</div>
                        </button>
                    )}
                </aside>

                {/* MAIN */}
                <main className="content">
                    {classData && (
                        <>
                            <div className="class-header">
                                <h2>{classData.name}</h2>
                                <div>  Join code:<span style={{ fontWeight: "bold"}}> {classData.joinCode} </span></div>
                            </div>

                            <div className="students">
                                {classData.students.map((student) => (
                                    <div key={student.nurseId} className="student-row">
                                        <span>{student.fullName}</span>
                                        <span>{student.studentNumber}</span>
                                        <button onClick={() => handleAssessmentClick(student.nurseId) } className="assessmentsButton">Assessments</button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>

            </div>
        </div>
    
    );
};


export default InstructorClasses