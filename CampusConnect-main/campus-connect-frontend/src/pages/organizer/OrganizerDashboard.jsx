import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { completeEvent, deleteEvent, getMyEvents } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { FaCalendarPlus, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const canEdit = (status) => ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'].includes(status);
const canDelete = (status) => ['PENDING_APPROVAL', 'REJECTED', 'CANCELLED'].includes(status);
const canManageAttendance = (status) => ['APPROVED', 'ONGOING', 'COMPLETED'].includes(status);
const canUploadResults = (status) => status === 'COMPLETED';
const canManageMedia = (status) => ['ONGOING', 'COMPLETED'].includes(status);
const canComplete = (status) => ['APPROVED', 'ONGOING'].includes(status);
const canManageCertificates = (status) => status === 'COMPLETED';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    getMyEvents().then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!eventToDelete) return;

    setDeletingId(eventToDelete.id);
    try {
      await deleteEvent(eventToDelete.id);
      setEvents(current => current.filter(event => event.id !== eventToDelete.id));
      toast.success('Event deleted successfully');
      setEventToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const handleComplete = async (eventId) => {
    setCompletingId(eventId);
    try {
      const { data } = await completeEvent(eventId);
      setEvents(current => current.map(event => event.id === eventId ? data : event));
      toast.success('Event marked as completed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark event as completed');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pending = events.filter(e => e.status === 'PENDING_APPROVAL').length;
  const approved = events.filter(e => e.status === 'APPROVED').length;
  const completed = events.filter(e => e.status === 'COMPLETED').length;

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-1">Organizer Dashboard</h3>
      <p className="text-muted mb-4">Welcome, {user?.fullName}</p>

      <Row xs={1} md={4} className="g-3 mb-4">
        {[
          { icon: <FaClipboardList />, label: 'Total Events', value: events.length, color: 'primary' },
          { icon: <FaClock />, label: 'Pending Approval', value: pending, color: 'warning' },
          { icon: <FaCheckCircle />, label: 'Approved', value: approved, color: 'success' },
          { icon: <FaCalendarPlus />, label: 'Completed', value: completed, color: 'info' },
        ].map((s, i) => (
          <Col key={i}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`text-${s.color} fs-3`}>{s.icon}</div>
                <div>
                  <div className="fs-3 fw-bold">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <span className="fw-semibold">My Events</span>
          <Link to="/organizer/events/new" className="btn btn-primary btn-sm">+ New Event</Link>
        </Card.Header>
        <Card.Body className="p-0">
          {events.length === 0 ? (
            <p className="text-muted p-3">You haven't created any events yet.</p>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr><th>Title</th><th>Date</th><th>Venue</th><th>Status</th><th>Registered</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td className="fw-semibold">{e.title}</td>
                    <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td>{e.venue}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>{e.registeredCount}/{e.maxParticipants}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {canEdit(e.status) && (
                          <Link to={`/organizer/events/${e.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                        )}
                        {canDelete(e.status) && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={deletingId === e.id}
                            onClick={() => setEventToDelete(e)}
                          >
                            {deletingId === e.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        )}
                        {canManageAttendance(e.status) && (
                          <Link to={`/organizer/events/${e.id}/attendance`} className="btn btn-sm btn-outline-primary">Attendance</Link>
                        )}
                        {canUploadResults(e.status) && (
                          <Link to={`/organizer/events/${e.id}/results`} className="btn btn-sm btn-outline-success">Results</Link>
                        )}
                        {canManageMedia(e.status) && (
                          <Link to={`/organizer/events/${e.id}/media`} className="btn btn-sm btn-outline-info">Media</Link>
                        )}
                        {canComplete(e.status) && (
                          <Button
                            size="sm"
                            variant="outline-warning"
                            disabled={completingId === e.id}
                            onClick={() => handleComplete(e.id)}
                          >
                            {completingId === e.id ? 'Updating...' : 'Mark Completed'}
                          </Button>
                        )}
                        {canManageCertificates(e.status) && (
                          <Link to={`/organizer/events/${e.id}/certificates`} className="btn btn-sm btn-outline-dark">Certificates</Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <ConfirmModal
        show={Boolean(eventToDelete)}
        title="Delete Event"
        message={`Delete "${eventToDelete?.title}"? This action cannot be undone.`}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </Container>
  );
};

export default OrganizerDashboard;
