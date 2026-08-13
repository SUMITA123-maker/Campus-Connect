import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaCalendar, FaUsers, FaImage, FaCertificate, FaClipboard, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { icon: <FaCalendar />, label: 'Total Events', value: stats?.totalEvents, color: 'primary', link: null },
    { icon: <FaClipboard />, label: 'Pending Events', value: stats?.pendingEvents, color: 'warning', link: '/admin/events/pending' },
    { icon: <FaCheckCircle />, label: 'Approved Events', value: stats?.approvedEvents, color: 'success', link: null },
    { icon: <FaUsers />, label: 'Total Students', value: stats?.totalStudents, color: 'info', link: null },
    { icon: <FaUsers />, label: 'Total Organizers', value: stats?.totalOrganizers, color: 'secondary', link: null },
    { icon: <FaImage />, label: 'Pending Media', value: stats?.pendingMedia, color: 'danger', link: '/admin/media/pending' },
    { icon: <FaCertificate />, label: 'Pending Certificates', value: stats?.pendingCertificates, color: 'warning', link: '/admin/certificates' },
    { icon: <FaUsers />, label: 'Total Registrations', value: stats?.totalRegistrations, color: 'primary', link: null },
  ];

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-1">Admin Dashboard</h3>
      <p className="text-muted mb-4">System overview and management</p>

      <Row xs={1} md={2} lg={4} className="g-3">
        {cards.map((c, i) => (
          <Col key={i}>
            <Card
              as={c.link ? Link : 'div'}
              to={c.link}
              className="border-0 shadow-sm h-100 text-decoration-none stat-card"
              style={{ borderLeftColor: `var(--bs-${c.color})`, borderLeft: `4px solid` }}
            >
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`text-${c.color} fs-3`}>{c.icon}</div>
                <div>
                  <div className="fs-2 fw-bold">{c.value ?? '—'}</div>
                  <div className="text-muted small">{c.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4 g-3">
        {[
          { title: 'Event Approvals', desc: 'Review and approve/reject organizer event submissions', link: '/admin/events/pending', btn: 'Review Events', color: 'warning' },
          { title: 'Media Approvals', desc: 'Verify and approve media files uploaded by organizers', link: '/admin/media/pending', btn: 'Review Media', color: 'info' },
          { title: 'Certificate Management', desc: 'Generate and verify student participation certificates', link: '/admin/certificates', btn: 'Manage Certs', color: 'success' },
        ].map((q, i) => (
          <Col md={4} key={i}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-semibold">{q.title}</h5>
                <p className="text-muted small">{q.desc}</p>
                <Link to={q.link} className={`btn btn-${q.color} btn-sm`}>{q.btn} →</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
