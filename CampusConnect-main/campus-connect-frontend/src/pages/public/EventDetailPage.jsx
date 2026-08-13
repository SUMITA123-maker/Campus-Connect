import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';
import { getEventDetail, registerForEvent } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const T = {
  bg: '#F8FAFC',
  panel: '#FFFFFF',
  panel2: '#F1F5F9',
  text: '#0F172A',
  muted: '#475569',
  border: 'rgba(15,23,42,0.1)',
  accent: '#FF4E50',
  green: '#10b981',
};

const formatDate = (value, options) =>
  value
    ? new Date(value).toLocaleString(undefined, options)
    : 'Not announced';

const isAlreadyRegisteredError = (err) =>
  err.response?.data?.message?.toLowerCase().includes('already registered');

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    getEventDetail(eventId)
      .then(({ data }) => setEvent(data))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load event details');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleRegister = async () => {
    if (!event || registering) return;
    setRegistering(true);
    try {
      await registerForEvent(event.id);
      toast.success('Registered successfully!');
      const { data } = await getEventDetail(event.id);
      setEvent(data);
    } catch (err) {
      if (isAlreadyRegisteredError(err)) {
        toast.info('Already registered for this event');
        navigate('/student/dashboard');
        return;
      }
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', color: T.text }}>
        <Container className="py-5">
          <Button as={Link} to="/" variant="outline-light" size="sm">
            <FaArrowLeft className="me-2" /> Back to events
          </Button>
          <p className="mt-4" style={{ color: T.muted }}>Event details could not be loaded.</p>
        </Container>
      </div>
    );
  }

  const registeredCount = event.registeredCount || 0;
  const maxParticipants = event.maxParticipants || 0;
  const fillPct = maxParticipants ? Math.min(100, Math.round((registeredCount / maxParticipants) * 100)) : 0;
  const isFull = maxParticipants > 0 && registeredCount >= maxParticipants;
  const canRegister = event.status === 'APPROVED' && !isFull;
  const registerLabel = event.status !== 'APPROVED'
    ? 'Registration Closed'
    : isFull
      ? 'Event Full'
      : registering
        ? 'Registering...'
        : 'Register';
  const eventDate = formatDate(event.eventDate, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const deadline = formatDate(event.registrationDeadline, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text }}>
      <Container className="py-5">
        <Button as={Link} to="/" variant="outline-light" size="sm" className="mb-4">
          <FaArrowLeft className="me-2" /> Back to events
        </Button>

        <div style={{
          background: T.panel,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            padding: '32px clamp(20px, 5vw, 48px)',
            background: 'linear-gradient(135deg, #1d4ed8, #db2777)',
          }}>
            {event.category && (
              <Badge style={{ background: '#0ea5e9', borderRadius: 50, padding: '8px 12px' }}>
                {event.category}
              </Badge>
            )}
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginTop: 16, marginBottom: 12 }}>
              {event.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 760, margin: 0 }}>
              Organized by {event.organizerName || 'CampusConnect'}
            </p>
          </div>

          <div style={{ padding: '28px clamp(20px, 5vw, 48px)' }}>
            <Row className="g-4">
              <Col lg={8}>
                <h5 className="fw-bold mb-3">About this event</h5>
                <p style={{ color: T.muted, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {event.description || 'No description has been added for this event yet.'}
                </p>
              </Col>

              <Col lg={4}>
                <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <FaCalendarAlt color={T.accent} className="mt-1" />
                    <div>
                      <div className="fw-semibold">Date and time</div>
                      <div style={{ color: T.muted, fontSize: '0.92rem' }}>{eventDate}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <FaMapMarkerAlt color="#ec4899" className="mt-1" />
                    <div>
                      <div className="fw-semibold">Venue</div>
                      <div style={{ color: T.muted, fontSize: '0.92rem' }}>{event.venue || 'Not announced'}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <FaClock color="#f59e0b" className="mt-1" />
                    <div>
                      <div className="fw-semibold">Registration deadline</div>
                      <div style={{ color: T.muted, fontSize: '0.92rem' }}>{deadline}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <FaUserTie color="#8b5cf6" className="mt-1" />
                    <div>
                      <div className="fw-semibold">Organizer</div>
                      <div style={{ color: T.muted, fontSize: '0.92rem' }}>{event.organizerName || 'CampusConnect'}</div>
                    </div>
                  </div>

                  {event.organizerEmail && (
                    <div className="d-flex align-items-start gap-3 mb-4">
                      <FaEnvelope color="#06b6d4" className="mt-1" />
                      <div>
                        <div className="fw-semibold">Contact</div>
                        <div style={{ color: T.muted, fontSize: '0.92rem', overflowWrap: 'anywhere' }}>
                          {event.organizerEmail}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2" style={{ color: T.muted }}>
                      <span><FaUsers className="me-2" />{registeredCount} / {maxParticipants}</span>
                      <span style={{ color: T.green, fontWeight: 700 }}>{fillPct}% filled</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.09)', borderRadius: 50, overflow: 'hidden' }}>
                      <div style={{ width: `${fillPct}%`, height: '100%', background: T.green }} />
                    </div>
                  </div>

                  {user?.role === 'STUDENT' ? (
                    <Button
                      onClick={handleRegister}
                      disabled={!canRegister || registering}
                      style={{ width: '100%', borderRadius: 50, border: 'none', fontWeight: 700, background: canRegister ? T.accent : '#64748b' }}
                    >
                      {registerLabel}
                    </Button>
                  ) : (
                    <Button as={Link} to={user ? '/student/dashboard' : '/login'} style={{
                      width: '100%',
                      borderRadius: 50,
                      border: 'none',
                      fontWeight: 700,
                      background: T.accent,
                    }}>
                      {user ? 'Go to Dashboard' : 'Login to Register'}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventDetailPage;
