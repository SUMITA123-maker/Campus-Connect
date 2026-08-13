import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { getMyCertificates, downloadCertificate } from '../../api/certificateApi';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCertificates()
      .then(({ data }) => setCerts(data))
      .finally(() => setLoading(false));
  }, []);

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
    } catch {
      toast.error('Download failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">🏅 My Certificates</h4>
      {certs.length === 0 ? (
        <p className="text-muted">No certificates available yet.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Event</th><th>Cert Number</th><th>Status</th><th>Generated</th><th>Action</th></tr>
          </thead>
          <tbody>
            {certs.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{c.eventTitle}</td>
                <td><code>{c.certificateNumber}</code></td>
                <td><StatusBadge status={c.status} /></td>
                <td>{c.generatedAt ? new Date(c.generatedAt).toLocaleDateString() : '—'}</td>
                <td>
                  {c.status === 'AVAILABLE_FOR_DOWNLOAD' ? (
                    <Button size="sm" variant="success"
                      onClick={() => handleDownload(c.id, c.certificateNumber)}>
                      ⬇ Download PDF
                    </Button>
                  ) : (
                    <span className="text-muted small">Awaiting verification</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyCertificates;
