import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/authApi';
import { toast } from 'react-toastify';
import { FaGraduationCap, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const T = {
  bg0: '#F8FAFC', bg1: '#F8FAFC', bg2: '#FFFFFF',
  border: 'rgba(15,23,42,0.1)', text: '#0F172A',
  muted: '#475569', accent: '#FF4E50',
};

const Field = ({ icon, label, type = 'text', value, onChange, required, rightEl, name, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', color: T.muted, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 0.6, marginBottom: 7 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: T.bg0,
        border: `1.5px solid ${focused ? T.accent : T.border}`,
        borderRadius: 10,
        boxShadow: focused ? '0 0 0 3px rgba(255,78,80,0.14)' : 'none',
        transition: 'all .2s',
      }}>
        <span style={{ padding: '0 13px', color: focused ? T.accent : T.muted, fontSize: 14, flexShrink: 0 }}>
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontSize: '0.93rem', padding: '12px 0',
          }}
        />
        {rightEl && <span style={{ paddingRight: 12 }}>{rightEl}</span>}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPw(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await login({ email, password });
      authLogin(data.token);
      toast.success(`Welcome back, ${data.fullName}!`);
      const dest = { ADMIN: '/admin/dashboard', ORGANIZER: '/organizer/dashboard', STUDENT: '/student/dashboard' };
      navigate(dest[data.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: T.bg1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15, background: T.accent,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, boxShadow: '0 6px 20px rgba(255,78,80,0.28)',
          }}>
            <FaGraduationCap size={24} color="#fff" />
          </div>
          <h1 style={{ color: T.text, fontWeight: 800, fontSize: '1.6rem', marginBottom: 4 }}>
            Campus<span style={{ color: T.accent }}>Connect</span>
          </h1>
          <p style={{ color: T.muted, fontSize: '0.88rem' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.bg2, borderRadius: 18,
          border: `1px solid ${T.border}`,
          padding: '32px 28px',
          boxShadow: '0 24px 60px rgba(15,23,42,0.1)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 9, padding: '10px 14px', marginBottom: 20,
              color: '#fca5a5', fontSize: '0.85rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <Field icon={<FaEnvelope />} label="EMAIL ADDRESS" type="email"
              name="login-email-empty"
              autoComplete="off"
              value={email} onChange={e => setEmail(e.target.value)} required />

            <Field icon={<FaLock />} label="PASSWORD"
              type={showPw ? 'text' : 'password'}
              name="login-password-empty"
              autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)} required
              rightEl={
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 0, fontSize: 14, display: 'flex', alignItems: 'center' }}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: T.accent, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 6,
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(255,78,80,0.28)',
              transition: 'transform .15s, box-shadow .15s',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(255,78,80,0.34)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(255,78,80,0.28)'; }}
            >
              {loading
                ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }}/> Signing in...</>
                : <>Sign In <FaArrowRight size={13}/></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 22, color: T.muted, fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>
            Register →
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${T.bg0} inset !important;
          -webkit-text-fill-color: ${T.text} !important;
          caret-color: ${T.text};
          transition: background-color 9999s ease-in-out 0s;
        }
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
