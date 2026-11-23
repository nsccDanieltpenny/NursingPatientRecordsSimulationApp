import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// true if time is HH:MM, hours 00-23, minutes 00-59
export const isValidTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

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
      // red border when the time is full but not valid
      isInvalid={value.length === 5 && !isValidTime(value)}
    />
  );
};

TimeInput24.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TimeInput24;