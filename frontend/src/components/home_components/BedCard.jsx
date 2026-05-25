import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { FaTimes } from 'react-icons/fa';
import '../../css/home_styles.css';
import { useUser } from '../../context/UserContext';
import PropTypes from 'prop-types';
import { getUnreadDoctorOrderCount } from '../../utils/api';

export const BedCard = ({
  bed,
  onClick,
  onClearBed,
  canCreate,
  isAcuteCareRotation,
}) => {
  const [showRemove, setShowRemove] = useState(false);
  const { isAdmin, isInstructor } = useUser();
  const createBlocked = !bed.isOccupied && !canCreate;
  const [unreadOrders, setUnreadOrders] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchUnread() {
      if (bed.isOccupied && bed.patientId) {
        try {
          const count = await getUnreadDoctorOrderCount(bed.patientId);
          if (mounted) setUnreadOrders(count);
        } catch {
          if (mounted) setUnreadOrders(0);
        }
      } else {
        setUnreadOrders(0);
      }
    }
    fetchUnread();
    return () => { mounted = false; };
  }, [bed.isOccupied, bed.patientId]);

  const isPrivileged = isAdmin || isInstructor;
  return (
    <div 
      className="bed-card-container"
      onMouseEnter={isPrivileged ? () => setShowRemove(true) : undefined}
      onMouseLeave={isPrivileged ? () => setShowRemove(false) : undefined}
    >
      <Card 
        className={`bed-card ${bed.isOccupied ? 'occupied' : 'empty'}`}
        onClick={onClick}
        style={{ cursor: createBlocked ? 'not-allowed' : 'pointer', position: 'relative' }}
      >
        <Card.Body>
          <div className="bed-identifier">
            {bed.unit}-{bed.bedNumber}
          </div>
          <div className={`bed-status ${bed.isOccupied ? 'occupied' : 'empty'}`}>
            {bed.isOccupied ? 'Occupied' : 'Available'}
          </div>
          {bed.isOccupied && isAcuteCareRotation && unreadOrders > 0 && (
            <div 
              className={`doctor-order-badge${isPrivileged && showRemove ? ' badge-move' : ''}`}
              title={`${unreadOrders} unread Doctor's Orders`}
            >
              {unreadOrders}
            </div>
          )}
          {isAdmin && bed.isOccupied && showRemove && (
            <button 
              className="simple-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClearBed(bed);
              }}
            >
              <FaTimes />
            </button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

BedCard.propTypes = {
  bed: PropTypes.shape({
    unit: PropTypes.string.isRequired,
    bedNumber: PropTypes.number.isRequired,
    isOccupied: PropTypes.bool.isRequired,
    patientId: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onClearBed: PropTypes.func.isRequired,
  canCreate: PropTypes.bool.isRequired,
  isAcuteCareRotation: PropTypes.bool.isRequired,
};

export default BedCard;