import Spinner from 'react-bootstrap/Spinner';

function LazyLoading({text}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75">
      <Spinner animation="border" role="status" className="text-white spinner-lg shadow-lg fade-in">   
      </Spinner>
      <span className="mt-2 mx-2 text-white fw-bold">{text || "Loading..."}</span>
    </div>
  );
}

export default LazyLoading;