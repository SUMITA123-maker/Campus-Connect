import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
