import BedCard from './BedCard';
import PropTypes from 'prop-types';

export const BedGrid = ({
  beds,
  onClearBed,
  onCardClick,
  canCreate,
  isAcuteCareRotation,
}) => {
  return (
    <>
      {beds.map((bed) => (
        <div className="col-sm-4 mb-4 d-flex justify-content-center" key={`bed-${bed.bedNumber}`}>
          <BedCard
            bed={bed}  // Now passing the whole bed object! 
            onClick={()=>onCardClick(bed)}
            onClearBed={onClearBed}
            canCreate={canCreate}
            isAcuteCareRotation={isAcuteCareRotation}
          />
        </div>
      ))}
    </>
  );
};

BedGrid.propTypes = {
  beds: PropTypes.arrayOf(
    PropTypes.shape({
      unit: PropTypes.string.isRequired,
      bedNumber: PropTypes.number.isRequired,
      isOccupied: PropTypes.bool.isRequired,
      patientId: PropTypes.string
    })
  ).isRequired,
  onClearBed: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  canCreate: PropTypes.bool.isRequired,
  isAcuteCareRotation: PropTypes.bool.isRequired,
};

export default BedGrid;