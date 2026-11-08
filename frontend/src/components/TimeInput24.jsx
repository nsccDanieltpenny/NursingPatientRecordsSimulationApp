import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// 24-hour time box, like 08:00 or 20:00
const TimeInput24 = ({ value, onChange }) => {
  const handleChange = (e) => {
    // remove all non-digit characters
    const cleaned = e.target.value.replace(/\D/g, '');

    // format as HH:MM
    if (cleaned.length <= 2) {
      onChange(cleaned);
    } else {
      onChange(`${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`);
    }
  };

  return (
    <Form.Control
      type="text"
      placeholder="HH:MM"
      maxLength={5}
      value={value}
      onChange={handleChange}
    />
  );
};

TimeInput24.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TimeInput24;