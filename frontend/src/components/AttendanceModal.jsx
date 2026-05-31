import React, { useState,useEffect } from "react";
import { Modal, Button, ListGroup, Container } from "react-bootstrap";
import AttendanceQrCode from "../components/AttendanceQrCode"
import "../css/attendance_modal_styles.css" 
import axios from "../utils/api";



const AttendanceModal = ({ show, handleClose, students, type, classId }) => {
  const [confirmedStudents, setConfirmedStudents] = useState([]);
  const [attendanceId, setAttendanceId] = useState(null);
  const [secret, setSecret] = useState(null);
  

  useEffect(() => {
    if (!show || !type) {
        setConfirmedStudents([]);
        return;
    }
;

    startAttendance()
  }, [show,type]);

  
  const startAttendance = async () => {

    try {
      const { data } = await axios.post('/api/attendance/start', {
        classId: classId,
        type: type
      });

      setAttendanceId(data.id);
      setSecret(data.totpKey);
      console.log("start response", data);
    } catch (err) {
      console.error("Error starting attendance:", err);
    }
  };


  const fetchAttendanceList = async () => {
    try {
      const { data } = await axios.get('/api/attendance/list', {
      params: {
        id: attendanceId,
        classId: classId
      },
      });

      let filteredStudents = [];
      
      if (type === "IN") {
        filteredStudents = data.filter(s => s.checkedIn);
      } else if (type === "OUT") {
        filteredStudents = data.filter(s => s.checkedOut);
      }

      setConfirmedStudents(filteredStudents);
      console.log("attendance list:", filteredStudents)
    } catch (err) {
      console.error("Error fetching attendance list:", err);
    }
  };

  useEffect(() => {
    if (!attendanceId || !show) return;
    const interval = setInterval(fetchAttendanceList, 3000);
    return () => clearInterval(interval);
  }, [attendanceId,show]);





  return (
    <Modal show={show} onHide={handleClose} centered fullscreen>
      <Modal.Header className="attendance-modal-header" closeButton>
        <Modal.Title >Class Attendance ({type === "OUT" ? "Check-Out" : "Check-In"}) </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <Container fluid>
          <div className="d-flex  align-items-start flex-wrap justify-content-center">
            
            {/* QR CODE */}
            <div
              style={{
                border: "2px dashed #ccc",
                borderRadius: "10px",
                width: "min(90vw, 90vh)",
                maxWidth: "725px",
                aspectRatio: "1/1",
                display:"flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
                backgroundColor: "#f8f9fa",
                overflow: "hidden"
              }}
            >
              <AttendanceQrCode attendanceId={attendanceId} secret={secret} type = {type}/>
            </div>


              {/* STUDENT LIST */}
              <div style={{ width: "350px", maxHeight: "80vh" }}>
                <h5 className="mb-3 text-center">Attendance</h5>

                <ListGroup style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {confirmedStudents.length > 0 ? (
                    confirmedStudents.map((student) => (
                      <ListGroup.Item key={student.id}>
                        <div className="d-flex justify-content-between">
                          <span>{student.name}</span>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted">
                      No students yet
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>


          </div>
        </Container>
      </Modal.Body>

    </Modal>
  );
};

export default AttendanceModal;
