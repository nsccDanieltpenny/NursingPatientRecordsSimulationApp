import React, { useState } from "react";
import { Modal, Button, ListGroup, Container } from "react-bootstrap";
import "../css/attendance_modal_styles.css" 


const AttendanceModal = ({ show, handleClose, students }) => {
  const [confirmedStudents, setConfirmedStudents] = useState([]);

  // Simulate attendance confirmation (replace later with QR + login callback)
  const confirmStudent = (entraUserId) => {
    const student = students.find(s => s.entraUserId === entraUserId);

    if (
      student && !confirmedStudents.some(s => s.entraUserId === student.entraUserId)
    ) {
      setConfirmedStudents(prev => [...prev, student]);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered fullscreen>
      <Modal.Header className="attendance-modal-header" closeButton>
        <Modal.Title >Class Attendance</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <Container className="text-center">

          {/* QR PLACEHOLDER */}
          <div
            style={{
              border: "2px dashed #ccc",
              borderRadius: "10px",
              height: "80vh",
              aspectRatio:"1/1",
              display:"flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              backgroundColor: "#f8f9fa"
            }}
          >
            <span>QR Code Placeholder</span>
          </div>

          {/* DEBUG BUTTON (REMOVE LATER) */}
          <Button
            variant="primary"
            size="sm"
            className="mb-3"
            onClick={() => confirmStudent(students[0]?.entraUserId)}
          >
            Simulate Scan
          </Button>

          {/* CONFIRMED LIST */}
          <h5>Confirmed Students</h5>

          <ListGroup style={{ maxHeight: "250px", overflowY: "auto" }}>
            {confirmedStudents.length > 0 ? (
              confirmedStudents.map((student, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between">
                    <span>{student.fullName}</span>
                    <span className="text-muted">
                      {student.studentNumber}
                    </span>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-muted">
                No students confirmed yet
              </ListGroup.Item>
            )}
          </ListGroup>
        </Container>
      </Modal.Body>

    </Modal>
  );
};

export default AttendanceModal;