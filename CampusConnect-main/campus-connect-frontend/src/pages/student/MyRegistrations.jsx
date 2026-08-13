import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button } from 'react-bootstrap';
import { getMyRegistrations, cancelRegistration } from '../../api/eventApi';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () =>
    getMyRegistrations()
      .then(({ data }) => setRegistrations(data))
      .finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await cancelRegistration(eventId);
      toast.warning('Registration cancelled');
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">🎟️ My Registrations</h4>
      {registrations.length === 0 ? (
        <p className="text-muted">You haven't registered for any events yet.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th><th>Event</th><th>Venue</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{r.eventTitle}</td>
                <td>{r.eventVenue}</td>
                <td>{new Date(r.eventDate).toLocaleDateString()}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  {r.status === 'REGISTERED' && (
                    <Button size="sm" variant="outline-danger"
                      onClick={() => handleCancel(r.eventId)}>
                      Cancel
                    </Button>
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

export default MyRegistrations;
