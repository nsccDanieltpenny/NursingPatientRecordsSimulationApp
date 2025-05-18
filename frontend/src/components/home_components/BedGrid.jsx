import BedCard from './BedCard';

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
export default BedGrid;