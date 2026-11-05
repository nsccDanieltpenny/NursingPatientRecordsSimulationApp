import { useParams } from "react-router-dom";

// order entry page for one patient
const PatientOrderEntry = () => {
  // patient id from the url
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h2>New medication order</h2>
      <p>Patient ID: {id}</p>
    </div>
  );
};

export default PatientOrderEntry;