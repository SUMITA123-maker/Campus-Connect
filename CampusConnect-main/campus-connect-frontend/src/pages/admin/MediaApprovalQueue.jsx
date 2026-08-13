import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { getPendingMedia, getAdminMediaFile, approveMedia, rejectMedia } from '../../api/mediaApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MediaApprovalQueue = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ show: false, mediaId: null });
  const [previewModal, setPreviewModal] = useState({ show: false, media: null, url: null });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetch = () =>
    getPendingMedia().then(({ data }) => setMedia(data)).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  useEffect(() => () => {
    if (previewModal.url) URL.revokeObjectURL(previewModal.url);
  }, [previewModal.url]);

  const fmtSize = (bytes) => bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;

  const handlePreview = async (item) => {
    setProcessing(true);
    try {
      const { data } = await getAdminMediaFile(item.id);
      const url = URL.createObjectURL(data);
      setPreviewModal((current) => {
        if (current.url) URL.revokeObjectURL(current.url);
        return { show: true, media: item, url };
      });
    } catch (error) {
      const status = error.response?.status;
      toast.error(status ? `Preview failed (${status})` : 'Preview failed');
    } finally {
      setProcessing(false);
    }
  };

  const closePreview = () => {
    setPreviewModal((current) => {
      if (current.url) URL.revokeObjectURL(current.url);
      return { show: false, media: null, url: null };
    });
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await approveMedia(id);
      toast.success('Media approved and moved to gallery!');
      fetch();
    } catch { toast.error('Approval failed'); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await rejectMedia(rejectModal.mediaId, remarks);
      toast.warning('Media rejected');
      setRejectModal({ show: false, mediaId: null }); setRemarks('');
      fetch();
    } catch { toast.error('Rejection failed'); }
    finally { setProcessing(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">Media Approval Queue
        <Badge bg="warning" text="dark" className="ms-2">{media.length} Pending</Badge>
      </h4>

      {media.length === 0 ? (
        <Alert variant="success">No pending media to review!</Alert>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>File</th><th>Event</th><th>Uploaded By</th><th>Type</th><th>Size</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {media.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>
                  <div className="fw-semibold">{m.originalFileName}</div>
                  {m.wasCompressed && <Badge bg="info" className="mt-1">Compressed</Badge>}
                </td>
                <td>{m.eventTitle}</td>
                <td>{m.uploaderName}</td>
                <td><Badge bg={m.fileType === 'IMAGE' ? 'primary' : 'secondary'}>{m.fileType}</Badge></td>
                <td>{fmtSize(m.fileSizeBytes)}</td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1" disabled={processing}
                    onClick={() => handlePreview(m)}>View</Button>
                  <Button size="sm" variant="success" className="me-1" disabled={processing}
                    onClick={() => handleApprove(m.id)}>Approve</Button>
                  <Button size="sm" variant="danger" disabled={processing}
                    onClick={() => setRejectModal({ show: true, mediaId: m.id })}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={previewModal.show} onHide={closePreview} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{previewModal.media?.originalFileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewModal.media?.fileType === 'IMAGE' ? (
            <img
              src={previewModal.url}
              alt={previewModal.media?.originalFileName || 'Media preview'}
              className="img-fluid rounded"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          ) : (
            <video
              src={previewModal.url}
              controls
              className="w-100 rounded"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePreview}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={rejectModal.show} onHide={() => setRejectModal({ show: false })} centered>
        <Modal.Header closeButton><Modal.Title>Reject Media</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Rejection Reason</Form.Label>
            <Form.Control as="textarea" rows={3} value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Reason for rejection..." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectModal({ show: false })}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} disabled={!remarks.trim() || processing}>
            Confirm Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MediaApprovalQueue;
