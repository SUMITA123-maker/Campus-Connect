import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaGithub, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => (
  <footer style={{ background: 'linear-gradient(180deg,#F8FAFC 0%,#EEF2FF 100%)', borderTop: '1px solid rgba(79,70,229,0.14)', color: '#475569' }}>
    <Container style={{ padding: '52px 16px 24px' }}>
      <Row className="gy-4">

        {/* Brand */}
        <Col md={4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              background: 'linear-gradient(135deg,#FF4E50,#4F46E5)',
              borderRadius: 10, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaGraduationCap size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Campus<span style={{ color: '#FF4E50' }}>Connect</span>
            </span>
          </div>
          <p style={{ fontSize: '0.87rem', lineHeight: 1.75, marginBottom: 0 }}>
            A unified platform for college event management — from registration to results and verified certificates.
          </p>
        </Col>

        {/* Explore */}
        <Col md={2} xs={6}>
          <p style={{ color: '#0F172A', fontWeight: 700, marginBottom: 16, fontSize: '0.88rem', letterSpacing: 0.5 }}>
            EXPLORE
          </p>
          {[
            { label: 'Home',     to: '/' },
            { label: 'About',    to: '/about' },
            { label: 'Gallery',  to: '/media/gallery' },
            { label: 'Login',    to: '/login' },
            { label: 'Register', to: '/register' },
          ].map(l => (
            <div key={l.to} style={{ marginBottom: 10 }}>
              <Link to={l.to} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#FF4E50'}
                onMouseLeave={e => e.target.style.color = '#64748B'}>
                {l.label}
              </Link>
            </div>
          ))}
        </Col>

        {/* Portals */}
        <Col md={2} xs={6}>
          <p style={{ color: '#0F172A', fontWeight: 700, marginBottom: 16, fontSize: '0.88rem', letterSpacing: 0.5 }}>
            PORTALS
          </p>
          {[
            { label: 'Student',   to: '/student/dashboard' },
            { label: 'Organizer', to: '/organizer/dashboard' },
          ].map(l => (
            <div key={l.to} style={{ marginBottom: 10 }}>
              <Link to={l.to} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem' }}
                onMouseEnter={e => e.target.style.color = '#FF4E50'}
                onMouseLeave={e => e.target.style.color = '#64748B'}>
                {l.label}
              </Link>
            </div>
          ))}
        </Col>

        {/* Contact */}
        <Col md={4}>
          <p style={{ color: '#0F172A', fontWeight: 700, marginBottom: 16, fontSize: '0.88rem', letterSpacing: 0.5 }}>
            CONTACT
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, fontSize: '0.85rem' }}>
            <FaEnvelope color="#FF4E50" />
            <span>support@campusconnect.edu</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#FFFFFF', border: '1px solid rgba(79,70,229,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'background .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,78,80,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='#FFFFFF'}>
              <FaGithub size={16} color="#0F172A" />
            </div>
          </div>
        </Col>
      </Row>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(79,70,229,0.12)',
        marginTop: 40, paddingTop: 22,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8, fontSize: '0.81rem',
      }}>
        <span>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          Made with <FaHeart color="#e91e8c" style={{ margin: '0 4px' }} /> for students
        </span>
      </div>
    </Container>
  </footer>
);

export default Footer;
