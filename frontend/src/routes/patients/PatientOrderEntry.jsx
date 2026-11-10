import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, ListGroup, Row, Col, InputGroup, Button, Card } from "react-bootstrap";
import TimeInput24, { isValidTime } from "../../components/TimeInput24";
import axios, { searchDrugs, createMedicationOrder } from "../../utils/api";
import "../../css/order_entry_styles.css";

// dropdown options, same as the poc
const FORMS = ["Oral tablet", "Chewable tablet", "Oral capsule", "Sublingual tablet", "Powder", "Oral liquid", "Injection", "IV solution", "Transdermal patch"];
const ROUTES = ["PO", "SL", "IV", "IM", "SC", "Transdermal", "PR"];
const UNITS = ["mg", "mcg", "g", "mL", "units", "tab"];
const FREQUENCIES = ["Daily", "BID", "TID", "QID", "HS (bedtime)"];
const ALL_TIMES = ["06:00", "08:00", "10:00", "12:00", "14:00", "17:00", "20:00", "22:00"];

// due times picked for each frequency
const FREQ_TIMES = {
  Daily: ["08:00"],
  BID: ["08:00", "20:00"],
  TID: ["08:00", "14:00", "20:00"],
  QID: ["08:00", "12:00", "17:00", "22:00"],
  "HS (bedtime)": ["22:00"],
};

// order entry page for one patient
const PatientOrderEntry = () => {
  // patient id from the url
  const { id } = useParams();
  const navigate = useNavigate();
  // patient info for the title and allergies
  const [patient, setPatient] = useState(null);
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
  // due times, start with the times for daily
  const [dueTimes, setDueTimes] = useState(["08:00"]);
  // start time for the order
  const now = new Date();
  const [startTime, setStartTime] = useState(now.toTimeString().slice(0, 5));
  const [startDate, setStartDate] = useState(now.toLocaleDateString("en-CA"));
  // note for students
  const [note, setNote] = useState("");
  // error messages for each field
  const [errors, setErrors] = useState({});
  // message after the order is added
  const [savedMessage, setSavedMessage] = useState("");
  // true while the order is saving
  const [saving, setSaving] = useState(false);

  // load the patient when the page opens
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`/api/patients/${id}`);
        setPatient(response.data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchPatient();
  }, [id]);

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

  // change frequency and set its due times
  const handleFrequencyChange = (f) => {
    setFrequency(f);
    setDueTimes(FREQ_TIMES[f]);
  };

  // click a time to add it or take it away
  const handleToggleTime = (t) => {
    if (dueTimes.includes(t)) {
      setDueTimes(dueTimes.filter((x) => x !== t));
    } else {
      setDueTimes([...dueTimes, t].sort());
    }
  };

  // check the form before adding the order
  const handleSubmit = async () => {
    const newErrors = {};
    if (!drug) newErrors.drug = "Pick a medication from the list.";
    if (!form) newErrors.form = "Pick a form.";
    if (!(Number(dose) > 0)) {
      newErrors.dose = "Enter a dose above 0.";
    } else if (doseMax && !(Number(doseMax) > Number(dose))) {
      newErrors.dose = "The range maximum must be more than the dose.";
    }
    if (dueTimes.length === 0) newErrors.times = "Pick at least one due time.";
        if (!startDate || !isValidTime(startTime)) newErrors.start = "Enter a start date and a 24-hour time, like 08:00.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    // order in the format from docs/MAR-API.md
    const order = {
      drugId: drug.drugId,
      orderType: orderType,
      dose: Number(dose),
      doseMax: doseMax ? Number(doseMax) : null,
      doseUnit: unit,
      form: form,
      route: route,
      frequency: frequency,
      dueTimes: dueTimes,
      instructorNote: note.trim() || null,
      startAt: new Date(`${startDate}T${startTime}`).toISOString(),
    };
    setSaving(true);
    try {
      await createMedicationOrder(id, order);
      setSavedMessage(`Order added: ${drug.genericName} ${dose} ${unit}.`);
    } catch (error) {
      console.error("Error adding order:", error);
      // show the errors from the server, or a general message
      const serverErrors = error.response?.data?.errors;
      setErrors({ save: serverErrors?.length ? serverErrors.join(" ") : "Could not add the order. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4">
        <div className="d-flex align-items-center gap-3 mb-3">
        <h2 className="mb-0 fs-5 fw-semibold">New medication order{patient && " · " + patient.fullName}</h2>
        <span className="text-muted small">Only instructors and admins can enter orders.</span>
        <Button variant="outline-secondary" size="sm" className="ms-auto" onClick={() => navigate(`/patients/${id}`)}>
          Cancel
        </Button>
      </div>
          <div className="order-form">

      <Form.Group className="mb-3">
        <Form.Label>Medication (generic name)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search generic or brand name, e.g. Tylenol"
          value={drugText}
          onChange={(e) => handleDrugSearch(e.target.value)}
        />
        <Form.Text>Pick from the list. Brand names find the generic.</Form.Text>
        {errors.drug && <div className="text-danger small">{errors.drug}</div>}
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
            {errors.form && <div className="text-danger small">{errors.form}</div>}
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
            {errors.dose && <div className="text-danger small">{errors.dose}</div>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Frequency</Form.Label>
              <Form.Select value={frequency} onChange={(e) => handleFrequencyChange(e.target.value)}>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3 due-times-box">
        <Form.Label>Due times</Form.Label>
        <div>
          {ALL_TIMES.map((t) => (
            <button
              key={t}
              className={dueTimes.includes(t) ? "time-chip selected" : "time-chip"}
              onClick={() => handleToggleTime(t)}
            >
            {t}
            </button>
          ))}
        </div>
        <Form.Text>Set from the frequency. Change them if the unit uses different times.</Form.Text>
        {errors.times && <div className="text-danger small">{errors.times}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start date and time</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col>
            <TimeInput24 value={startTime} onChange={setStartTime} />
          </Col>
        </Row>
            {errors.start && <div className="text-danger small">{errors.start}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Note for students</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Reassess when opioids discontinued."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Form.Group>

      <Card className="mb-3 order-review">
        <Card.Header>Order review</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <small className="text-muted">Medication</small>
              <div>{drug ? drug.genericName : "—"}</div>
            </Col>
            <Col>
              <small className="text-muted">Dose</small>
              <div>{dose ? dose + (doseMax ? "–" + doseMax : "") + " " + unit : "—"}</div>
            </Col>
            <Col>
              <small className="text-muted">Route and frequency</small>
              <div>
              {route}, {frequency} @{dueTimes.join(", ")}
              </div>
            </Col>
            <Col>
              <small className="text-muted">Start</small>
              <div>{startDate} {startTime}</div>
            </Col>
          </Row>
          {note && (
            <div className="mt-2">
              <small className="text-muted">Note</small>
              <div>{note}</div>
            </div>
          )}
        </Card.Body>
      </Card>

      {savedMessage && <div className="alert alert-success">{savedMessage}</div>}
      {errors.save && <div className="alert alert-danger">{errors.save}</div>}

      <div className="d-flex justify-content-end gap-2 mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(`/patients/${id}`)}>
          Cancel
        </Button>
        <Button className="btn-care" onClick={handleSubmit} disabled={saving}>
          Add order
        </Button>
      </div>
    </div>
      
    </div>
  );
};

export default PatientOrderEntry;