import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaGraduationCap, FaArrowRight, FaBullhorn, FaUserGraduate,
  FaCalendarAlt, FaCertificate, FaTrophy, FaUsers,
  FaLaptopCode, FaCode, FaCamera, FaFlag, FaHeart,
  FaRunning, FaPalette, FaLeaf, FaFire, FaMusic, FaUserShield,
  FaCheckCircle, FaRocket, FaShieldAlt, FaHeart as FaHeartSolid,
} from 'react-icons/fa';

const T = {
  bg0: '#FFFFFF', bg1: '#F8FAFC', bg2: '#FFFFFF', bg3: '#F1F5F9',
  border: 'rgba(15,23,42,0.1)', text: '#0F172A',
  muted: '#475569', accent: '#FF4E50', secondary: '#4F46E5',
};

const CLUBS = [
  { name: 'Eco Cultural', icon: <FaPalette />, gradient: 'linear-gradient(135deg,#e91e8c,#9c27b0)', desc: 'Cultural fests, dance & performances' },
  { name: 'GNX',          icon: <FaLaptopCode />, gradient: 'linear-gradient(135deg,#6d28d9,#4c1d95)', desc: 'Tech competitions & hackathons' },
  { name: 'GDSC',         icon: <FaCode />,    gradient: 'linear-gradient(135deg,#4F46E5,#312E81)', desc: 'Google Developer Student Clubs' },
  { name: 'GDG',          icon: <FaUsers />,   gradient: 'linear-gradient(135deg,#0891b2,#0e7490)', desc: 'Google Developer Groups community' },
  { name: 'Phoenix',      icon: <FaFire />,    gradient: 'linear-gradient(135deg,#FF4E50,#4F46E5)', desc: 'Innovation, builds & tech events' },
  { name: 'Lensified',    icon: <FaCamera />,  gradient: 'linear-gradient(135deg,#475569,#1e293b)', desc: 'Photography & videography club' },
  { name: 'NSS & NCC',    icon: <FaFlag />,    gradient: 'linear-gradient(135deg,#15803d,#14532d)', desc: 'Service, discipline & social impact' },
  { name: 'CSR',          icon: <FaHeart />,   gradient: 'linear-gradient(135deg,#dc2626,#991b1b)', desc: 'Community service & outreach' },
  { name: 'Sports',       icon: <FaRunning />, gradient: 'linear-gradient(135deg,#ea580c,#c2410c)', desc: 'Athletics, tournaments & sports meets' },
];

const VALUES = [
  { icon: <FaRocket size={22} />,      color: '#FF4E50', title: 'Student First',    desc: 'Every feature is built around making campus life easier, more connected, and more rewarding for students.' },
  { icon: <FaShieldAlt size={22} />,   color: '#10b981', title: 'Transparency',     desc: 'From event approvals to result publishing — every step is visible and accountable.' },
  { icon: <FaHeartSolid size={22} />,  color: '#e91e8c', title: 'Community Driven', desc: 'We amplify the work of every club and organizer so their efforts reach every student on campus.' },
  { icon: <FaCertificate size={22} />, color: '#f59e0b', title: 'Recognition',      desc: 'Every participant deserves recognition. Verified digital certificates ensure your achievements are permanent.' },
];

const STATS = [
  { val: '9',    label: 'Active Clubs',        color: '#FF4E50', icon: <FaUsers /> },
  { val: '120+', label: 'Events Hosted',       color: '#e91e8c', icon: <FaCalendarAlt /> },
  { val: '5K+',  label: 'Students Registered', color: '#10b981', icon: <FaUserGraduate /> },
  { val: '3K+',  label: 'Certificates Issued', color: '#f59e0b', icon: <FaCertificate /> },
];

const AboutPage = () => (
  <div style={{ background: T.bg1, minHeight: '100vh', color: T.text }}>

    {/* ── HERO ── */}
    <div style={{
      background: T.bg0, borderBottom: `1px solid ${T.border}`,
      padding: '80px 16px 70px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <Container style={{ position:'relative', zIndex:2 }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(255,78,80,0.12)', border:'1px solid rgba(255,78,80,0.24)',
          borderRadius:50, padding:'6px 18px', marginBottom:24,
        }}>
          <FaGraduationCap color={T.accent} size={13}/>
          <span style={{ color:T.accent, fontSize:'0.78rem', fontWeight:700, letterSpacing:1 }}>ABOUT CAMPUSCONNECT</span>
        </div>

        <h1 style={{ fontSize:'clamp(2rem,5vw,3.4rem)', fontWeight:900, color:T.text, lineHeight:1.15, marginBottom:20 }}>
          One platform for every<br/>
          <span style={{ color:T.accent }}>campus event.</span>
        </h1>
        <p style={{ color: T.muted, fontSize:'1.05rem', maxWidth:560, margin:'0 auto 36px', lineHeight:1.75 }}>
          CampusConnect was built to bridge the gap between clubs and students — making it effortless to discover, participate, and get recognised for campus activities.
        </p>

        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <Link to="/register" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background: T.accent, color:'#fff', fontWeight:700,
            padding:'12px 28px', borderRadius:50, textDecoration:'none',
            boxShadow:'0 10px 28px rgba(255,78,80,0.24)',
          }}>
            Get Started <FaArrowRight size={13}/>
          </Link>
          <Link to="/" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(255,255,255,0.07)', color:'#fff', fontWeight:600,
            padding:'12px 28px', borderRadius:50, textDecoration:'none',
            border:'1px solid rgba(255,255,255,0.15)',
          }}>
            View Events
          </Link>
        </div>
      </Container>
    </div>

    {/* ── STATS ── */}
    <div style={{ background: T.bg0, borderBottom:`1px solid ${T.border}` }}>
      <Container>
        <Row>
          {STATS.map((s, i) => (
            <Col key={i} xs={6} md={3} style={{ borderRight: i < 3 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ padding:'28px 20px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{
                  width:48, height:48, borderRadius:13,
                  background: s.color + '20',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: s.color, fontSize:20, flexShrink:0,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:'1.8rem', fontWeight:900, color:'#fff', lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:'0.75rem', color: T.muted, marginTop:3 }}>{s.label}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    {/* ── OUR STORY ── */}
    <div style={{ padding:'72px 0', borderBottom:`1px solid ${T.border}` }}>
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6}>
            <span style={{
              background:'rgba(16,185,129,0.12)', color:'#34d399',
              borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
            }}>OUR STORY</span>
            <h2 style={{ fontWeight:900, color:'#fff', fontSize:'clamp(1.6rem,3vw,2.2rem)', marginTop:16, marginBottom:16, lineHeight:1.25 }}>
              Built for students,<br/>by people who care.
            </h2>
            <p style={{ color: T.muted, lineHeight:1.8, marginBottom:16 }}>
              Managing college events used to mean scattered WhatsApp groups, paper registrations, and lost certificates. CampusConnect was created to change that — a single digital space where every event gets the visibility it deserves.
            </p>
            <p style={{ color: T.muted, lineHeight:1.8, marginBottom:0 }}>
              From a student submitting their first event registration to an organizer publishing results within minutes of an event ending — CampusConnect makes every step seamless.
            </p>
          </Col>
          <Col md={6}>
            <Row className="g-3">
              {[
  { icon: <FaCalendarAlt size={18}/>, color:'#FF4E50', title:'Easy Registration', desc:'One click to register for any approved campus event.' },
                { icon: <FaBullhorn size={18}/>,    color:'#e91e8c', title:'Club Management',   desc:'Organizers manage events, media, and results from one dashboard.' },
                { icon: <FaCertificate size={18}/>, color:'#10b981', title:'Digital Certificates', desc:'Verified PDF certificates downloadable any time.' },
                { icon: <FaTrophy size={18}/>,      color:'#f59e0b', title:'Results & Rankings', desc:'Event results published instantly for all participants to see.' },
              ].map((f, i) => (
                <Col key={i} xs={12} sm={6}>
                  <div style={{
                    background: T.bg2, border:`1px solid ${T.border}`,
                    borderRadius:14, padding:'20px 18px',
                    transition:'border-color .2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = f.color + '55'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                  >
                    <div style={{
                      width:40, height:40, borderRadius:11,
                      background: f.color + '18', color: f.color,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      marginBottom:12,
                    }}>{f.icon}</div>
                    <h6 style={{ color:'#fff', fontWeight:700, marginBottom:6 }}>{f.title}</h6>
                    <p style={{ color: T.muted, fontSize:'0.82rem', lineHeight:1.6, margin:0 }}>{f.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>

    {/* ── OUR CLUBS ── */}
    <div style={{ background: T.bg0, padding:'72px 0', borderBottom:`1px solid ${T.border}` }}>
      <Container>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span style={{
              background:'rgba(255,78,80,0.12)', color:T.accent,
            borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
          }}>OUR CLUBS</span>
          <h2 style={{ fontWeight:900, color:'#fff', marginTop:14, marginBottom:10 }}>
            9 Clubs, One Platform
          </h2>
          <p style={{ color: T.muted, maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
            Every club on campus has a home here — from technical hackathons to cultural performances and community service.
          </p>
        </div>

        <Row className="g-3">
          {CLUBS.map((club, i) => (
            <Col key={i} xs={12} sm={6} md={4}>
              <div style={{
                background: T.bg2, border:`1px solid ${T.border}`,
                borderRadius:16, padding:'22px 20px',
                display:'flex', alignItems:'center', gap:16,
                transition:'transform .2s, border-color .2s, box-shadow .2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform='translateY(-3px)';
                  e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.35)';
                  e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform='translateY(0)';
                  e.currentTarget.style.boxShadow='none';
                  e.currentTarget.style.borderColor=T.border;
                }}
              >
                <div style={{
                  width:46, height:46, borderRadius:13, flexShrink:0,
                  background: club.gradient,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontSize:18,
                  boxShadow:'0 4px 14px rgba(0,0,0,0.3)',
                }}>{club.icon}</div>
                <div>
                  <div style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', marginBottom:3 }}>{club.name}</div>
                  <div style={{ color: T.muted, fontSize:'0.78rem', lineHeight:1.4 }}>{club.desc}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    {/* ── VALUES ── */}
    <div style={{ padding:'72px 0', borderBottom:`1px solid ${T.border}` }}>
      <Container>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span style={{
            background:'rgba(233,30,140,0.12)', color:'#f472b6',
            borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
          }}>WHAT WE STAND FOR</span>
          <h2 style={{ fontWeight:900, color:'#fff', marginTop:14, marginBottom:8 }}>Our Values</h2>
          <p style={{ color: T.muted, maxWidth:400, margin:'0 auto' }}>
            The principles that guide every decision we make.
          </p>
        </div>
        <Row className="g-4">
          {VALUES.map((v, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <div style={{
                background: T.bg2, border:`1px solid ${T.border}`,
                borderRadius:18, padding:'30px 24px', height:'100%',
                textAlign:'center',
                transition:'transform .2s, border-color .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor=v.color+'55'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=T.border; }}
              >
                <div style={{
                  width:58, height:58, borderRadius:16,
                  background: v.color + '18', color: v.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 18px',
                }}>{v.icon}</div>
                <h5 style={{ color:'#fff', fontWeight:800, marginBottom:10 }}>{v.title}</h5>
                <p style={{ color: T.muted, fontSize:'0.85rem', lineHeight:1.7, margin:0 }}>{v.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    {/* ── FOR STUDENTS & ORGANIZERS ── */}
    <div style={{ background: T.bg0, padding: '72px 0', borderBottom: `1px solid ${T.border}` }}>
  <Container>
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <span style={{
        background: 'rgba(16,185,129,0.12)', color: '#34d399',
        borderRadius: 50, padding: '5px 16px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: 1,
      }}>WHO IT'S FOR</span>
      <h2 style={{ fontWeight: 900, color: '#fff', marginTop: 14, marginBottom: 8 }}>Built for Everyone on Campus</h2>
    </div>

    <Row className="g-4 justify-content-center">
      {[
        {
          icon: <FaUserGraduate size={20}/>, 
          label: 'Students', 
      color: '#FF4E50',
      glow: 'rgba(255,78,80,0.2)',
          // Added Unsplash background reference link to match card layout
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60', 
          points: [
            'Browse & register for events',
            'Track all your registrations',
            'Download verified certificates',
            'View event results & rankings',
          ],
          to: '/register',
          btnLabel: 'Join as Student'
        },
        {
          icon: <FaBullhorn size={20}/>, 
          label: 'Organizers', 
          color: '#e91e8c', 
          glow: 'rgba(233,30,140,0.2)',
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
          points: [
            'Create & manage events',
            'Upload photos & videos',
            'Mark attendance digitally',
            'Publish results instantly',
          ],
          to: '/register',
          btnLabel: 'Join as Organizer'
        },
        {
          icon: <FaUserShield size={20}/>, 
          label: 'Admins', 
          color: '#f59e0b', // Amber theme color
          glow: 'rgba(245,158,11,0.2)',
          // Dashboard admin analytics graphics context
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
          points: [
            'Review & approve club events',
            'Manage user system roles',
            'Monitor platform statistics',
            'Configure global parameters',
          ],
          to: '/admin/login',
          btnLabel: 'Login as Admin'
        },
      ].map((r, i) => (
        /* Changed Bootstrap layout to lg={4} / md={6} so 3 cards stack gracefully on tablet, split cleanly on desktop */
        <Col key={i} lg={4} md={6} xs={12}>
          <div style={{
            background: '#111827', // Matching your dark theme card canvas color wrapper
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 20,
            overflow: 'hidden', // Required to crop image corners to match radius
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform .25s, box-shadow .25s, border-color .25s',
          }}
            className="event-card"
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 20px 50px ${r.glow}`; e.currentTarget.style.borderColor=r.color+'44'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}
          >
            <div>
              {/* Dynamic top banner render matching your UI header screenshot */}
              <div style={{ 
                position: 'relative', 
                height: 150, 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(17,24,39,0.95)), url(${r.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: r.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r.icon}</div>
                  <h3 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: '1.35rem' }}>{r.label}</h3>
                </div>
              </div>

              {/* Points checklist inner text rendering panel wrapper */}
              <div style={{ padding: '24px 24px 10px 24px' }}>
                {r.points.map((pt, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: '0.88rem', color: '#9ca3af' }}>
                    <FaCheckCircle color={r.color} size={14} style={{ flexShrink: 0 }}/>
                    {pt}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Call To Action Buttons */}
            <div style={{ padding: '0 24px 24px 24px' }}>
              <Link to={r.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px', borderRadius: 50,
                background: r.color, color: '#fff', fontWeight: 700,
                fontSize: '0.88rem', textDecoration: 'none',
                boxShadow: `0 4px 16px ${r.glow}`,
              }}>
                {r.btnLabel} <FaArrowRight size={12}/>
              </Link>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
</div>

    {/* ── CTA ── */}
    <div style={{ padding:'80px 16px', textAlign:'center', background: T.bg1 }}>
      <Container>
        <div style={{
          background: T.bg2, border:`1px solid ${T.border}`,
          borderRadius:24, padding:'52px 32px',
          position:'relative', overflow:'hidden',
        }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,78,80,0.06)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(233,30,140,0.06)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:2 }}>
            <div style={{
              width:60, height:60, borderRadius:18, background: T.accent,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            marginBottom:20, boxShadow:'0 8px 24px rgba(255,78,80,0.28)',
            }}>
              <FaGraduationCap size={26} color="#fff"/>
            </div>
            <h2 style={{ color:'#fff', fontWeight:900, fontSize:'clamp(1.6rem,3.5vw,2.4rem)', marginBottom:14 }}>
              Ready to join the community?
            </h2>
            <p style={{ color: T.muted, fontSize:'1rem', maxWidth:440, margin:'0 auto 32px', lineHeight:1.75 }}>
              Create your free account and start exploring events from all 9 clubs — all in one place.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
              <Link to="/register" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background: T.accent, color:'#fff', fontWeight:700,
                padding:'13px 32px', borderRadius:50, textDecoration:'none',
            boxShadow:'0 6px 22px rgba(255,78,80,0.28)',
              }}>
                Create Account <FaArrowRight size={13}/>
              </Link>
              <Link to="/login" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(255,255,255,0.07)', color:'#fff', fontWeight:600,
                padding:'13px 28px', borderRadius:50, textDecoration:'none',
                border:'1px solid rgba(255,255,255,0.15)',
              }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>

  </div>
);

export default AboutPage;
