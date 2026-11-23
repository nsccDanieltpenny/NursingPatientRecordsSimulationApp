import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// value sent to the backend, and the text the student sees
const EFFECTIVE = [
  { value: 'Effective', label: 'Effective' },
  { value: 'PartiallyEffective', label: 'Partially effective' },
  { value: 'NotEffective', label: 'Not effective' }
];

// patient response box: did the med work
const PatientResponse = ({ value, onChange }) => {
  return (
    <Form.Group className="mb-3">
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
  );
};

PatientResponse.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PatientResponse;