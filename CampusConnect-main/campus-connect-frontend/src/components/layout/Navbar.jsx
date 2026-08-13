import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const roleHome = {
  ADMIN: '/admin/dashboard',
  ORGANIZER: '/organizer/dashboard',
  STUDENT: '/student/dashboard',
};

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar className="app-navbar" expand="lg" sticky="top" style={{
      background: 'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,247,245,0.97) 48%, rgba(238,242,255,0.97) 100%)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,78,80,0.16)',
      boxShadow: '0 10px 30px rgba(15,23,42,0.07)',
      padding: '10px 0',
    }}>
      <Container fluid>
        <Navbar.Brand className="app-navbar-brand" as={Link} to="/" style={{
          fontWeight: 800,
          fontSize: '1.35rem',
          color: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'linear-gradient(135deg,#FF4E50,#4F46E5)',
            borderRadius: 10,
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FaGraduationCap size={18} color="#fff" />
          </div>
          <span style={{ color: '#0F172A' }}>Campus<span style={{ color: '#FF4E50' }}>Connect</span></span>
        </Navbar.Brand>

        <Navbar.Toggle style={{ borderColor: 'rgba(15,23,42,0.16)' }}>
          <span style={{
            display: 'block', width: 22, height: 2,
            background: '#0F172A', margin: '5px 0',
            borderRadius: 2,
          }}/>
          <span style={{
            display: 'block', width: 22, height: 2,
            background: '#0F172A', margin: '5px 0',
            borderRadius: 2,
          }}/>
          <span style={{
            display: 'block', width: 22, height: 2,
            background: '#0F172A', margin: '5px 0',
            borderRadius: 2,
          }}/>
        </Navbar.Toggle>

        <Navbar.Collapse className="app-navbar-collapse">
          <Nav className="primary-navigation me-auto" style={{ gap: 4 }}>
            {[
              { label: 'Home', to: '/' },
              { label: 'About', to: '/about' },
              { label: 'Gallery', to: '/media/gallery' },
            ].map(item => (
              <Nav.Link key={item.to} as={Link} to={item.to} style={{
                color: '#334155',
                fontWeight: 500,
                fontSize: '0.95rem',
                padding: '6px 14px',
                borderRadius: 8,
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.target.style.color='#FF4E50'; e.target.style.background='rgba(255,78,80,0.1)'; }}
                onMouseLeave={e => { e.target.style.color='#334155'; e.target.style.background='transparent'; }}>
                {item.label}
              </Nav.Link>
            ))}
            {user && (
              <Nav.Link as={Link} to={roleHome[user.role]} style={{
                color: '#334155',
                fontWeight: 500,
                fontSize: '0.95rem',
                padding: '6px 14px',
                borderRadius: 8,
              }}
                onMouseEnter={e => { e.target.style.color='#FF4E50'; e.target.style.background='rgba(255,78,80,0.1)'; }}
                onMouseLeave={e => { e.target.style.color='#334155'; e.target.style.background='transparent'; }}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Nav className="account-navigation" style={{ alignItems: 'center', gap: 8 }}>
            {user ? (
              <NavDropdown
                title={
                  <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#FF4E50,#4F46E5)',
                      fontSize: 13, fontWeight: 700, marginRight: 8, color: '#fff',
                    }}>
                      {(user.fullName || user.email || '?')[0].toUpperCase()}
                    </span>
                    {user.fullName?.split(' ')[0] || user.email}
                  </span>
                }
                align="end"
                style={{ color: '#0F172A' }}
              >
                <NavDropdown.Item disabled style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                  {user.role}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} style={{ color: '#ff6b6b' }}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '6px 16px',
                }}>
                  Login
                </Nav.Link>
                <Button as={Link} to="/register" size="sm" style={{
                  background: 'linear-gradient(135deg,#FF4E50,#4F46E5)',
                  border: 'none',
                  borderRadius: 50,
                  padding: '8px 22px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(255,78,80,0.32)',
                }}>
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
