import { useState } from "react";
import "../css/assessment_modal_styles.css"


const AssessmentModal = ({ isOpen, onClose, data, mode = "records" }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  
  if (!isOpen) return null;
  console.log(data)

  const toggleAccordion = (id) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

    const renderRecords = (records) => {
    return records.map((record) => (
        <div key={record.recordId} className="assessment-modal-accordion-item">
            {console.log("render records fired")}

        {/* Accordion header */}
        <div
            className="assessment-modal-accordion-header"
            onClick={() => toggleAccordion(record.recordId)}
        >
            <div>
            <strong>{record.patientName}</strong> - {record.rotationName}
            </div>
            <div>
            {new Date(record.submittedDate).toLocaleDateString()}
            </div>
        </div>

        {/* Accordion content */}
        {openAccordion === record.recordId && (
            <div className="assessment-modal-accordion-content">
            {record.assessmentSubmissions.map((sub) => (
                <div key={sub.submissionId} className="submission-row">
                {sub.assessmentTypeName}
                </div>
            ))}
            </div>
        )}
        </div>
    ));
    };


    const renderSubmissions = (submissions) => {
    return submissions.map((sub) => (
        <div key={sub.submissionId} className="submission-row">
        {sub.assessmentTypeName}
        </div>
    ));
    };

    
  return (
    <div className="instructor-assessment-overlay">
      <div className="instructor-assessment-modal mx-3">

        {/* Header */}
        <div className="modal-header">
          <h2> {mode === "records" && data?.length > 0 && `${data[0].submittedNurse} `}  Assessments</h2>
          
          <button onClick={onClose} className="assessment-modal-close-btn">✕</button>
        </div>

        {/* Content */}
        {console.log("render data in modal:" , data)}
        <div className="modal-body">
            {(!data || data.length === 0) ? (
                <p>No assessments found</p>
            ) : mode === "records" ? (
                renderRecords(data)
            ) : (
                renderSubmissions(data)
            )}

        </div>

      </div>
    </div>
  )


}

  export default AssessmentModal;