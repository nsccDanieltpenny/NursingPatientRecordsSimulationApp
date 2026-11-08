import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, ListGroup, Row, Col, InputGroup } from "react-bootstrap";
import TimeInput24 from "../../components/TimeInput24";
import { searchDrugs } from "../../utils/api";

// dropdown options, same as the poc
const FORMS = ["Oral tablet", "Chewable tablet", "Oral capsule", "Sublingual tablet", "Powder", "Oral liquid", "Injection", "IV solution", "Transdermal patch"];
const ROUTES = ["PO", "SL", "IV", "IM", "SC", "Transdermal", "PR"];
const UNITS = ["mg", "mcg", "g", "mL", "units", "tab"];
const FREQUENCIES = ["Daily", "BID", "TID", "QID", "HS (bedtime)"];

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
  // only scheduled orders this round
  const [orderType, setOrderType] = useState("Scheduled");
  // form and route from the dropdowns
  const [form, setForm] = useState("");
  const [route, setRoute] = useState("PO");
  // dose amount, max for a range dose, and unit
  const [dose, setDose] = useState("");
  const [doseMax, setDoseMax] = useState("");
  const [unit, setUnit] = useState("mg");
  // how often the drug is given
  const [frequency, setFrequency] = useState("Daily");
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

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Order type</Form.Label>
            <Form.Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="Scheduled">Scheduled</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Form / preparation</Form.Label>
            <Form.Select value={form} onChange={(e) => setForm(e.target.value)}>
              <option value="">Select</option>
              {FORMS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Route</Form.Label>
            <Form.Select value={route} onChange={(e) => setRoute(e.target.value)}>
              {ROUTES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

            <Row className="mb-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Dose</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="0"
                placeholder="Amount"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
              />
              <Form.Control
                type="number"
                min="0"
                placeholder="Max (range)"
                value={doseMax}
                onChange={(e) => setDoseMax(e.target.value)}
              />
              <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </Form.Select>
            </InputGroup>
            <Form.Text>Fill Max only for a range dose, e.g. 650–975 mg.</Form.Text>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Frequency</Form.Label>
            <Form.Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Start time</Form.Label>
        <TimeInput24 value={startTime} onChange={setStartTime} />
      </Form.Group>

      {/* test: show what was typed */}
      <p>Start time: {startTime}</p>
      <p>Drug picked: {drug ? drug.genericName : "none"}</p>
      <p>Order type: {orderType} | Form: {form} | Route: {route}</p>
      <p>Dose: {dose} | Max: {doseMax} | Unit: {unit} | Frequency: {frequency}</p>
    </div>
  );
};

export default PatientOrderEntry;