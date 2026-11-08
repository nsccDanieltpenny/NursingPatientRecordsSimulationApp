import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, ListGroup } from "react-bootstrap";
import TimeInput24 from "../../components/TimeInput24";
import { searchDrugs } from "../../utils/api";

// order entry page for one patient
const PatientOrderEntry = () => {
  // patient id from the url
  const { id } = useParams();
  // text typed in the medication box
  const [drugText, setDrugText] = useState("");
  // drugs that match the text
  const [drugResults, setDrugResults] = useState([]);
  // drug picked from the list
  const [drug, setDrug] = useState(null);
  // start time for the order
  const [startTime, setStartTime] = useState("");

  // search drugs each time the text changes
  const handleDrugSearch = async (text) => {
    setDrugText(text);
    setDrug(null);
    if (text.trim() === "") {
      setDrugResults([]);
      return;
    }
    const results = await searchDrugs(text);
    setDrugResults(results);
  };

  // pick one drug and close the list
  const handlePickDrug = (d) => {
    setDrug(d);
    setDrugText(d.genericName);
    setDrugResults([]);
  };

  return (
    <div className="container mt-4">
      <h2>New medication order</h2>
      <p>Patient ID: {id}</p>

      <Form.Group className="mb-3">
        <Form.Label>Medication (generic name)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search generic or brand name, e.g. Tylenol"
          value={drugText}
          onChange={(e) => handleDrugSearch(e.target.value)}
        />
        <Form.Text>Pick from the list. Brand names find the generic.</Form.Text>
        {drugResults.length > 0 && (
          <ListGroup>
            {drugResults.map((d) => (
              <ListGroup.Item key={d.drugId} action onClick={() => handlePickDrug(d)}>
                <b>{d.genericName}</b>{" "}
                <small className="text-muted">brand: {d.brandNames.join(", ")}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start time</Form.Label>
        <TimeInput24 value={startTime} onChange={setStartTime} />
      </Form.Group>

      {/* test: show what was typed */}
      <p>Start time: {startTime}</p>
      <p>Drug picked: {drug ? drug.genericName : "none"}</p>
    </div>
  );
};

export default PatientOrderEntry;