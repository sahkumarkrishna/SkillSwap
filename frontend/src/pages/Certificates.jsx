import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCertificates } from '../store/slices/certificatesSlice';
import { Award, Download, Share2, Calendar, Clock, User, Shield, FileText, Filter, Search } from 'lucide-react';

export default function Certificates() {
  const dispatch = useDispatch();
  const { certificates } = useSelector((state) => state.certificates);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  const handleDownload = (cert) => {
    toast.success(`Downloading certificate for ${cert.skillName}`);
  };

  const handleShare = (cert) => {
    toast.success('Certificate link copied to clipboard!');
  };

  const filteredCertificates = certificates?.filter(cert =>
    cert.skillName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.mentorName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <Award size={32} className="sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2 sm:mb-3">Certificates</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 font-medium px-4">Official certificates for completed skills</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Total</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{certificates?.length || 0}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="sm:w-5 sm:h-5 text-green-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">This Year</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-green-600">
              {certificates?.filter(c => new Date(c.issuedAt).getFullYear() === new Date().getFullYear()).length || 0}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="sm:w-5 sm:h-5 text-purple-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Hours</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">
              {certificates?.reduce((sum, c) => sum + (c.duration || 0), 0) || 0}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="sm:w-5 sm:h-5 text-orange-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Skills</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-orange-600">
              {new Set(certificates?.map(c => c.skillName)).size || 0}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 outline-none transition-all text-sm sm:text-base font-medium"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {filteredCertificates.map((cert) => (
            <div key={cert._id} className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 sm:border-4 border-white hover:scale-[1.02]">
              {/* Certificate Header */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-white/30">
                      <Award size={24} className="sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 sm:gap-2 justify-end mb-1">
                        <Shield size={12} className="sm:w-4 sm:h-4" />
                        <p className="text-xs font-semibold opacity-90">ID</p>
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-bold bg-white/20 px-2 sm:px-3 py-1 rounded-lg">{cert.certificateId}</p>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">Certificate of Completion</h2>
                  <p className="text-xs sm:text-sm font-semibold opacity-90">SkillSwap Learning Platform</p>
                </div>
              </div>
              
              {/* Certificate Body */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                    <Award size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                    Skill Mastered
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 break-words">{cert.skillName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                      <User size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                      Mentor
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-800 truncate">{cert.mentorName}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-green-600" />
                      Duration
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-800">{cert.duration} hours</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                    Issued On
                  </p>
                  <p className="font-black text-sm sm:text-base text-gray-900">
                    {new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => handleDownload(cert)}
                    className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    <Download size={18} className="sm:w-5 sm:h-5" />
                    Download
                  </button>
                  <button 
                    onClick={() => handleShare(cert)}
                    className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:from-gray-200 hover:to-gray-300"
                  >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {filteredCertificates.length === 0 && (
            <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-12 sm:p-16 text-center border-2 border-gray-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award size={40} className="sm:w-12 sm:h-12 text-gray-500" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-3">No Certificates Yet</h3>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">Complete skill sessions to earn certificates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
