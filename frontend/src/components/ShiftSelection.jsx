import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaSun, FaRegClock, FaMoon } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

const ShiftSelection = ({ onSelectShift }) => {
  const {startShift} = useUser();
  const handleShiftSelect = (shift) => {
    startShift(shift)
    //sessionStorage.setItem('selectedShift', shift); // Save the selected shift in sessionStorage
    //onSelectShift(shift); // Update the state in the parent component
  };

  return (
    <Modal show={true} onHide={() => onSelectShift(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Select Shift</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="light" onClick={() => handleShiftSelect('Morning')}>
          <FaSun /> Morning
        </Button>
        <Button variant="light" onClick={() => handleShiftSelect('Afternoon')}>
          <FaRegClock /> Afternoon
        </Button>
        <Button variant="light" onClick={() => handleShiftSelect('Evening')}>
          <FaMoon /> Evening
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ShiftSelection;