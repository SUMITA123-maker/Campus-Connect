import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, ListGroup, Badge, ProgressBar, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getOrganizerEventMedia, getPublicGallery, uploadMedia } from '../../api/mediaApi';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';

const UploadMedia = () => {
  const { eventId } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);

  const fetchMedia = () =>
    getOrganizerEventMedia(eventId)
      .then(({ data }) => setMediaList(data))
      .catch((err) => {
        if (err.response?.status === 405) {
          getPublicGallery(eventId)
            .then(({ data }) => setMediaList(data))
            .catch(() => toast.error('Failed to load uploaded media'));
          return;
        }
        toast.error(err.response?.data?.message || 'Failed to load uploaded media');
      });

  useEffect(() => { fetchMedia(); }, [eventId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.warning('Please select a file'); return; }
    setUploading(true); setProgress(0);
    try {
      await uploadMedia(eventId, file);
      toast.success('File uploaded! Awaiting admin approval.');
      setFile(null);
      e.target.reset();
      fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); setProgress(0); }
  };

  const fmtSize = (bytes) => bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">📁 Upload Event Media</h4>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white fw-semibold">Upload New File</Card.Header>
        <Card.Body>
          <p className="text-muted small mb-3">
            Supported: Images & Videos. Files over 100MB will be automatically compressed.
            All uploads require admin approval before appearing in the gallery.
          </p>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" accept="image/*,video/*"
                onChange={e => setFile(e.target.files[0])} required />
              {file && (
                <Form.Text className="text-muted">
                  {file.name} ({fmtSize(file.size)})
                  {file.size > 100 * 1024 * 1024 && (
                    <Badge bg="warning" text="dark" className="ms-2">Will be compressed</Badge>
                  )}
                </Form.Text>
              )}
            </Form.Group>
            {uploading && <ProgressBar animated now={progress || 50} className="mb-3" />}
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Uploading...' : '⬆ Upload'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-semibold">Uploaded Files</Card.Header>
        <Card.Body className="p-0">
          {mediaList.length === 0 ? (
            <p className="p-3 text-muted">No media uploaded for this event yet.</p>
          ) : (
            <ListGroup variant="flush">
              {mediaList.map(m => (
                <ListGroup.Item key={m.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    {m.publicUrl && m.fileType === 'IMAGE' ? (
                      <button
                        type="button"
                        className="btn btn-link d-block p-0 fw-semibold text-decoration-none text-start"
                        onClick={() => setPreview(m)}
                      >
                        {m.originalFileName}
                      </button>
                    ) : (
                      <div className="fw-semibold">{m.originalFileName}</div>
                    )}
                    <small className="text-muted">{fmtSize(m.fileSizeBytes)} • {m.fileType}</small>
                    {m.wasCompressed && <Badge bg="info" className="ms-2">Compressed</Badge>}
                  </div>
                  <StatusBadge status={m.status} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Modal show={!!preview} onHide={() => setPreview(null)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{preview?.originalFileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-center">
          {preview?.publicUrl && (
            <img
              src={preview.publicUrl}
              alt={preview.originalFileName || 'Uploaded media preview'}
              className="img-fluid"
              style={{ maxHeight: '78vh', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreview(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UploadMedia;
