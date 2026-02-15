import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { loadUser } from './store/slices/authSlice';
import UserNavbar from './components/layout/UserNavbar';
import AdminNavbar from './components/layout/AdminNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Sessions from './pages/Sessions';
import SwapRequests from './pages/SwapRequests';
import SwapDetail from './pages/SwapDetail';
import Chat from './pages/Chat';
import Forum from './pages/Forum';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import Reviews from './pages/Reviews';
import Rating from './pages/Rating';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminSkills from './pages/AdminSkills';
import AdminSessions from './pages/AdminSessions';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import Badges from './pages/Badges';
import Certificates from './pages/Certificates';
import NotFound from './pages/NotFound';
import Admin404 from './pages/Admin404';

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const hideNavbar = location.pathname === '/admin/login' || location.pathname === '/login' || location.pathname === '/register';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';
  const hideFooter = location.pathname === '/admin/login' || location.pathname === '/login' || location.pathname === '/register' || isAdminRoute;

  // Determine which 404 page to show
  const NotFoundComponent = isAdminRoute ? Admin404 : NotFound;

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    };
    initAuth();
  }, [dispatch]);

  return (
    <>
      {!hideNavbar && (
        isAdminRoute && isAdmin ? <AdminNavbar /> : <UserNavbar />
      )}
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
            <Route path="/swaps" element={<ProtectedRoute><SwapRequests /></ProtectedRoute>} />
            <Route path="/swaps/:id" element={<ProtectedRoute><SwapDetail /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path="/rating" element={<ProtectedRoute><Rating /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />  
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/skills" element={<AdminRoute><AdminSkills /></AdminRoute>} />
            <Route path="/admin/sessions" element={<AdminRoute><AdminSessions /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </div>
        {!hideFooter && <Footer />}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </Provider>
  );
}