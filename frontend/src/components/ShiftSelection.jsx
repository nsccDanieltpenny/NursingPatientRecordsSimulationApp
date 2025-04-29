import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaSun, FaRegClock, FaMoon } from 'react-icons/fa';
import '../css/component_styles.css'

const ShiftSelection = ({ onSelectShift }) => {
  const handleShiftSelect = (shift) => {
    sessionStorage.setItem('selectedShift', shift); // Save the selected shift in sessionStorage
    onSelectShift(shift); // Update the state in the parent component
  };

  return (
    <Modal show={true} onHide={() => onSelectShift(null)}>
      <Modal.Header closeButton style={{ backgroundColor: '#FFD700', color: '#000' }}>
        <Modal.Title>Select Shift</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button className="shift-button" onClick={() => handleShiftSelect('Morning')}>
          <FaSun /> Morning
        </Button>
        <Button className="shift-button" onClick={() => handleShiftSelect('Afternoon')}>
          <FaRegClock /> Afternoon
        </Button>
        <Button className="shift-button" onClick={() => handleShiftSelect('Evening')}>
          <FaMoon /> Evening
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ShiftSelection;