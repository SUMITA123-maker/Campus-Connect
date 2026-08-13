import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import MediaGalleryPage from './pages/public/MediaGalleryPage';
import AboutPage from './pages/public/AboutPage';
import EventDetailPage from './pages/public/EventDetailPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyRegistrations from './pages/student/MyRegistrations';
import MyCertificates from './pages/student/MyCertificates';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import EventForm from './pages/organizer/EventForm';
import AttendanceManager from './pages/organizer/AttendanceManager';
import UploadResults from './pages/organizer/UploadResults';
import UploadMedia from './pages/organizer/UploadMedia';
import CertificateManager from './pages/organizer/CertificateManager';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EventApprovalQueue from './pages/admin/EventApprovalQueue';
import MediaApprovalQueue from './pages/admin/MediaApprovalQueue';
import CertificateVerify from './pages/admin/CertificateVerify';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppNavbar />
      <main className="app-main" style={{ minHeight: 'calc(100vh - 110px)' }}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/media/gallery" element={<MediaGalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />

          {/* ── Student Routes ── */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/registrations" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyRegistrations />
            </ProtectedRoute>
          } />
          <Route path="/student/certificates" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyCertificates />
            </ProtectedRoute>
          } />

          {/* ── Organizer Routes ── */}
          <Route path="/organizer/dashboard" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/new" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/:eventId/edit" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/:eventId/attendance" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <AttendanceManager />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/:eventId/results" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <UploadResults />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/:eventId/media" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <UploadMedia />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/:eventId/certificates" element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <CertificateManager />
            </ProtectedRoute>
          } />

          {/* ── Admin Routes ── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/events/pending" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EventApprovalQueue />
            </ProtectedRoute>
          } />
          <Route path="/admin/media/pending" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MediaApprovalQueue />
            </ProtectedRoute>
          } />
          <Route path="/admin/certificates" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CertificateVerify />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
