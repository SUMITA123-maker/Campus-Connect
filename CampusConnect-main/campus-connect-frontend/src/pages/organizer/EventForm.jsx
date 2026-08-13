import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEventDetail, updateEvent } from '../../api/eventApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const CLUBS = ['Eco Cultural', 'GNX', 'GDSC', 'GDG', 'Phoenix', 'Lensified', 'NSS & NCC', 'CSR', 'Sports'];

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const EventForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEdit = Boolean(eventId);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', venue: '',
    eventDate: '', registrationDeadline: '',
    maxParticipants: '', category: CLUBS[0],
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    if (!isEdit) return;

    getEventDetail(eventId)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          venue: data.venue || '',
          eventDate: toDateTimeLocal(data.eventDate),
          registrationDeadline: toDateTimeLocal(data.registrationDeadline),
          maxParticipants: data.maxParticipants || '',
          category: data.category || CLUBS[0],
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load event'))
      .finally(() => setInitialLoading(false));
  }, [eventId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        maxParticipants: parseInt(form.maxParticipants),
        eventDate: new Date(form.eventDate).toISOString(),
        registrationDeadline: form.registrationDeadline
          ? new Date(form.registrationDeadline).toISOString() : null,
      };

      if (isEdit) {
        await updateEvent(eventId, payload);
        toast.success('Event updated and submitted for admin approval!');
      } else {
        await createEvent(payload);
        toast.success('Event submitted for admin approval!');
      }

      navigate('/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} event`);
    } finally { setLoading(false); }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="event-form-page">
      <Container className="event-form-shell">
        <div className="event-form-heading">
          <Button variant="light" className="event-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft size={12} />
          </Button>
          <div>
            <p className="event-kicker">Organizer Workspace</p>
            <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
          </div>
        </div>

        <Card className="event-form-card">
          <Card.Body className="p-4 p-md-5">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control className="pretty-input" value={form.title} onChange={e => update('title', e.target.value)} required
                placeholder="e.g. Intercollege Tech Fest" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control className="pretty-input" as="textarea" rows={4} value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Add a short description, schedule, rules, or highlights." />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Venue *</Form.Label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt />
                    <Form.Control className="pretty-input" value={form.venue} onChange={e => update('venue', e.target.value)} required
                      placeholder="Auditorium, Lab, Ground..." />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Club *</Form.Label>
                  <Form.Select className="pretty-input pretty-select" value={form.category} onChange={e => update('category', e.target.value)}>
                    {CLUBS.map(c => <option key={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Date & Time *</Form.Label>
                  <div className="input-with-icon">
                    <FaCalendarAlt />
                    <Form.Control className="pretty-input" type="datetime-local" value={form.eventDate}
                      onChange={e => update('eventDate', e.target.value)} required />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Deadline</Form.Label>
                  <div className="input-with-icon">
                    <FaCalendarAlt />
                    <Form.Control className="pretty-input" type="datetime-local" value={form.registrationDeadline}
                      onChange={e => update('registrationDeadline', e.target.value)} />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label>Max Participants *</Form.Label>
              <div className="input-with-icon">
                <FaUsers />
                <Form.Control className="pretty-input" type="number" min={1} value={form.maxParticipants}
                  onChange={e => update('maxParticipants', e.target.value)} required placeholder="100" />
              </div>
            </Form.Group>
            <div className="event-form-actions">
              <Button type="submit" className="submit-event-btn" disabled={loading}>
                {!loading && <FaCheck size={13} />}
                {loading ? 'Submitting...' : isEdit ? 'Update Event' : 'Submit for Approval'}
              </Button>
              <Button className="cancel-event-btn" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </Form>
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .event-form-page {
          min-height: calc(100vh - 72px);
          background:
            linear-gradient(180deg, rgba(255,78,80,0.05), rgba(248,250,252,0) 260px),
            #f8fafc;
          padding: 38px 16px 56px;
        }
        .event-form-shell {
          max-width: 860px;
        }
        .event-form-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }
        .event-back-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.1);
          color: #334155;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(15,23,42,0.08);
        }
        .event-kicker {
          margin: 0 0 2px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0;
        }
        .event-form-heading h2 {
          margin: 0;
          color: #0f172a;
          font-size: 1.75rem;
          font-weight: 800;
        }
        .event-form-card {
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 16px;
          box-shadow: 0 24px 70px rgba(15,23,42,0.1);
          overflow: visible;
        }
        .event-form-card .form-label {
          color: #1e293b;
          font-size: 0.88rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .pretty-input,
        .pretty-select {
          min-height: 48px;
          border: 1px solid #d9e2ec;
          border-radius: 10px;
          color: #0f172a;
          font-size: 0.96rem;
          box-shadow: none;
          transition: border-color .18s ease, box-shadow .18s ease, background-color .18s ease;
        }
        textarea.pretty-input {
          min-height: 136px;
          resize: vertical;
        }
        .pretty-input:focus,
        .pretty-select:focus {
          border-color: #ff4e50;
          box-shadow: 0 0 0 4px rgba(255,78,80,0.14);
        }
        .input-with-icon {
          position: relative;
        }
        .input-with-icon svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 2;
          pointer-events: none;
        }
        .input-with-icon .pretty-input {
          padding-left: 40px;
        }
        .event-form-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 4px;
        }
        .submit-event-btn {
          min-height: 46px;
          border: none;
          border-radius: 10px;
          background: #ff4e50;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 20px;
          font-weight: 700;
          box-shadow: 0 12px 28px rgba(255,78,80,0.28);
        }
        .submit-event-btn:hover,
        .submit-event-btn:focus {
          background: #ef4444;
          box-shadow: 0 14px 32px rgba(255,78,80,0.34);
        }
        .cancel-event-btn {
          min-height: 46px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #475569;
          padding: 0 18px;
          font-weight: 600;
        }
        .cancel-event-btn:hover,
        .cancel-event-btn:focus {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }
        @media (max-width: 576px) {
          .event-form-page {
            padding: 24px 10px 40px;
          }
          .event-form-heading h2 {
            font-size: 1.45rem;
          }
          .event-form-actions > * {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default EventForm;
