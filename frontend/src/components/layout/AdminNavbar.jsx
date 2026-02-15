import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useState, useEffect } from 'react';
import { 
  User, LogOut, Menu, X, Home, Users, Settings, 
  BarChart3, Shield, Database, FileText, Bell, BookOpen, ChevronDown, Sparkles
} from 'lucide-react';

export default function AdminNavbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showDropdown || showMobileMenu) {
      const handleClick = () => {
        setShowDropdown(false);
        setShowMobileMenu(false);
      };
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showDropdown, showMobileMenu]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const adminRoutes = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/skills', label: 'Skills', icon: BookOpen },
    { path: '/admin/sessions', label: 'Sessions', icon: BarChart3 },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-red-200/50' 
        : 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-red-100/50'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Shield className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const active = isActive(route.path);
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-red-700'
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-50/80'
                  }`}
                >
                  <Icon size={18} className={active ? 'animate-pulse' : ''} />
                  <span>{route.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Admin Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-red-200" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user?.name || 'Admin'}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 border border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                        <Shield size={12} className="text-red-600" />
                        <span className="text-xs font-bold text-red-700">Admin</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/admin/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-150 group"
                    >
                      <User size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-150 group"
                    >
                      <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu(!showMobileMenu);
              }}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200/50 py-3 animate-in slide-in-from-top duration-200">
            {/* Admin Info */}
            <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl mb-3">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-200" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded mt-1">
                  <Shield size={10} className="text-red-600" />
                  <span className="text-xs font-bold text-red-700">Admin</span>
                </div>
              </div>
            </div>

            {/* Admin Routes */}
            <div className="space-y-1 mb-3">
              {adminRoutes.map((route) => {
                const Icon = route.icon;
                const active = isActive(route.path);
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Profile Link */}
            <div className="border-t border-gray-200/50 pt-3 mb-3">
              <Link
                to="/admin/profile"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all rounded-xl"
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200/50 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 active:bg-red-100 transition-all rounded-xl font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}