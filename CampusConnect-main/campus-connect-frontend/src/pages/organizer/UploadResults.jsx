import { useState, useEffect } from 'react';
import { Container, Card, Table, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getEventRegistrations } from '../../api/eventApi';
import { uploadResults } from '../../api/attendanceApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const POSITIONS = ['1st Place', '2nd Place', '3rd Place', 'Participant', 'Winner', 'Runner-up'];

const UploadResults = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEventRegistrations(eventId)
      .then(({ data }) => {
        setRegistrations(data.filter(r => r.status === 'REGISTERED'));
        const init = {};
        data.forEach(r => { init[r.studentId] = { position: 'Participant', score: '', remarks: '' }; });
        setResults(init);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const updateResult = (studentId, field, value) => {
    setResults(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = Object.entries(results).map(([studentId, r]) => ({
      studentId: parseInt(studentId),
      position: r.position,
      score: r.score ? parseFloat(r.score) : null,
      remarks: r.remarks,
    }));
    try {
      await uploadResults(eventId, payload);
      toast.success('Results uploaded! You can generate certificates from the certificate page.');
    } catch {
      toast.error('Failed to upload results');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">🏆 Upload Event Results</h4>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {registrations.length === 0 ? (
            <p className="p-3 text-muted">No participants to add results for.</p>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-dark">
                <tr><th>#</th><th>Student</th><th>College ID</th><th>Position</th><th>Score</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {registrations.map((r, i) => (
                  <tr key={r.studentId}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.studentCollegeId}</td>
                    <td>
                      <Form.Select size="sm" value={results[r.studentId]?.position || 'Participant'}
                        onChange={e => updateResult(r.studentId, 'position', e.target.value)}>
                        {POSITIONS.map(p => <option key={p}>{p}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control size="sm" type="number" placeholder="Score"
                        value={results[r.studentId]?.score || ''}
                        onChange={e => updateResult(r.studentId, 'score', e.target.value)} />
                    </td>
                    <td>
                      <Form.Control size="sm" placeholder="Optional remarks"
                        value={results[r.studentId]?.remarks || ''}
                        onChange={e => updateResult(r.studentId, 'remarks', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        <Card.Footer className="bg-white">
          <Button variant="success" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Uploading...' : '📤 Upload Results'}
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default UploadResults;
