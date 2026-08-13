import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Form, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getEventRegistrations, getMyEvents } from '../../api/eventApi';
import { getAttendance, markBulkAttendance } from '../../api/attendanceApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AttendanceManager = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMyEvents(), getEventRegistrations(eventId), getAttendance(eventId)])
      .then(([eventsRes, registrationsRes, attendanceRes]) => {
        setEvent(eventsRes.data.find(item => String(item.id) === String(eventId)) || null);
        const registeredStudents = registrationsRes.data.filter(r => r.status === 'REGISTERED');
        setRegistrations(registeredStudents);

        const savedAttendance = new Map(
          attendanceRes.data.map(record => [record.studentId, record.status])
        );
        const init = {};
        registeredStudents.forEach(r => {
          init[r.studentId] = savedAttendance.get(r.studentId) || 'ABSENT';
        });
        setAttendance(init);
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to load attendance');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const isCompleted = event?.status === 'COMPLETED';

  const markAll = (status) => {
    if (isCompleted) return;

    const updated = {};
    registrations.forEach(r => { updated[r.studentId] = status; });
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (isCompleted) {
      toast.info('Attendance is locked because this event is completed');
      return;
    }

    setSaving(true);
    const payload = Object.entries(attendance).map(([studentId, status]) => ({
      studentId: parseInt(studentId, 10), status,
    }));

    try {
      await markBulkAttendance(eventId, payload);
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Attendance Manager</h4>
        <div>
          <Badge bg="success" className="me-2">Present: {presentCount}</Badge>
          <Badge bg="danger">Absent: {registrations.length - presentCount}</Badge>
        </div>
      </div>

      {isCompleted && (
        <Alert variant="warning">
          Attendance is locked because this event has been marked as completed.
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex gap-2">
          <Button size="sm" variant="success" disabled={isCompleted} onClick={() => markAll('PRESENT')}>
            Mark All Present
          </Button>
          <Button size="sm" variant="danger" disabled={isCompleted} onClick={() => markAll('ABSENT')}>
            Mark All Absent
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {registrations.length === 0 ? (
            <p className="p-3 text-muted">No registered students for this event.</p>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Student Name</th><th>College ID</th><th>Status</th></tr>
              </thead>
              <tbody>
                {registrations.map((r, i) => (
                  <tr key={r.studentId}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.studentCollegeId}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`att-${r.studentId}`}
                        label={attendance[r.studentId] === 'PRESENT' ? 'Present' : 'Absent'}
                        checked={attendance[r.studentId] === 'PRESENT'}
                        disabled={isCompleted}
                        onChange={e => setAttendance(prev => ({
                          ...prev, [r.studentId]: e.target.checked ? 'PRESENT' : 'ABSENT'
                        }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        <Card.Footer className="bg-white">
          <Button variant="primary" onClick={handleSave} disabled={saving || isCompleted}>
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AttendanceManager;
