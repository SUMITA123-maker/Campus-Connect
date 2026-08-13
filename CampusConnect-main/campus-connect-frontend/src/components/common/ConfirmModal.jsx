import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, variant = 'danger' }) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body><p>{message}</p></Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant={variant} onClick={onConfirm}>Confirm</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
