import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Form, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getAttendance } from '../../api/attendanceApi';
import { getMyEvents } from '../../api/eventApi';
import {
  downloadOrganizerCertificate,
  generateOrganizerCertificates,
  getOrganizerEventCertificates,
} from '../../api/certificateApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-toastify';

const CertificateManager = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, attendanceRes, certificatesRes] = await Promise.all([
        getMyEvents(),
        getAttendance(eventId),
        getOrganizerEventCertificates(eventId),
      ]);
      setEvent(eventsRes.data.find(item => String(item.id) === String(eventId)) || null);
      setAttendance(attendanceRes.data.filter(record => record.status === 'PRESENT'));
      setCertificates(certificatesRes.data);
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const generatedStudentIds = useMemo(
    () => new Set(certificates.map(cert => cert.studentId)),
    [certificates]
  );

  const selectableStudents = attendance.filter(record => !generatedStudentIds.has(record.studentId));

  const toggleStudent = (studentId) => {
    setSelectedIds(current =>
      current.includes(studentId)
        ? current.filter(id => id !== studentId)
        : [...current, studentId]
    );
  };

  const handleGenerate = async () => {
    if (event?.status !== 'COMPLETED') {
      toast.info('Mark the event as completed before generating certificates');
      return;
    }

    if (selectedIds.length === 0) {
      toast.info('Select at least one student');
      return;
    }

    setGenerating(true);
    try {
      await generateOrganizerCertificates(eventId, selectedIds);
      toast.success('Certificates generated for selected students');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Certificate generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (cert) => {
    try {
      const { data } = await downloadOrganizerCertificate(cert.id);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cert.certificateNumber || 'certificate'}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Certificate Generation</h4>
          <div className="text-muted">Select participated students and generate certificates after the event is completed. Admin will verify them before students can download.</div>
        </div>
        <div className="d-flex gap-2">
          <Badge bg={event?.status === 'COMPLETED' ? 'success' : 'warning'} text={event?.status === 'COMPLETED' ? 'white' : 'dark'}>
            {event?.status || 'Event'}
          </Badge>
          <Badge bg="success">Present Students: {attendance.length}</Badge>
        </div>
      </div>

      {event?.status !== 'COMPLETED' && (
        <Alert variant="warning">
          Certificates can be generated only after this event is marked as completed from the organizer dashboard.
        </Alert>
      )}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Participated Students</span>
          <Button
            variant="primary"
            size="sm"
            disabled={event?.status !== 'COMPLETED' || generating || selectedIds.length === 0}
            onClick={handleGenerate}
          >
            {generating ? 'Generating...' : `Generate Selected (${selectedIds.length})`}
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {selectableStudents.length === 0 ? (
            <Alert variant="info" className="m-3">
              No present students are waiting for certificate generation.
            </Alert>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="table-light">
                <tr><th>Select</th><th>#</th><th>Student</th><th>College ID</th></tr>
              </thead>
              <tbody>
                {selectableStudents.map((record, index) => (
                  <tr key={record.studentId}>
                    <td style={{ width: 90 }}>
                      <Form.Check
                        type="checkbox"
                        id={`cert-student-${record.studentId}`}
                        checked={selectedIds.includes(record.studentId)}
                        onChange={() => toggleStudent(record.studentId)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{record.studentName}</td>
                    <td>{record.studentCollegeId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-semibold">Generated Certificates</Card.Header>
        <Card.Body className="p-0">
          {certificates.length === 0 ? (
            <p className="p-3 text-muted mb-0">No certificates generated yet.</p>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="table-light">
                <tr><th>#</th><th>Student</th><th>College ID</th><th>Certificate No.</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={cert.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{cert.studentName}</td>
                    <td>{cert.studentCollegeId}</td>
                    <td><code>{cert.certificateNumber}</code></td>
                    <td><StatusBadge status={cert.status} /></td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => handleDownload(cert)}
                      >
                        Download
                      </Button>
                      {cert.status === 'GENERATED' ? (
                        <span className="text-muted small">Waiting for admin verification</span>
                      ) : (
                        <span className="text-success small">Verified by admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CertificateManager;
