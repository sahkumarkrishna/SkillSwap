import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export default function Admin404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          {/* Admin Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
            <Shield size={40} className="sm:size-48 text-white" />
          </div>
          
          {/* Error Message */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-6xl sm:text-8xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Admin Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              The admin page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-medium shadow-lg text-sm sm:text-base"
            >
              <Home size={18} />
              Admin Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
          
          {/* Help Text */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              If you believe this is an error, please check the URL or contact support.
            </p>
            <div className="text-xs sm:text-sm text-gray-500">
              <p>Available admin routes:</p>
              <ul className="mt-1 space-y-1">
                <li>• /admin - Dashboard</li>
                <li>• /admin/users - User Management</li>
                <li>• /admin/sessions - Sessions</li>
                <li>• /admin/reports - Reports</li>
                <li>• /admin/settings - Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}