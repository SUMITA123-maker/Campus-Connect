import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { getPendingEvents, approveEvent, rejectEvent } from '../../api/eventApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventApprovalQueue = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ show: false, eventId: null });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetch = () =>
    getPendingEvents().then(({ data }) => setEvents(data)).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await approveEvent(id);
      toast.success('Event approved and published!');
      fetch();
    } catch { toast.error('Approval failed'); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (!remarks.trim()) return;
    setProcessing(true);
    try {
      await rejectEvent(rejectModal.eventId, remarks);
      toast.warning('Event rejected with remarks');
      setRejectModal({ show: false, eventId: null });
      setRemarks('');
      fetch();
    } catch { toast.error('Rejection failed'); }
    finally { setProcessing(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">📋 Event Approval Queue
        <Badge bg="warning" text="dark" className="ms-2">{events.length} Pending</Badge>
      </h4>

      {events.length === 0 ? (
        <Alert variant="success">✅ No pending events. All events are reviewed!</Alert>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th><th>Title</th><th>Organizer</th><th>Category</th>
              <th>Date</th><th>Participants</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <tr key={ev.id}>
                <td>{i + 1}</td>
                <td>
                  <div className="fw-semibold">{ev.title}</div>
                  <small className="text-muted">{ev.venue}</small>
                </td>
                <td>{ev.organizerName}</td>
                <td><Badge bg="secondary">{ev.category}</Badge></td>
                <td>{new Date(ev.eventDate).toLocaleDateString()}</td>
                <td>{ev.maxParticipants}</td>
                <td>
                  <Button size="sm" variant="success" className="me-2" disabled={processing}
                    onClick={() => handleApprove(ev.id)}>✓ Approve</Button>
                  <Button size="sm" variant="danger" disabled={processing}
                    onClick={() => setRejectModal({ show: true, eventId: ev.id })}>✗ Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={rejectModal.show} onHide={() => setRejectModal({ show: false, eventId: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Rejection *</Form.Label>
            <Form.Control as="textarea" rows={4} value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Explain why this event is being rejected..." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectModal({ show: false, eventId: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} disabled={!remarks.trim() || processing}>
            {processing ? 'Rejecting...' : 'Confirm Reject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventApprovalQueue;
