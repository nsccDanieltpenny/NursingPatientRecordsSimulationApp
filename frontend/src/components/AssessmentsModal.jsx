import { useState } from "react";
import "../css/assessment_modal_styles.css"
import api from '../utils/api';



const AssessmentModal = ({ isOpen, onClose, data, mode = "records" }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  if (!isOpen) return null;
  console.log(data)


  const fetchAssessmentDetail = async (assessmentTypeId, tableRecordId, submissionId) => {
    
    if (selectedData[submissionId]) {
      setSelectedData(prev => {
        const copy = { ...prev };
        delete copy[submissionId]; // remove it
        return copy;
      });
      return;
    }

    
    
    try {
      setLoadingId(submissionId);

      const response = await api.get(
        `api/patients/history/assessment/${assessmentTypeId}/${tableRecordId}`
      );

      setSelectedData(prev => ({
        ...prev,
        [submissionId]: response.data
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };



    const toggleAccordion = (id) => {
      setOpenAccordion(prev => (prev === id ? null : id));
    };


    const renderSubmissions = (submissions) => {
    return submissions.map((sub) => (
        <div key={sub.submissionId} className="submission-row">
        {sub.assessmentTypeName}
        </div>
    ));
    };


  const renderForm = (data) => {
    return (
      <div className="form-grid">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="form-row">
            <strong>{formatLabel(key)}:</strong> {value ?? "—"}
          </div>
        ))}
      </div>
    );
  };

    
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase());
  };


    
  const groupByPatient = (records) => {
    const map = new Map();

    records.forEach((record) => {
      const existing = map.get(record.patientId);

      if (!existing) {
        map.set(record.patientId, {
          patientId: record.patientId,
          patientName: record.patientName,
          rotationName: record.rotationName,
          submittedNurse: record.submittedNurse,
          submissions: [...record.assessmentSubmissions],
          latestDate: record.submittedDate
        });
      } else {
        // merge submissions
        existing.submissions.push(...record.assessmentSubmissions);

        // optionally keep most recent date
        if (new Date(record.submittedDate) > new Date(existing.latestDate)) {
          existing.latestDate = record.submittedDate;
        }
      }
    });

    return Array.from(map.values());
  };

  const renderGroupedRecords = (patients) => {
    return patients.map((patient) => (
      <div key={patient.patientId} className="assessment-modal-accordion-item">

        {/* Header */}
        <div
          className="assessment-modal-accordion-header"
          onClick={() => toggleAccordion(patient.patientId)}
        >
          <div>
            <strong>Patient {patient.patientName}</strong> - {patient.rotationName}
          </div>
          <div>
            {new Date(patient.latestDate).toLocaleDateString()}
          </div>
        </div>

        {/* Content */}
        {openAccordion === patient.patientId && (
          <div className="assessment-modal-accordion-content">
            {patient.submissions.map((sub) => (
              
              <div key={sub.submissionId} className="submission-row">

                  <div
                    className="submission-header"
                    onClick={() => fetchAssessmentDetail(
                      sub.assessmentTypeId,
                      sub.tableRecordId,
                      sub.submissionId
                    )}
                  >
                    <strong>{sub.assessmentTypeName}</strong>
                  </div>

                  {/* Loading */}
                  {loadingId === sub.submissionId && <div>Loading...</div>}

                  {/* Form Display */}
                  {selectedData[sub.submissionId] && (
                    <div className="submission-details">
                      {renderForm(selectedData[sub.submissionId])}
                    </div>
                  )}
                </div>

            ))}
          </div>
        )}

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
        <div className="assessment-modal-body">
            {(!data || data.length === 0) ? (
                <p>No assessments found</p>
            ) : mode === "records" ? (
                renderGroupedRecords(groupByPatient(data))
            ) : (
                renderSubmissions(data)
            )}

        </div>

      </div>
    </div>
  )


}

  export default AssessmentModal;