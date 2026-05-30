
import React, { useState, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import dayjs from "dayjs";
import CalendarPanel from "../components/CalendarPanel";
import AssessmentsPanel from "../components/AssessmentsPanel";
import { useEffect } from "react";
import { useUser } from '../context/UserContext';
import axios from '../utils/api';
import "../css/instructor_assessment_styles.css"
import AssessmentModal from "../components/AssessmentsModal";




export default function AssessmentCalendarViewer() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { user } = useUser();
  


  
  useEffect(() => {
    fetchAssessments();
  }, []);



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

  const groupedData = useMemo(() => {
    const map = {};

    assessments.forEach((item) => {
      const date = dayjs(item.submittedDate).format("YYYY-MM-DD");
      const classId = item.nurseClassId;

      
      if (!map[date]) map[date] = {};
      if (!map[date][classId]) map[date][classId] = [];

      map[date][classId].push(item);
   
    });

    return map;
  }, [assessments]);

  return (
    <Container fluid className="px-0">

      {/* ASSESSMENT MODAL COMPONENT */}
      <AssessmentModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      data={selectedData || []}
      mode="submissions"
      />

      <Row className="mt-5 mx-4 row-container">
        {/* LEFT PANEL */}
        <Col className="calendar-col mb-4">
          <CalendarPanel
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            data={groupedData}
          />
        </Col>

        {/* RIGHT PANEL */}
        <Col className="assessment-col">
          <AssessmentsPanel
            selectedDates={selectedDates}
            groupedData={groupedData}
            onViewAssessments={(submissions) => {
              console.log("view assessment ",submissions)
              setSelectedData(submissions);
              setIsModalOpen(true);
            }}

          />
        </Col>
      </Row>
    </Container>
  );
}
