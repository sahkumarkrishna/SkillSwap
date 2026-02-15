import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, BookOpen, Calendar, Download, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AdminReports() {
  const [reports, setReports] = useState({
    userStats: { total: 0, active: 0, newThisMonth: 0 },
    sessionStats: { total: 0, completed: 0, active: 0 },
    skillStats: { total: 0, popular: [] },
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      const { data } = await api.get(`/admin/reports?period=${selectedPeriod}`);
      setReports(data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (type) => {
    try {
      const response = await api.get(`/admin/reports/download?type=${type}&period=${selectedPeriod}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText size={24} className="sm:hidden text-white" />
              <FileText size={32} className="hidden sm:block text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Platform insights and performance metrics</p>
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{reports.userStats.total}</p>
                <p className="text-xs sm:text-sm text-green-600">+{reports.userStats.newThisMonth} this month</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users size={20} className="sm:size-24 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{reports.sessionStats.active}</p>
                <p className="text-xs sm:text-sm text-blue-600">{reports.sessionStats.completed} completed</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="sm:size-24 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Skills</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{reports.skillStats.total}</p>
                <p className="text-xs sm:text-sm text-purple-600">Across all categories</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="sm:size-24 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">+12.5%</p>
                <p className="text-xs sm:text-sm text-green-600">vs last period</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="sm:size-24 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Popular Skills */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Popular Skills</h3>
              <button
                onClick={() => downloadReport('skills')}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-sm"
              >
                <Download size={14} className="sm:size-16" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {reports.skillStats.popular?.slice(0, 5).map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{skill.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{skill.category}</p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{skill.userCount}</p>
                    <p className="text-xs sm:text-sm text-gray-600">users</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Activity Overview</h3>
              <BarChart3 size={20} className="sm:size-24 text-gray-400" />
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600">New Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold w-8 text-right">75%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600">Sessions</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold w-8 text-right">50%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600">Skills Added</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-5/6 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold w-8 text-right">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Export Reports</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => downloadReport('users')}
              className="flex items-center gap-3 p-3 sm:p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-left"
            >
              <Users size={20} className="sm:size-24 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">User Report</p>
                <p className="text-xs sm:text-sm text-gray-600">All user data and statistics</p>
              </div>
            </button>
            
            <button
              onClick={() => downloadReport('sessions')}
              className="flex items-center gap-3 p-3 sm:p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-left"
            >
              <Calendar size={20} className="sm:size-24 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Session Report</p>
                <p className="text-xs sm:text-sm text-gray-600">Session activity and metrics</p>
              </div>
            </button>
            
            <button
              onClick={() => downloadReport('skills')}
              className="flex items-center gap-3 p-3 sm:p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all sm:col-span-2 lg:col-span-1"
            >
              <BookOpen size={20} className="sm:size-24 text-purple-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Skills Report</p>
                <p className="text-xs sm:text-sm text-gray-600">Skills usage and popularity</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}