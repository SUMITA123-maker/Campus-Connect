import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Badge, Button, Pagination, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicCompletedEvents, getPublicEvents, submitEventFeedback } from '../../api/eventApi';
import { registerForEvent } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy,
  FaCertificate, FaPhotoVideo, FaArrowRight, FaFire,
  FaLaptopCode, FaPalette, FaRunning, FaBook, FaTools,
  FaUserGraduate, FaBullhorn, FaCheckCircle, FaUserShield,
  FaStar, FaChevronLeft, FaChevronRight,
  FaCamera, FaLeaf, FaCode, FaFlag, FaHeart, FaMusic,
} from 'react-icons/fa';

/* ─── theme tokens ──────────────────────────────────────────── */
const T = {
  bg0:    '#FFFFFF',
  bg1:    '#F8FAFC',
  bg2:    '#FFFFFF',
  bg3:    '#F1F5F9',
  border: 'rgba(15,23,42,0.1)',
  text:   '#0F172A',
  muted:  '#475569',
  accent: '#FF4E50',
  secondary: '#4F46E5',
  accentGlow: '0 10px 28px rgba(255,78,80,0.24)',
};

/* ─── data ──────────────────────────────────────────────────── */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80',
    tag: 'Cultural Fest',  tagColor: '#FF4E50',
    headline: 'Celebrate. Perform.\nOwn the Stage.',
    sub: 'Music, dance, drama, and cultural nights that bring the whole campus together.',
  },
  {
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80',
    tag: 'Sports Meet',    tagColor: '#F59E0B',
    headline: 'Compete. Cheer.\nPlay to Win.',
    sub: 'Athletics, team games, tournaments, and sports days made easy to discover and join.',
  },
  {
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
    tag: 'Tech Fest',      tagColor: '#4F46E5',
    headline: 'Hack. Build.\nInnovate the Future.',
    sub: 'Hackathons, coding challenges, and project expos to showcase your skills.',
  },
];

const STATS = [
  { icon: <FaCalendarAlt />, val: '120+', label: 'Events Hosted',      color: '#FF4E50' },
  { icon: <FaUserGraduate />,val: '5K+',  label: 'Students Joined',    color: '#4F46E5' },
  { icon: <FaCertificate />, val: '3K+',  label: 'Certificates Issued',color: '#10b981' },
  { icon: <FaTrophy />,      val: '9',    label: 'Active Clubs',       color: '#f59e0b' },
];

const CLUBS = ['Eco Cultural', 'GNX', 'GDSC', 'GDG', 'Phoenix', 'Lensified', 'NSS & NCC', 'CSR', 'Sports'];
const CATEGORIES = ['All', ...CLUBS];

const CLUB_META = {
  'Eco Cultural':{ icon: <FaPalette />,   gradient: 'linear-gradient(135deg,#e91e8c,#9c27b0)',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=600&q=80',
    desc: 'Cultural fests, dance & performances', tech: false },
  'GNX':         { icon: <FaLaptopCode />,gradient: 'linear-gradient(135deg,#6d28d9,#4c1d95)',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    desc: 'Tech competitions & hackathons', tech: true },
  'GDSC':        { icon: <FaCode />,      gradient: 'linear-gradient(135deg,#4F46E5,#312E81)',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    desc: 'Google Developer Student Clubs', tech: true },
  'GDG':         { icon: <FaUsers />,     gradient: 'linear-gradient(135deg,#0891b2,#0e7490)',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    desc: 'Google Developer Groups community', tech: true },
  'Phoenix':     { icon: <FaFire />,      gradient: 'linear-gradient(135deg,#FF4E50,#4F46E5)',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    desc: 'Innovation, builds & tech events', tech: true },
  'Lensified':   { icon: <FaCamera />,    gradient: 'linear-gradient(135deg,#475569,#1e293b)',
    img: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=600&q=80',
    desc: 'Photography & videography club', tech: false },
  'NSS & NCC':   { icon: <FaFlag />,      gradient: 'linear-gradient(135deg,#15803d,#14532d)',
    img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
    desc: 'Service, discipline & social impact', tech: false },
  'CSR':         { icon: <FaHeart />,     gradient: 'linear-gradient(135deg,#dc2626,#991b1b)',
    img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    desc: 'Community service & outreach', tech: false },
  'Sports':      { icon: <FaRunning />,   gradient: 'linear-gradient(135deg,#ea580c,#c2410c)',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    desc: 'Athletics, tournaments & sports meets', tech: false },
  default:       { icon: <FaTrophy />,    gradient: 'linear-gradient(135deg,#5e35b1,#1a237e)',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    desc: 'Campus events', tech: false },
};

const FOR_ROLES = [
  {
    icon: <FaUserGraduate size={28} />, role: 'Students',
    color: '#FF4E50', glow: 'rgba(255,78,80,0.25)',
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=340&q=80',
    points: ['Browse & register for events', 'Track all your registrations', 'Download verified certificates', 'View event results & rankings'],
    ctaPath: '/register',
    ctaLabel: 'Join as Student',
  },
  {
    icon: <FaBullhorn size={28} />, role: 'Organizers',
    color: '#4F46E5', glow: 'rgba(79,70,229,0.22)',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&h=340&q=80',
    points: ['Create & manage events', 'Upload photos & videos', 'Mark attendance digitally', 'Publish results instantly'],
    ctaPath: '/register',
    ctaLabel: 'Join as Organizer',
  },
  {
    icon: <FaUserShield size={28} />, role: 'Admins',
    color: '#10b981', glow: 'rgba(16,185,129,0.25)',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&h=340&q=80',
    points: ['Approve event requests', 'Review media submissions', 'Verify certificates', 'Monitor platform activity'],
    ctaPath: '/login',
    ctaLabel: 'Admin Login',
  },
];

const HOW_IT_WORKS = [
  { step:'01', title:'Create an Account',   desc:'Sign up as a Student or Organizer in under a minute.', icon:<FaUserGraduate size={22}/>, color:'#FF4E50' },
  { step:'02', title:'Discover Events',     desc:'Browse all events filtered by category, date, or keyword.', icon:<FaCalendarAlt size={22}/>, color:'#4F46E5' },
  { step:'03', title:'Register & Attend',   desc:'One-click registration. Get your attendance marked digitally.', icon:<FaCheckCircle size={22}/>, color:'#10b981' },
  { step:'04', title:'Get Your Certificate',desc:'Download a verified PDF certificate once approved.', icon:<FaCertificate size={22}/>, color:'#f59e0b' },
];

const getCategoryMeta = (cat) => CLUB_META[cat] || CLUB_META.default;
const fillPct   = (reg, max) => Math.min(100, Math.round((reg / max) * 100));
const fillColor = (pct)      => pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
const isAlreadyRegisteredError = (err) =>
  err.response?.data?.message?.toLowerCase().includes('already registered');

/* ─── component ─────────────────────────────────────────────── */
const HomePage = () => {
  const [events,     setEvents]     = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [category,   setCategory]   = useState('');
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hoveredCard,setHoveredCard]= useState(null);
  const [slide,      setSlide]      = useState(0);
  const [fadeIn,     setFadeIn]     = useState(true);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    timerRef.current = setInterval(() => changeSlide('next'), 5500);
    return () => clearInterval(timerRef.current);
  }, [slide]);

  const changeSlide = (dir) => {
    setFadeIn(false);
    setTimeout(() => {
      setSlide(s => dir === 'next'
        ? (s + 1) % SLIDES.length
        : (s - 1 + SLIDES.length) % SLIDES.length);
      setFadeIn(true);
    }, 280);
    clearInterval(timerRef.current);
  };

  useEffect(() => { fetchEvents(); }, [category, page]);
  useEffect(() => {
    getPublicCompletedEvents()
      .then(({ data }) => setCompletedEvents(data))
      .catch(() => setCompletedEvents([]));
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await getPublicEvents(page, 9, category);
      setEvents(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      toast.success('Registered successfully!');
      fetchEvents();
    } catch (err) {
      if (isAlreadyRegisteredError(err)) {
        toast.info('Already registered for this event');
        navigate('/student/dashboard');
        return;
      }
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const updateFeedbackDraft = (eventId, changes) => {
    setFeedbackDrafts((drafts) => ({
      ...drafts,
      [eventId]: { rating: 0, comment: '', ...drafts[eventId], ...changes },
    }));
  };

  const handleFeedbackSubmit = async (eventId) => {
    const draft = feedbackDrafts[eventId] || {};
    if (!draft.rating) {
      toast.info('Please choose a rating first');
      return;
    }
    setSubmittingFeedback(eventId);
    try {
      await submitEventFeedback(eventId, { rating: draft.rating, comment: draft.comment || '' });
      toast.success('Thank you for your feedback!');
      setFeedbackDrafts((drafts) => ({ ...drafts, [eventId]: { ...draft, submitted: true } }));
      const { data } = await getPublicCompletedEvents();
      setCompletedEvents(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit feedback');
    } finally {
      setSubmittingFeedback(null);
    }
  };

  const cur = SLIDES[slide];

  return (
    <div className="home-page" style={{ background: T.bg1, minHeight: '100vh', color: T.text }}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <div className="home-hero" style={{ position:'relative', height:'clamp(540px,88vh,720px)', overflow:'hidden' }}>

        {/* bg image */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url(${cur.img})`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity: fadeIn ? 1 : 0, transition:'opacity 0.35s ease',
        }}/>

        {/* overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to right, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.56) 54%, rgba(15,23,42,0.2) 100%)',
        }}/>

        {/* arrows */}
        {[['prev', <FaChevronLeft/>, {left:20}], ['next', <FaChevronRight/>, {right:20}]].map(([dir, icon, pos]) => (
          <button key={dir} onClick={() => changeSlide(dir)} style={{
            position:'absolute', top:'50%', transform:'translateY(-50%)', zIndex:10,
            ...pos,
            background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.2)', color:'#fff',
            width:44, height:44, borderRadius:'50%', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
            transition:'background .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
          >{icon}</button>
        ))}

        {/* dots */}
        <div style={{
          position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
          display:'flex', gap:8, zIndex:10,
        }}>
          {SLIDES.map((_, i) => (
            <button key={i}
              onClick={() => { setFadeIn(false); setTimeout(() => { setSlide(i); setFadeIn(true); }, 280); }}
              style={{
                width: i===slide ? 28 : 10, height:10, borderRadius:50,
                border:'none', cursor:'pointer', padding:0, transition:'all .3s',
                background: i===slide ? '#fff' : 'rgba(255,255,255,0.35)',
              }}/>
          ))}
        </div>

        {/* text */}
        <Container style={{ height:'100%', position:'relative', zIndex:5 }}>
          <div style={{
            height:'100%', display:'flex', flexDirection:'column',
            justifyContent:'center', maxWidth:640,
            opacity: fadeIn ? 1 : 0, transition:'opacity 0.35s ease',
          }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8, width:'fit-content',
              background: cur.tagColor + '28', border:`1px solid ${cur.tagColor}66`,
              borderRadius:50, padding:'6px 16px', marginBottom:22,
            }}>
              <FaFire color={cur.tagColor} size={13}/>
              <span style={{ color:'#fff', fontSize:13, fontWeight:700, letterSpacing:1 }}>{cur.tag}</span>
            </div>

            <h1 style={{
              fontSize:'clamp(2.4rem,5vw,4.2rem)', fontWeight:900, color:'#fff',
              lineHeight:1.1, marginBottom:20, whiteSpace:'pre-line',
              textShadow:'0 2px 24px rgba(0,0,0,0.5)',
            }}>{cur.headline}</h1>

            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1.1rem', lineHeight:1.65, marginBottom:36, maxWidth:500 }}>
              {cur.sub}
            </p>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              {!user ? (
                <>
                  <Button as={Link} to="/register" size="lg" style={{
                    background:T.accent, border:'none', borderRadius:50,
                    fontWeight:800, padding:'13px 34px', color:'#fff',
                    boxShadow:T.accentGlow,
                  }}>
                    Get Started <FaArrowRight className="ms-2"/>
                  </Button>
                  <Button as={Link} to="/login" size="lg" style={{
                    background:'rgba(255,255,255,0.1)', color:'#fff',
                    border:'1.5px solid rgba(255,255,255,0.4)',
                    borderRadius:50, fontWeight:600, padding:'13px 32px',
                    backdropFilter:'blur(6px)',
                  }}>Login</Button>
                </>
              ) : (
                <Button as={Link} to={
                  user.role==='ADMIN' ? '/admin/dashboard' : user.role==='ORGANIZER' ? '/organizer/dashboard' : '/student/dashboard'
                } size="lg" style={{
                  background:T.accent, border:'none', borderRadius:50,
                  fontWeight:800, padding:'13px 34px', color:'#fff',
                }}>
                  Go to Dashboard <FaArrowRight className="ms-2"/>
                </Button>
              )}
              <Button as={Link} to="/media/gallery" size="lg" style={{
                background:'rgba(255,255,255,0.1)', color:'#fff',
                border:'1.5px solid rgba(255,255,255,0.35)',
                borderRadius:50, fontWeight:600, padding:'13px 28px',
                backdropFilter:'blur(6px)',
              }}>
                <FaPhotoVideo className="me-2"/> Gallery
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* ══ STATS BAR ═══════════════════════════════════════════ */}
      <div style={{ background: T.bg0, borderBottom:`1px solid ${T.border}` }}>
        <Container>
          <Row>
            {STATS.map((s, i) => (
              <Col key={i} xs={6} md={3} style={{ borderRight: i<3 ? `1px solid ${T.border}` : 'none' }}>
                <div style={{ padding:'26px 20px', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{
                    width:48, height:48, borderRadius:13,
                    background: s.color+'20',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: s.color, fontSize:20, flexShrink:0,
                  }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:'1.7rem', fontWeight:900, color:T.text, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:'0.75rem', color: T.muted, marginTop:3 }}>{s.label}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ══ CATEGORY SHOWCASE ═══════════════════════════════════ */}
      <div style={{ background: T.bg1, padding:'68px 0 60px' }}>
        <Container>
          <div style={{ textAlign:'center', marginBottom:42 }}>
            <span style={{
              background:'rgba(255,78,80,0.12)', color:T.accent,
              borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
            }}>OUR CLUBS</span>
            <h2 style={{ fontWeight:800, color:T.text, marginTop:14, marginBottom:8 }}>
              9 Clubs. Endless Events.
            </h2>
            <p style={{ color:T.muted, maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
              From coding hackathons to cultural nights — every club brings something unique to campus life.
            </p>
          </div>

          <Row className="g-3">
            {CLUBS.map((club) => {
              const meta = CLUB_META[club];
              return (
                <Col key={club} xs={6} md={4}>
                  <div
                    onClick={() => { setCategory(club); document.getElementById('events-section').scrollIntoView({ behavior:'smooth' }); }}
                    style={{
                      borderRadius:16, overflow:'hidden', cursor:'pointer',
                      position:'relative', height: 190,
                      border: `1px solid ${T.border}`,
                      transition:'transform .25s, box-shadow .25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(15,23,42,0.16)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
                  >
                    <img src={meta.img} alt={club} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    <div style={{
                      position:'absolute', inset:0,
                      background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)',
                    }}/>
                    <div style={{ position:'absolute', bottom:14, left:14, right:14 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <div style={{
                          background: meta.gradient, borderRadius:7,
                          width:28, height:28, display:'flex', alignItems:'center',
                          justifyContent:'center', color:'#fff', fontSize:12, flexShrink:0,
                        }}>{meta.icon}</div>
                        <span style={{ color:'#fff', fontWeight:800, fontSize:'0.95rem' }}>{club}</span>
                      </div>
                        <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'0.72rem', margin:0, lineHeight:1.4 }}>{meta.desc}</p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
      <div style={{ background: T.bg0, padding:'72px 0', borderTop:`1px solid ${T.border}` }}>
        <Container>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{
              background:'rgba(233,30,140,0.15)', color:'#f472b6',
              borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
            }}>HOW IT WORKS</span>
            <h2 style={{ fontWeight:800, color:T.text, marginTop:14, marginBottom:8 }}>Four Simple Steps</h2>
            <p style={{ color:T.muted }}>From sign-up to certificate — in minutes.</p>
          </div>
          <Row className="g-4">
            {HOW_IT_WORKS.map((s, i) => (
              <Col key={i} xs={12} sm={6} lg={3}>
                <div style={{
                  background: T.bg2, borderRadius:20, padding:'32px 24px',
                  border:`1px solid ${T.border}`, height:'100%',
                  position:'relative', overflow:'hidden',
                  transition:'border-color .2s, transform .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=s.color+'66'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  <div style={{
                    position:'absolute', top:16, right:18,
                    fontSize:'2.8rem', fontWeight:900, color: s.color+'15', lineHeight:1,
                  }}>{s.step}</div>
                  <div style={{
                    width:54, height:54, borderRadius:16,
                    background: s.color+'18', color: s.color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    marginBottom:20,
                  }}>{s.icon}</div>
                  <h5 style={{ fontWeight:700, color:T.text, marginBottom:10 }}>{s.title}</h5>
                  <p style={{ color:T.muted, fontSize:'0.87rem', lineHeight:1.65, margin:0 }}>{s.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ══ WHO IS IT FOR ════════════ */}
      <div style={{ background: T.bg1, padding:'72px 0', borderTop:`1px solid ${T.border}` }}>
        <Container>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{
              background:'rgba(16,185,129,0.15)', color:'#34d399',
              borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
            }}>BUILT FOR YOU</span>
            <h2 style={{ fontWeight:800, color:T.text, marginTop:14, marginBottom:8 }}>Who Is It For?</h2>
            <p style={{ color:T.muted, maxWidth:400, margin:'0 auto' }}>
              Tailored experiences for students, event organizers, and admins.
            </p>
          </div>
          <Row className="g-4 justify-content-center">
            {FOR_ROLES.map((r, i) => (
              <Col key={i} md={4}>
                <div style={{
                  background: T.bg2, borderRadius:20, overflow:'hidden',
                  border:`1px solid ${T.border}`,
                  transition:'transform .25s, box-shadow .25s, border-color .25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 16px 48px ${r.glow}`; e.currentTarget.style.borderColor=r.color+'55'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=T.border; }}
                >
                  {/* image */}
                  <div style={{ position:'relative', height:200, overflow:'hidden' }}>
                    <img src={r.img} alt={r.role} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    <div style={{
                      position:'absolute', inset:0,
                      background:'linear-gradient(to top, rgba(10,18,30,0.85), rgba(10,18,30,0.1))',
                    }}/>
                    <div style={{ position:'absolute', bottom:16, left:18, display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        background: r.color, borderRadius:10,
                        width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
                      }}>{r.icon}</div>
                      <span style={{ color:'#fff', fontWeight:800, fontSize:'1.2rem' }}>{r.role}</span>
                    </div>
                  </div>
                  {/* points */}
                  <div style={{ padding:'22px 24px 26px' }}>
                    {r.points.map((pt, j) => (
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11, fontSize:'0.88rem', color: T.text }}>
                        <FaCheckCircle color={r.color} size={14} style={{ flexShrink:0 }}/>
                        {pt}
                      </div>
                    ))}
                    <Button as={Link} to={r.ctaPath} style={{
                      marginTop:14, borderRadius:50, width:'100%',
                      background: r.color, border:'none',
                      fontWeight:700, fontSize:'0.88rem', padding:'10px',
                      boxShadow:`0 4px 18px ${r.glow}`,
                    }}>
                      {r.ctaLabel} <FaArrowRight className="ms-1"/>
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ══ EVENTS SECTION ══════════════════════════════════════ */}
      <div id="events-section" style={{ background: T.bg0, padding:'68px 0', borderTop:`1px solid ${T.border}` }}>
        <Container>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{
              background:'rgba(245,158,11,0.15)', color:'#fbbf24',
              borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
            }}>LIVE NOW</span>
            <h2 style={{ fontWeight:800, color:T.text, marginTop:14, marginBottom:8 }}>Upcoming Events</h2>
            <p style={{ color:T.muted }}>Browse events from your campus clubs and register in one click.</p>
          </div>

          {/* category filter */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap', marginBottom:38 }}>
            {CATEGORIES.map(cat => {
              const active = category === (cat==='All' ? '' : cat);
              return (
                <button key={cat}
                  onClick={() => { setCategory(cat==='All' ? '' : cat); setPage(0); }}
                  style={{
                    padding:'8px 20px', borderRadius:50, fontSize:'0.84rem', fontWeight:600,
                    border: active ? 'none' : `1px solid ${T.border}`,
                    cursor:'pointer', transition:'all .2s',
                    background: active ? T.accent : T.bg2,
                    color: active ? '#fff' : T.muted,
                    boxShadow: active ? T.accentGlow : 'none',
                  }}>
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? <LoadingSpinner /> : events.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <FaCalendarAlt size={48} color={T.secondary}/>
              <h4 style={{ color:T.text, marginTop:16 }}>No events found</h4>
              <p style={{ color:T.muted }}>Check back soon for upcoming events!</p>
            </div>
          ) : (
            <>
              <Row xs={1} md={2} lg={3} className="g-4">
                {events.map(event => {
                  const meta   = getCategoryMeta(event.category);
                  const pct    = fillPct(event.registeredCount, event.maxParticipants);
                  const isFull = event.registeredCount >= event.maxParticipants;
                  const isHov  = hoveredCard === event.id;
                  return (
                    <Col key={event.id}>
                      <div
                        onMouseEnter={() => setHoveredCard(event.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          borderRadius:18, overflow:'hidden', height:'100%',
                          display:'flex', flexDirection:'column',
                          background: T.bg2,
                          border: isHov ? `1px solid rgba(255,78,80,0.36)` : `1px solid ${T.border}`,
                          boxShadow: isHov ? '0 16px 44px rgba(15,23,42,0.14)' : '0 4px 16px rgba(15,23,42,0.08)',
                          transform: isHov ? 'translateY(-6px)' : 'translateY(0)',
                          transition:'all .25s ease',
                        }}>

                        {/* header */}
                        <div style={{ background:meta.gradient, padding:'22px 20px 18px', position:'relative', overflow:'hidden' }}>
                          <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                            <Badge style={{ background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:'0.72rem', fontWeight:600, padding:'5px 10px', borderRadius:50, marginBottom:10 }}>
                              {meta.icon}&nbsp;{event.category || 'General'}
                            </Badge>
                            {isFull && <Badge bg="danger" style={{ borderRadius:50, fontSize:'0.68rem' }}>FULL</Badge>}
                          </div>
                          <h5 style={{ color:'#fff', fontWeight:700, marginBottom:0, fontSize:'1rem', lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                            {event.title}
                          </h5>
                        </div>

                        {/* body */}
                        <div style={{ padding:'16px 20px', flex:1 }}>
                          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:12 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, color:T.muted, fontSize:'0.82rem' }}>
                              <FaCalendarAlt color="#FF4E50"/>
                              {new Date(event.eventDate).toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' })}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8, color:T.muted, fontSize:'0.82rem' }}>
                              <FaMapMarkerAlt color="#e91e8c"/>
                              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{event.venue}</span>
                            </div>
                          </div>

                          {event.description && (
                            <p style={{ color:T.muted, fontSize:'0.82rem', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:14 }}>
                              {event.description}
                            </p>
                          )}

                          {/* progress */}
                          <div>
                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.77rem', color:T.muted, marginBottom:5 }}>
                              <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                                <FaUsers/> {event.registeredCount} / {event.maxParticipants}
                              </span>
                              <span style={{ color:fillColor(pct), fontWeight:600 }}>
                                {isFull ? 'Full' : `${pct}% filled`}
                              </span>
                            </div>
                            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:50, height:5, overflow:'hidden' }}>
                              <div style={{ width:`${pct}%`, height:'100%', borderRadius:50, background:fillColor(pct), transition:'width .4s ease' }}/>
                            </div>
                          </div>
                        </div>

                        {/* footer */}
                        <div style={{ padding:'12px 20px', borderTop:`1px solid ${T.border}`, display:'flex', gap:8 }}>
                          <Button as={Link} to={`/events/${event.id}`} style={{
                            flex:1, borderRadius:50, fontSize:'0.82rem', fontWeight:600,
                            background:'transparent', border:`1.5px solid rgba(79,70,229,0.38)`,
                            color:T.secondary, padding:'7px 0',
                          }}>Details</Button>

                          {user?.role === 'STUDENT' && (
                            <Button onClick={() => handleRegister(event.id)} disabled={isFull} style={{
                              flex:1, borderRadius:50, fontSize:'0.82rem', fontWeight:600,
                              padding:'7px 0', border:'none',
                              background: isFull ? 'rgba(255,255,255,0.08)' : T.accent,
                              color: isFull ? T.muted : '#fff',
                              cursor: isFull ? 'not-allowed' : 'pointer',
                            }}>{isFull ? 'Full' : 'Register'}</Button>
                          )}

                          {!user && (
                            <Button as={Link} to="/login" style={{
                              flex:1, borderRadius:50, fontSize:'0.82rem', fontWeight:600,
                              padding:'7px 0', border:'none', background: T.accent, color:'#fff',
                            }}>Login to Join</Button>
                          )}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.Prev disabled={page===0} onClick={() => setPage(p => p-1)}/>
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item key={i} active={i===page} onClick={() => setPage(i)}>{i+1}</Pagination.Item>
                    ))}
                    <Pagination.Next disabled={page===totalPages-1} onClick={() => setPage(p => p+1)}/>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Container>
      </div>

      {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
      {completedEvents.length > 0 && (
        <div style={{ background: T.bg1, padding:'68px 0', borderTop:`1px solid ${T.border}` }}>
          <Container>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <span style={{
                background:'rgba(79,70,229,0.12)', color:T.secondary,
                borderRadius:50, padding:'5px 16px', fontSize:'0.78rem', fontWeight:700, letterSpacing:1,
              }}>EVENT ARCHIVE</span>
              <h2 style={{ fontWeight:800, color:T.text, marginTop:14, marginBottom:8 }}>Completed Events</h2>
              <p style={{ color:T.muted }}>Explore the events that have already taken place.</p>
            </div>
            <Row xs={1} md={2} lg={3} className="g-4">
              {completedEvents.slice(0, 6).map(event => {
                const meta = getCategoryMeta(event.category);
                const feedback = feedbackDrafts[event.id] || { rating: 0, comment: '' };
                return (
                  <Col key={event.id}>
                    <div style={{
                      height:'100%', background:T.bg2, border:`1px solid ${T.border}`,
                      borderRadius:18, overflow:'hidden', display:'flex', flexDirection:'column',
                    }}>
                      <div style={{ background:meta.gradient, padding:'20px', color:'#fff' }}>
                        <Badge style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:'0.72rem', borderRadius:50 }}>
                          COMPLETED
                        </Badge>
                        <h5 style={{ fontWeight:700, margin:'14px 0 0' }}>{event.title}</h5>
                      </div>
                      <div style={{ padding:'18px 20px', flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, color:T.muted, fontSize:'0.85rem', marginBottom:10 }}>
                          <FaCalendarAlt color={T.accent} />
                          {new Date(event.eventDate).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, color:T.muted, fontSize:'0.85rem' }}>
                          <FaMapMarkerAlt color="#e91e8c" />
                          <span className="text-truncate">{event.venue}</span>
                        </div>
                        {event.feedbackCount > 0 && (
                          <div style={{ display:'flex', alignItems:'center', gap:6, color:T.muted, fontSize:'0.82rem', marginTop:14 }}>
                            <FaStar color="#f59e0b" />
                            <strong style={{ color:T.text }}>{Number(event.averageRating).toFixed(1)}</strong>
                            <span>({event.feedbackCount} {event.feedbackCount === 1 ? 'rating' : 'ratings'})</span>
                          </div>
                        )}
                      </div>
                      {user?.role === 'STUDENT' && (
                        <div style={{ padding:'16px 20px', borderTop:`1px solid ${T.border}`, background:T.bg1 }}>
                          {feedback.submitted ? (
                            <div style={{ color:'#059669', fontWeight:700, fontSize:'0.88rem' }}>
                              <FaCheckCircle className="me-2" />Feedback submitted
                            </div>
                          ) : (
                            <>
                              <div style={{ fontWeight:700, color:T.text, fontSize:'0.9rem', marginBottom:8 }}>Rate this event</div>
                              <div style={{ display:'flex', gap:5, marginBottom:12 }} aria-label="Choose a rating out of five">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button key={rating} type="button" onClick={() => updateFeedbackDraft(event.id, { rating })}
                                    aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
                                    style={{ border:'none', background:'transparent', padding:0, color:rating <= feedback.rating ? '#f59e0b' : '#cbd5e1', fontSize:20, cursor:'pointer' }}>
                                    <FaStar />
                                  </button>
                                ))}
                              </div>
                              <Form.Control as="textarea" rows={2} maxLength={1000} value={feedback.comment}
                                onChange={(e) => updateFeedbackDraft(event.id, { comment:e.target.value })}
                                placeholder="Share your experience (optional)" style={{ fontSize:'0.82rem', resize:'vertical', marginBottom:10 }} />
                              <Button size="sm" onClick={() => handleFeedbackSubmit(event.id)} disabled={submittingFeedback === event.id}
                                style={{ borderRadius:50, background:T.secondary, border:'none', fontWeight:700 }}>
                                {submittingFeedback === event.id ? 'Submitting...' : 'Submit feedback'}
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                      <div style={{ padding:'12px 20px', borderTop:`1px solid ${T.border}` }}>
                        <Button as={Link} to={`/events/${event.id}`} variant="outline-primary" className="w-100" style={{ borderRadius:50 }}>
                          View Event
                        </Button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      )}

      <div style={{ background: T.bg1, padding:'64px 0', borderTop:`1px solid ${T.border}` }}>
        <Container>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h3 style={{ color:T.text, fontWeight:800, marginBottom:6 }}>Loved by Students Across Campus</h3>
            <p style={{ color:T.muted, fontSize:'0.9rem' }}>Real words from real participants</p>
          </div>
          <Row className="g-4">
            {[
              { name:'Priya S.',  dept:'CSE, 3rd Year', text:'I registered for 5 events and downloaded all my certificates in one place. Super convenient!', stars:5 },
              { name:'Arjun M.', dept:'ECE, 2nd Year', text:'The tech fest registration was seamless. Results were published the same day — loved it!', stars:5 },
              { name:'Neha R.',  dept:'MBA, 1st Year', text:'Love how the gallery captures every event. Great way to relive the cultural night memories.', stars:5 },
            ].map((t, i) => (
              <Col key={i} md={4}>
                <div style={{
                  background: T.bg2, border:`1px solid ${T.border}`, borderRadius:18,
                  padding:'28px 24px',
                  transition:'border-color .2s, transform .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,78,80,0.28)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                    {[...Array(t.stars)].map((_, j) => <FaStar key={j} color="#f59e0b" size={14}/>)}
                  </div>
                  <p style={{ color:T.muted, fontSize:'0.9rem', lineHeight:1.7, marginBottom:20 }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:40, height:40, borderRadius:'50%',
                      background:'linear-gradient(135deg,#FF4E50,#4F46E5)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:800, color:'#fff', fontSize:'1rem',
                    }}>{t.name[0]}</div>
                    <div>
                      <div style={{ color:T.text, fontWeight:700, fontSize:'0.9rem' }}>{t.name}</div>
                      <div style={{ color:T.muted, fontSize:'0.78rem' }}>{t.dept}</div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ══ CTA BANNER ══════════════════════════════════════════ */}
      {!user && (
        <div style={{ position:'relative', overflow:'hidden', padding:'80px 16px', textAlign:'center', background: T.bg0, borderTop:`1px solid ${T.border}` }}>
          {/* cultural decorative icons */}
          {[
            { icon: '🎵', top:'10%',  left:'4%',  size:'2.4rem', rotate:'-15deg', opacity:0.18 },
            { icon: '🎨', top:'15%',  right:'6%', size:'2.2rem', rotate:'12deg',  opacity:0.16 },
            { icon: '🏆', bottom:'18%',left:'8%', size:'2rem',   rotate:'-8deg',  opacity:0.14 },
            { icon: '🎭', top:'55%',  right:'4%', size:'2.4rem', rotate:'20deg',  opacity:0.15 },
            { icon: '🎤', bottom:'12%',right:'10%',size:'2rem',  rotate:'-12deg', opacity:0.14 },
            { icon: '🌟', top:'30%',  left:'14%', size:'1.6rem', rotate:'8deg',   opacity:0.20 },
            { icon: '🥁', bottom:'30%',right:'14%',size:'1.8rem',rotate:'-6deg', opacity:0.14 },
            { icon: '🎶', top:'70%',  left:'5%',  size:'1.8rem', rotate:'18deg',  opacity:0.15 },
          ].map((d, i) => (
            <div key={i} style={{
              position:'absolute',
              top: d.top ?? 'auto', bottom: d.bottom ?? 'auto',
              left: d.left ?? 'auto', right: d.right ?? 'auto',
              fontSize: d.size, transform: `rotate(${d.rotate})`,
              opacity: d.opacity, userSelect:'none', pointerEvents:'none',
            }}>{d.icon}</div>
          ))}
          <Container style={{ position:'relative', zIndex:2 }}>
            <h2 style={{ color:T.text, fontWeight:900, fontSize:'clamp(1.8rem,4vw,2.8rem)', marginBottom:14 }}>
              Ready to be part of something big?
            </h2>
            <p style={{ color:T.muted, fontSize:'1.05rem', maxWidth:500, margin:'0 auto 36px' }}>
              Join thousands of students using CampusConnect to discover, compete, and grow.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
              <Button as={Link} to="/register" size="lg" style={{
                borderRadius:50, padding:'14px 40px', fontWeight:800,
                background: T.accent, border:'none', color:'#fff',
                boxShadow: T.accentGlow,
              }}>
                Create Account <FaArrowRight className="ms-2"/>
              </Button>
              <Button as={Link} to="/login" size="lg" style={{
                borderRadius:50, padding:'14px 32px', fontWeight:600,
                background:T.bg3, color:T.text,
                border:`1.5px solid ${T.border}`,
              }}>Sign In</Button>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default HomePage;
