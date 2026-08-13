import { Badge } from 'react-bootstrap';

const statusConfig = {
  PENDING_APPROVAL: { bg: 'warning', text: 'dark', label: 'Pending Approval' },
  APPROVED:         { bg: 'success', text: 'white', label: 'Approved' },
  REJECTED:         { bg: 'danger',  text: 'white', label: 'Rejected' },
  ONGOING:          { bg: 'primary', text: 'white', label: 'Ongoing' },
  COMPLETED:        { bg: 'secondary', text: 'white', label: 'Completed' },
  CANCELLED:        { bg: 'dark',    text: 'white', label: 'Cancelled' },
  REGISTERED:       { bg: 'success', text: 'white', label: 'Registered' },
  WAITLISTED:       { bg: 'info',    text: 'white', label: 'Waitlisted' },
  PRESENT:          { bg: 'success', text: 'white', label: 'Present' },
  ABSENT:           { bg: 'danger',  text: 'white', label: 'Absent' },
  NOT_GENERATED:    { bg: 'secondary', text: 'white', label: 'Not Generated' },
  GENERATED:        { bg: 'info',    text: 'white', label: 'Generated' },
  ADMIN_VERIFIED:   { bg: 'primary', text: 'white', label: 'Verified' },
  AVAILABLE_FOR_DOWNLOAD: { bg: 'success', text: 'white', label: 'Ready to Download' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { bg: 'secondary', text: 'white', label: status };
  return (
    <Badge bg={config.bg} text={config.text}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
