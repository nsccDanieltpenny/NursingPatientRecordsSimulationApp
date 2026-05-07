import { use, useEffect,useState } from "react";

import { useParams, Link, useNavigate  } from 'react-router-dom';
import "../css/class_list.css"
import axios from '../utils/api';
import { useUser } from '../context/UserContext';




const InstructorClasses = () => {
    const [classData, setClassData] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/classes/${user.classId}`);
                setClassData(response.data);
                setSelectedClassId(response.data.classId);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
        };

        if (user?.classId) fetchData();
    }, [user]);

    const handleAssessmentsClick = () => {
        
    }

    return (
        
        <div className="pageContainer">
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
                                        <Link className="assessmentsButton" to={`/instructor/${user.nurseId}/studentassessments`} >Assessments</Link>
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