import BedCard from './BedCard';
import propTypes from 'prop-types';

export const BedGrid = ({ beds, onClearBed, onCardClick }) => {
  return (
    <>
      {beds.map((bed) => (
        <div className="col-sm-4 mb-4 d-flex justify-content-center" key={`bed-${bed.bedNumber}`}>
          <BedCard
            bed={bed}  // Now passing the whole bed object! 
            onClick={() => bed.isOccupied && onCardClick(bed.patientId)}
            onClearBed={onClearBed}
          />
        </div>
      ))}
    </>
  );
};

BedGrid.propTypes = {
  beds: propTypes.arrayOf(
    propTypes.shape({
      unit: propTypes.string.isRequired,
      bedNumber: propTypes.number.isRequired,
      isOccupied: propTypes.bool.isRequired,
      patientId: propTypes.number.isRequired
    })
  ).isRequired,
  onClearBed: propTypes.func.isRequired,
  onCardClick: propTypes.func.isRequired
};

export default BedGrid;