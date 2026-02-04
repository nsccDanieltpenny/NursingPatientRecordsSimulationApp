import { Modal, Button } from 'react-bootstrap';
import { FaSun, FaRegClock, FaMoon, FaRegEye } from 'react-icons/fa';
import '../css/component_styles.css'
import PropTypes from 'prop-types';

const ShiftSelection = ({ onSelectShift }) => {
  const handleShiftSelect = (shift) => {
    sessionStorage.setItem('selectedShift', shift); // Save the selected shift in sessionStorage
    onSelectShift(shift); // Update the state in the parent component
    window.dispatchEvent(new CustomEvent("shiftSelected", { detail: shift }));
  };

  return (
    <Modal show={true} onHide={() => onSelectShift(null)}>
      <Modal.Header style={{ backgroundColor: '#FFD700', color: '#000' }}>
        <Modal.Title>Select Shift</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <Button className="shift-button" onClick={() => handleShiftSelect('Morning')}>
            <FaSun className='me-1' /> Morning
          </Button>
          <Button className="shift-button" onClick={() => handleShiftSelect('Afternoon')}>
            <FaRegClock className='me-1' /> Afternoon
          </Button>
          <Button className="shift-button" onClick={() => handleShiftSelect('Evening')}>
            <FaMoon className='me-1' /> Evening
          </Button>
          <Button className="shift-button" onClick={() => handleShiftSelect('ViewOnly')}>
            <FaRegEye className='me-1' /> View Only
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ShiftSelection.propTypes = {
  onSelectShift: PropTypes.func.isRequired
};

export default ShiftSelection;