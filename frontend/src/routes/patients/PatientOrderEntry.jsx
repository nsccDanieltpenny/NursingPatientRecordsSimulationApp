import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import TimeInput24 from "../../components/TimeInput24";

// order entry page for one patient
const PatientOrderEntry = () => {
  // patient id from the url
  const { id } = useParams();
  // start time for the order
  const [startTime, setStartTime] = useState("");

  return (
    <div className="container mt-4">
      <h2>New medication order</h2>
      <p>Patient ID: {id}</p>

      <Form.Group className="mb-3">
        <Form.Label>Start time</Form.Label>
        <TimeInput24 value={startTime} onChange={setStartTime} />
      </Form.Group>

      {/* test: show what was typed */}
      <p>Start time: {startTime}</p>
    </div>
  );
};

export default PatientOrderEntry;