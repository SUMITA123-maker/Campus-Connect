import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerStudent, registerOrganizer } from '../../api/authApi';
import { toast } from 'react-toastify';
import {
  FaGraduationCap, FaEnvelope, FaLock, FaUser, FaIdCard,
  FaPhone, FaBuilding, FaEye, FaEyeSlash, FaArrowRight,
  FaUserGraduate, FaBullhorn, FaBook,
} from 'react-icons/fa';

const T = {
  bg0: '#F8FAFC', bg1: '#F8FAFC', bg2: '#FFFFFF',
  border: 'rgba(15,23,42,0.1)', text: '#0F172A',
  muted: '#475569', accent: '#FF4E50', pink: '#4F46E5',
};

const Field = ({ icon, label, type = 'text', value, onChange, required, placeholder, as, rows, rightEl, options, name, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: T.muted, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 0.6, marginBottom: 7 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: as === 'textarea' ? 'flex-start' : 'center',
        background: T.bg0,
        border: `1.5px solid ${focused ? T.accent : T.border}`,
        borderRadius: 10,
        boxShadow: focused ? '0 0 0 3px rgba(255,78,80,0.14)' : 'none',
        transition: 'all .2s',
      }}>
        <span style={{ padding: as === 'textarea' ? '13px 13px 0' : '0 13px', color: focused ? T.accent : T.muted, fontSize: 14, flexShrink: 0 }}>
          {icon}
        </span>
        {as === 'textarea' ? (
          <textarea
            value={value} onChange={onChange} required={required} rows={rows || 3}
            placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: T.text, fontSize: '0.92rem', padding: '12px 12px 12px 0',
              resize: 'none', fontFamily: 'inherit',
            }}
          />
        ) : as === 'select' ? (
          <select
            value={value} onChange={onChange} required={required}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: value ? T.text : T.muted, fontSize: '0.93rem', padding: '12px 0',
              cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
            }}
          >
            <option value="" disabled style={{ background: T.bg2, color: T.muted }}>{placeholder || 'Select...'}</option>
            {options?.map(opt => (
              <option key={opt} value={opt} style={{ background: T.bg2, color: T.text }}>{opt}</option>
            ))}
          </select>
        ) : (
          <>
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              placeholder={placeholder}
              autoComplete={autoComplete}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: T.text, fontSize: '0.93rem', padding: '12px 0',
              }}
            />
            {rightEl && <span style={{ paddingRight: 12 }}>{rightEl}</span>}
          </>
        )}
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [tab, setTab] = useState('student');
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    collegeId: '', department: '', semester: '', phone: '',
    contactPhone: '', bio: '',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isStudent = tab === 'student';
  const btnColor  = isStudent ? T.accent : T.pink;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    // Phone validation
    const phoneVal = isStudent ? form.phone : form.contactPhone;
    if (!phoneVal) {
      setError('Phone number is required.');
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(phoneVal)) {
      setError('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    try {
      const fn = isStudent ? registerStudent : registerOrganizer;
      const { data } = await fn(form);
      authLogin(data.token);
      toast.success('Account created successfully!');
      navigate(isStudent ? '/student/dashboard' : '/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: T.bg1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15, background: btnColor,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
            boxShadow: isStudent
              ? '0 6px 20px rgba(255,78,80,0.28)'
              : '0 6px 20px rgba(79,70,229,0.24)',
            transition: 'all .3s',
          }}>
            <FaGraduationCap size={24} color="#fff" />
          </div>
          <h1 style={{ color: T.text, fontWeight: 800, fontSize: '1.6rem', marginBottom: 4 }}>
            Campus<span style={{ color: T.accent }}>Connect</span>
          </h1>
          <p style={{ color: T.muted, fontSize: '0.88rem' }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.bg2, borderRadius: 18,
          border: `1px solid ${T.border}`,
          padding: '28px 28px',
          boxShadow: '0 24px 60px rgba(15,23,42,0.1)',
        }}>

          {/* Role toggle */}
          <div style={{ display: 'flex', background: T.bg0, borderRadius: 12, padding: 4, marginBottom: 24, border: `1px solid ${T.border}` }}>
            {[
              { key: 'student',   label: 'Student',   icon: <FaUserGraduate size={13}/> },
              { key: 'organizer', label: 'Organizer', icon: <FaBullhorn size={13}/> },
            ].map(r => (
              <button key={r.key} onClick={() => { setTab(r.key); setError(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.88rem', transition: 'all .2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: tab === r.key
                    ? (r.key === 'student' ? T.accent : T.pink)
                    : 'transparent',
                  color: tab === r.key ? '#fff' : T.muted,
                  boxShadow: tab === r.key ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Error */}
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
            <Field icon={<FaUser />} label="FULL NAME"
              value={form.fullName} onChange={e => set('fullName', e.target.value)}
              required placeholder="Your full name" />

            <Field icon={<FaEnvelope />} label="EMAIL ADDRESS" type="email"
              name="register-email-empty"
              autoComplete="off"
              value={form.email} onChange={e => set('email', e.target.value)}
              required placeholder="email@college.edu" />

            <Field icon={<FaLock />} label="PASSWORD"
              type={showPw ? 'text' : 'password'}
              name="register-password-empty"
              autoComplete="new-password"
              value={form.password} onChange={e => set('password', e.target.value)}
              required placeholder="Min 6 characters"
              rightEl={
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 0, fontSize: 14, display: 'flex', alignItems: 'center' }}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />

            <Field icon={<FaBuilding />} label="DEPARTMENT"
              value={form.department} onChange={e => set('department', e.target.value)}
              placeholder="e.g. Computer Science" />

            {isStudent ? (
              <>
                <Field icon={<FaIdCard />} label="COLLEGE ID"
                  value={form.collegeId} onChange={e => set('collegeId', e.target.value)}
                  required placeholder="e.g. CS2021001" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                  <Field icon={<FaBook />} label="SEMESTER" as="select"
                    value={form.semester} onChange={e => set('semester', e.target.value)}
                    placeholder="Select semester"
                    options={['1st','2nd','3rd','4th','5th','6th','7th','8th']} />
                  <div>
                    <Field icon={<FaPhone />} label="PHONE" required
                      value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number" />
                    {form.phone.length > 0 && form.phone.length < 10 && (
                      <p style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: -10, marginBottom: 10 }}>
                        {10 - form.phone.length} more digit{10 - form.phone.length !== 1 ? 's' : ''} needed
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                <Field icon={<FaPhone />} label="CONTACT PHONE" required
                  value={form.contactPhone} onChange={e => set('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number" />
                {form.contactPhone.length > 0 && form.contactPhone.length < 10 && (
                  <p style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: -10, marginBottom: 10 }}>
                    {10 - form.contactPhone.length} more digit{10 - form.contactPhone.length !== 1 ? 's' : ''} needed
                  </p>
                )}
              </div>
                <Field icon={<FaUser />} label="BIO" as="textarea" rows={3}
                  value={form.bio} onChange={e => set('bio', e.target.value)}
                  placeholder="Tell students about yourself..." />
              </>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? `${btnColor}99` : btnColor,
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : isStudent
                ? '0 4px 16px rgba(255,78,80,0.28)'
                : '0 4px 16px rgba(79,70,229,0.24)',
              transition: 'transform .15s, box-shadow .15s',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
            >
              {loading
                ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }}/> Creating account...</>
                : <>Create Account <FaArrowRight size={13}/></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 22, color: T.muted, fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>
            Sign in →
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

export default RegisterPage;
