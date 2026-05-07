import BedCard from './BedCard';
import PropTypes from 'prop-types';

export const BedGrid = ({ beds, onClearBed, onCardClick }) => {
  return (
    <>
      {beds.map((bed) => (
        <div className="col-sm-4 mb-4 d-flex justify-content-center" key={`bed-${bed.bedNumber}`}>
          <BedCard
            bed={bed}  // Now passing the whole bed object! 
            onClick={()=>onCardClick(bed)}
            onClearBed={onClearBed}
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
  onCardClick: PropTypes.func.isRequired
};

export default BedGrid;