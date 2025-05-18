import BedCard from './BedCard';
import { useUser } from '../../context/UserContext.jsx';

export const BedGrid = ({ beds, onClearBed, onCardClick }) => {
  const { user } = useUser();
  
  return (
    <>
      {beds.map((bed) => (
        <div className="col-sm-4 mb-4 d-flex justify-content-center" key={`bed-${bed.bedNumber}`}>
          <BedCard
            bed={bed} //passing whole bed obj
            onClick={() => bed.isOccupied && onCardClick(bed.patientId)}
            onClearBed={onClearBed}
            userRole={user?.role} 
          />
        </div>
      ))}
    </>
  );
};
export default BedGrid;