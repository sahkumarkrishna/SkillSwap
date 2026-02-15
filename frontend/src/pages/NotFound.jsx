import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-2xl mb-6 animate-bounce">
            <AlertCircle size={48} className="sm:w-16 sm:h-16 text-white" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-7xl sm:text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-pulse">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-base sm:text-xl text-gray-600 mb-10 max-w-md mx-auto leading-relaxed px-4">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Home size={20} className="sm:w-6 sm:h-6" />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200 shadow-lg mx-4">
          <div className="flex items-center justify-center gap-3 text-gray-600 mb-4">
            <Search size={20} />
            <p className="font-bold text-sm sm:text-base">Quick Links</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link to="/dashboard" className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-200 transition">
              Dashboard
            </Link>
            <Link to="/skills" className="px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-green-200 transition">
              Skills
            </Link>
            <Link to="/chat" className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-purple-200 transition">
              Messages
            </Link>
            <Link to="/profile" className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-pink-200 transition">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
