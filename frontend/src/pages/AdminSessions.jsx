import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/admin/sessions');
      setSessions(data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await api.patch(`/admin/sessions/${sessionId}/status`, { status });
      setSessions(sessions.map(session => 
        session._id === sessionId ? { ...session, status } : session
      ));
      toast.success('Session status updated successfully');
    } catch (error) {
      toast.error('Failed to update session status');
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.participants?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'active': return <Clock size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar size={24} className="sm:hidden text-white" />
            <Calendar size={32} className="hidden sm:block text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
              Sessions Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Monitor and manage all platform sessions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-auto pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Mobile Cards View */}
          <div className="block lg:hidden">
            {filteredSessions.map((session) => (
              <div key={session._id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{session.title || 'Skill Exchange Session'}</p>
                    <p className="text-sm text-gray-600 truncate">{session.skill || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {session.participants?.slice(0, 3).map((participant, index) => (
                    <div key={index} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {participant.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {session.participants?.length > 3 && (
                    <span className="text-xs text-gray-600">+{session.participants.length - 3}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {session.scheduledAt ? new Date(session.scheduledAt).toLocaleDateString() : 'Not scheduled'}
                  </span>
                  <div className="flex items-center gap-1">
                    {session.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateSessionStatus(session._id, 'active')}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                          title="Approve Session"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => updateSessionStatus(session._id, 'cancelled')}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Cancel Session"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    {session.status === 'active' && (
                      <button
                        onClick={() => updateSessionStatus(session._id, 'completed')}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="Mark as Completed"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Session</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Participants</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{session.title || 'Skill Exchange Session'}</p>
                        <p className="text-sm text-gray-600">{session.skill || 'General'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {session.participants?.slice(0, 3).map((participant, index) => (
                          <div key={index} className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {participant.name?.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {session.participants?.length > 3 && (
                          <span className="text-sm text-gray-600">+{session.participants.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          {session.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {session.scheduledAt ? new Date(session.scheduledAt).toLocaleDateString() : 'Not scheduled'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {session.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateSessionStatus(session._id, 'active')}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                              title="Approve Session"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateSessionStatus(session._id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Cancel Session"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {session.status === 'active' && (
                          <button
                            onClick={() => updateSessionStatus(session._id, 'completed')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSessions.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}