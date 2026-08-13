import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Table } from 'react-bootstrap';
import { getEventCertificates, verifyCertificate } from '../../api/certificateApi';
import { getCompletedEvents } from '../../api/eventApi';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CertificateVerify = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompletedEvents()
      .then(({ data }) => {
        setEvents(data);
        setError('');
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Failed to load completed events';
        setError(message);
        toast.error(message);
      });
  }, []);

  const loadCerts = async (eventId) => {
    setSelectedEventId(eventId);
    setError('');
    if (!eventId) {
      setCerts([]);
      return;
    }

    setLoading(true);
    getEventCertificates(eventId)
      .then(({ data }) => setCerts(data))
      .catch((err) => {
        const message = err.response?.data?.message || 'Failed to load certificates';
        setCerts([]);
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  const handleVerify = async (certId) => {
    try {
      await verifyCertificate(certId);
      toast.success('Certificate verified. Student can now download it.');
      loadCerts(selectedEventId);
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">Certificate Verification</h4>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4">
        <Form.Label>Select Event</Form.Label>
        <Form.Select value={selectedEventId} onChange={e => loadCerts(e.target.value)}>
          <option value="">Select an event</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </Form.Select>
      </div>

      {loading ? <LoadingSpinner /> : certs.length === 0 ? (
        selectedEventId ? (
          <Alert variant="info">
            No certificates yet. The organizer must generate certificates after marking the event completed.
          </Alert>
        ) : null
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Student</th><th>College ID</th><th>Cert Number</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {certs.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{c.studentName}</td>
                <td>{c.studentCollegeId}</td>
                <td><code>{c.certificateNumber}</code></td>
                <td><StatusBadge status={c.status} /></td>
                <td>
                  {c.status === 'GENERATED' && (
                    <Button size="sm" variant="success" onClick={() => handleVerify(c.id)}>
                      Verify & Release
                    </Button>
                  )}
                  {c.status === 'AVAILABLE_FOR_DOWNLOAD' && (
                    <span className="text-success small">Released</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CertificateVerify;
