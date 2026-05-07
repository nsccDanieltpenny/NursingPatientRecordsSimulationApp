import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/component_styles.css'
import PropTypes from 'prop-types';
import api from '../utils/api';

const RotationSelection = ({ onSelectRotation }) => {
    const [rotations, setRotations] = useState([]);

    const handleRotationSelect = (rotation) => {
        sessionStorage.setItem('selectedRotation', JSON.stringify(rotation)); // Save the selected rotation in sessionStorage
        onSelectRotation(rotation); // Update the state in the parent component
        window.dispatchEvent(new CustomEvent("rotationSelected", { detail: rotation }));
    };

    const fetchRotations = async () => {
        try {
            const resp = await api.get('api/rotations');
            setRotations(resp.data);      
        } catch (err) {
            console.error('Error fetching rotations:', err);
        }
    };

    useEffect(() => {
        fetchRotations();
    }, []);

    return (
        <Modal show={true} onHide={() => onSelectRotation(null)}>
        <Modal.Header style={{ backgroundColor: '#FFD700', color: '#000' }}>
            <Modal.Title>Select Rotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex flex-column gap-3">
                {rotations.map((rotation) => (
                    <Button 
                        key={rotation.rotationId}
                        className="shift-button" 
                        onClick={() => handleRotationSelect({rotationId: rotation.rotationId, rotationName: rotation.name})}
                    >
                        {rotation.name}
                    </Button>
                ))}
            </div>
        </Modal.Body>
        </Modal>
    );
};

RotationSelection.propTypes = {
  onSelectRotation: PropTypes.func.isRequired
};

export default RotationSelection;