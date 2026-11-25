import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// value sent to the backend, and the text the student sees
const EFFECTIVE = [
  { value: 'Effective', label: 'Effective' },
  { value: 'PartiallyEffective', label: 'Partially effective' },
  { value: 'NotEffective', label: 'Not effective' }
];

// pain score 0 to 10
const PAIN_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// patient response box: did the med work
const PatientResponse = ({ value, onChange }) => {
  return (
    <>
      <Form.Group className="mb-3" controlId="responseEffective">
        <Form.Label>Patient response</Form.Label>
        <Form.Select
          value={value.effective}
          onChange={(e) => onChange({ ...value, effective: e.target.value })}
        >
          <option value="">Select</option>
          {EFFECTIVE.map((x) => (
            <option key={x.value} value={x.value}>{x.label}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="responsePainScore">
        <Form.Label>Pain score (optional)</Form.Label>
        <Form.Select
          value={value.painScore ?? ''}
          onChange={(e) => onChange({ ...value, painScore: e.target.value === '' ? null : Number(e.target.value) })}
        >
          <option value="">Select</option>
          {PAIN_SCORES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="responseComment">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Resting comfortably."
          value={value.comment}
          onChange={(e) => onChange({ ...value, comment: e.target.value })}
        />
      </Form.Group>
    </>
  );
};

PatientResponse.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PatientResponse;