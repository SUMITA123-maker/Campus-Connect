import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { getPublicGallery, uploadStudentMedia } from '../../api/mediaApi';
import { getCompletedEventsForStudents } from '../../api/eventApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaDownload, FaImage, FaUpload, FaVideo } from 'react-icons/fa';

const MediaGalleryPage = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = () => {
    setLoading(true);
    const completedEventsRequest = user?.role === 'STUDENT'
      ? getCompletedEventsForStudents()
      : Promise.resolve({ data: [] });

    Promise.all([getPublicGallery(), completedEventsRequest])
      .then(([galleryResponse, completedEventsResponse]) => {
        setMedia(galleryResponse.data);
        setCompletedEvents(completedEventsResponse.data);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load gallery'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, [user?.role]);

  const events = useMemo(() => {
    const grouped = new Map();
    media.forEach((item) => {
      if (!grouped.has(item.eventId)) {
        grouped.set(item.eventId, {
          eventId: item.eventId,
          eventTitle: item.eventTitle,
          count: 0,
          cover: null,
          items: [],
        });
      }
      const event = grouped.get(item.eventId);
      event.count += 1;
      event.items.push(item);
      if (!event.cover && item.fileType === 'IMAGE' && item.publicUrl) {
        event.cover = item.publicUrl;
      }
    });
    completedEvents.forEach((event) => {
      if (!grouped.has(event.id)) {
        grouped.set(event.id, {
          eventId: event.id,
          eventTitle: event.title,
          count: 0,
          cover: null,
          items: [],
          isCompleted: true,
        });
      } else {
        grouped.get(event.id).isCompleted = true;
      }
    });
    return Array.from(grouped.values());
  }, [media, completedEvents]);

  const selectedEvent = events.find((event) => event.eventId === selectedEventId);
  const canUploadForSelectedEvent = user?.role === 'STUDENT' && selectedEvent?.isCompleted;

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.publicUrl;
    link.download = item.originalFileName || `event-media-${item.id}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !file) {
      toast.warning('Please select a photo');
      return;
    }

    setUploading(true);
    try {
      await uploadStudentMedia(selectedEventId, file);
      setFile(null);
      e.target.reset();
      toast.success('Photo uploaded. It will appear after admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <div className="gallery-page-header d-flex align-items-center justify-content-between gap-3 mb-4">
        <h3 className="fw-bold mb-0">
          {selectedEvent ? selectedEvent.eventTitle : 'Event Media Gallery'}
        </h3>
        {selectedEvent && (
          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedEventId(null)}>
            <FaArrowLeft className="me-2" />
            Back
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-muted">No media or completed events available yet.</p>
      ) : selectedEvent ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-3">
            {selectedEvent.items.map((item) => (
              <Col key={item.id}>
                <Card className="border-0 shadow-sm h-100">
                  {item.fileType === 'IMAGE' && item.publicUrl ? (
                    <Card.Img
                      variant="top"
                      src={item.publicUrl}
                      style={{ height: 220, objectFit: 'cover' }}
                      alt={item.originalFileName}
                      role="button"
                      onClick={() => setPreview(item)}
                    />
                  ) : (
                    <div className="bg-dark d-flex align-items-center justify-content-center" style={{ height: 220 }}>
                      {item.fileType === 'VIDEO'
                        ? <FaVideo size={48} className="text-white" />
                        : <FaImage size={48} className="text-white" />}
                    </div>
                  )}
                  <Card.Body>
                    <div className="fw-semibold text-truncate">{item.originalFileName}</div>
                    <div className="text-muted small mb-3">
                      Uploaded by {item.uploaderName || 'CampusConnect'}
                      {item.uploaderRole ? ` (${item.uploaderRole.toLowerCase()})` : ''}
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <Badge bg={item.fileType === 'IMAGE' ? 'info' : 'secondary'}>
                        {item.fileType}
                      </Badge>
                      {item.publicUrl && (
                        <Button size="sm" variant="outline-primary" onClick={() => handleDownload(item)}>
                          <FaDownload className="me-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {canUploadForSelectedEvent && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-white fw-semibold">Upload Photo</Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpload}>
                  <Row className="g-2 align-items-end">
                    <Col md={8}>
                      <Form.Label>Select picture</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </Col>
                    <Col md={4}>
                      <Button type="submit" variant="primary" disabled={uploading || !file} className="w-100">
                        <FaUpload className="me-2" />
                        {uploading ? 'Uploading...' : 'Upload for Approval'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          )}

          <Modal show={!!preview} onHide={() => setPreview(null)} centered size="xl">
            <Modal.Header closeButton>
              <Modal.Title>{preview?.originalFileName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-center">
              {preview?.publicUrl && (
                <img
                  src={preview.publicUrl}
                  alt={preview.originalFileName || 'Gallery preview'}
                  className="img-fluid"
                  style={{ maxHeight: '78vh', objectFit: 'contain' }}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              {preview?.publicUrl && (
                <Button variant="primary" onClick={() => handleDownload(preview)}>
                  <FaDownload className="me-2" />
                  Download
                </Button>
              )}
              <Button variant="secondary" onClick={() => setPreview(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Alert variant="info" className="mb-4">
            Select an event to view all approved photos and videos for that event.
          </Alert>
          <Row xs={1} md={2} lg={3} className="g-3">
            {events.map((event) => (
              <Col key={event.eventId}>
                <Card
                  className="border-0 shadow-sm h-100"
                  role="button"
                  onClick={() => setSelectedEventId(event.eventId)}
                >
                  {event.cover ? (
                    <Card.Img
                      variant="top"
                      src={event.cover}
                      style={{ height: 240, objectFit: 'cover' }}
                      alt={event.eventTitle}
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{
                      height: 240,
                      color: '#4f46e5',
                      background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 52%, #ecfeff 100%)',
                    }}>
                      <div className="d-flex align-items-center justify-content-center mb-2" style={{
                        width: 68,
                        height: 68,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 8px 20px rgba(79,70,229,0.12)',
                      }}>
                        <FaImage size={30} />
                      </div>
                    </div>
                  )}
                  <Card.Body>
                    <div className="fw-semibold">{event.eventTitle}</div>
                    <Badge bg="info" className="mt-2">
                      {event.count} {event.count === 1 ? 'file' : 'files'}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default MediaGalleryPage;
