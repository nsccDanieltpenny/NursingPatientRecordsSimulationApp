import { use, useEffect,useState } from "react";
import axios from '../utils/api';
import { useUser } from '../context/UserContext';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import AssessmentModal from "../components/AssessmentsModal";
import "../css/student_list.css"




const InstructorStudents = () =>{
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [filteredAssessments, setFilteredAssessments] = useState([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);




    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`/api/classes/${user.classId}/students`);
                setStudents(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (user?.classId) fetchStudents();

        const fetchAssessments = async () =>{
            try {
                const res = await axios.get(`/api/records`, {
                    params: {
                        classIds: user.classId
                    }
                });
                console.log("records ", res.data);
                setAssessments(res.data);
            } catch (err) {
                console.error(err);
            }

        }

        fetchAssessments()
    }, [user]);


    const filterAssessments = (nurseId) =>{

        const filtered = assessments.filter(a => a.nurseId === nurseId)

        setFilteredAssessments(filtered)
    }

    const handleAssessmentClick = (id) =>{
        const filtered = assessments.filter(a => a.nurseId === id);
        setSelectedData(filtered)
        setIsModalOpen(true)
        

    }


    const handleSort = (field) => {
        if (sortField === field) {
            // toggle direction
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    
const filteredStudents = students
    .filter((student) =>
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
        let aValue, bValue;

        if (sortField === "name") {
            aValue = a.fullName;
            bValue = b.fullName;
        } else if (sortField === "wNumber") {
            aValue = a.studentNumber;
            bValue = b.studentNumber;
        } else if (sortField === "class") {
            aValue = a.classId;
            bValue = b.classId;
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });





    return(
        <>

            {/* ASSESSMENT MODAL COMPONENT */}
            <AssessmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={selectedData || []}
            mode="records"
            />

           
            <div className="pageContainer">
                {/* SEARCH BAR */}
                <input
                    type="text"
                    placeholder="Search Your Students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                />

                {/* SORT BUTTONS */}
                <div className="header-row">
                    <button onClick={() => handleSort("name")}>Name {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</button>
                    <button onClick={() => handleSort("wNumber")}>W# Number {sortField === "wNumber" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</button>
                    <button onClick={() => handleSort("class")}>Class {sortField === "class" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</button>
                </div>

                {/* STUDENT LIST */}
                <div className="student-list">
                    {filteredStudents.map((student) => (
                        <div key={student.nurseId} className="student-row">
                            <span>{student.fullName}</span>
                            <span>{student.studentNumber}</span>
                            <span>Class {student.classId}</span>
                            <button onClick={() => handleAssessmentClick(student.nurseId) } className="assessmentsButton">Assessments</button>
                        </div>
                    ))}
                </div>


            </div>
        </>
    )


}

export default InstructorStudents