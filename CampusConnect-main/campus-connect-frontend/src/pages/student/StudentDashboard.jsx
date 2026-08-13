import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getMyRegistrations } from '../../api/eventApi';
import { getMyCertificates, downloadCertificate } from '../../api/certificateApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaCalendarCheck, FaCertificate, FaImages, FaTicketAlt } from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyRegistrations(), getMyCertificates()])
      .then(([regRes, certRes]) => {
        setRegistrations(regRes.data);
        setCertificates(certRes.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const activeRegs = registrations.filter(r => r.status === 'REGISTERED');
  const readyCerts = certificates.filter(c => c.status === 'AVAILABLE_FOR_DOWNLOAD');

  const handleDownload = async (certId, certNumber) => {
    try {
      const { data } = await downloadCertificate(certId);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  const stats = [
    { icon: <FaTicketAlt size={28} />, label: 'Active Registrations', value: activeRegs.length, color: 'primary', link: '/student/registrations' },
    { icon: <FaCertificate size={28} />, label: 'Certificates Ready', value: readyCerts.length, color: 'success', link: '/student/certificates' },
    { icon: <FaCalendarCheck size={28} />, label: 'Total Registrations', value: registrations.length, color: 'info', link: '/student/registrations' },
    { icon: <FaImages size={28} />, label: 'Media Gallery', value: '📸', color: 'warning', link: '/media/gallery' },
  ];

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-1">Welcome, {user?.fullName}! 👋</h3>
      <p className="text-muted mb-4">Here's your activity overview</p>

      <Row xs={1} md={2} lg={4} className="g-3 mb-4">
        {stats.map((s, i) => (
          <Col key={i}>
            <Card as={Link} to={s.link} className="stat-card text-decoration-none border-0 shadow-sm h-100"
              style={{ borderLeftColor: `var(--bs-${s.color})` }}>
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`text-${s.color}`}>{s.icon}</div>
                <div>
                  <div className="fs-3 fw-bold">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold">Recent Registrations</Card.Header>
            <Card.Body className="p-0">
              {activeRegs.length === 0 ? (
                <p className="text-muted p-3">No active registrations.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {activeRegs.slice(0, 5).map(r => (
                    <li key={r.id} className="list-group-item">
                      <div className="fw-semibold">{r.eventTitle}</div>
                      <small className="text-muted">{new Date(r.eventDate).toLocaleDateString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold">Certificates Available</Card.Header>
            <Card.Body className="p-0">
              {readyCerts.length === 0 ? (
                <p className="text-muted p-3">No certificates ready for download yet.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {readyCerts.slice(0, 5).map(c => (
                    <li key={c.id} className="list-group-item d-flex align-items-center justify-content-between gap-3">
                      <div>
                        <div className="fw-semibold">{c.eventTitle}</div>
                        <small className="text-muted">Cert #: {c.certificateNumber}</small>
                      </div>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDownload(c.id, c.certificateNumber)}
                      >
                        Download PDF
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
