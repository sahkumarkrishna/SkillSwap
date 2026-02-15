import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchSessions, createSession, updateSession, deleteSession } from '../store/slices/sessionsSlice';
import { fetchSwapRequests } from '../store/slices/swapsSlice';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle, ExternalLink, Users, Plus, X, Edit, Trash2 } from 'lucide-react';

export default function Sessions() {
  const dispatch = useDispatch();
  const { sessions, loading } = useSelector((state) => state.sessions);
  const { swaps } = useSelector((state) => state.swaps);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    skill: '',
    date: '',
    duration: 60,
    meetingLink: '',
    notes: ''
  });

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchSwapRequests());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await dispatch(updateSession({ id: editingSession._id, sessionData: formData })).unwrap();
        toast.success('Session updated successfully!');
      } else {
        await dispatch(createSession(formData)).unwrap();
        toast.success('Session created successfully!');
      }
      handleCancel();
    } catch (error) {
      toast.error(error || 'Failed to save session');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      skill: session.skill || '',
      date: new Date(session.scheduledAt || session.date).toISOString().slice(0, 16),
      duration: session.duration || 60,
      meetingLink: session.meetingLink || '',
      notes: session.notes || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setFormData({ skill: '', date: '', duration: 60, meetingLink: '', notes: '' });
  };

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 15);
    setFormData({...formData, meetingLink: `https://meet.skillswap.com/${meetingId}`});
    toast.success('Meeting link generated!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      try {
        await dispatch(deleteSession(id)).unwrap();
        toast.success('Session cancelled successfully!');
      } catch (error) {
        toast.error('Failed to cancel session');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Scheduled: 'from-blue-500 to-indigo-500',
      Completed: 'from-green-500 to-emerald-500',
      Cancelled: 'from-red-500 to-pink-500'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Scheduled: <AlertCircle size={16} />,
      Completed: <CheckCircle size={16} />,
      Cancelled: <XCircle size={16} />
    };
    return icons[status] || <AlertCircle size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">My Sessions</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Manage your learning sessions</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
          >
            {showForm ? <X size={18} className="sm:w-5 sm:h-5" /> : <Plus size={18} className="sm:w-5 sm:h-5" />}
            {showForm ? 'Close' : 'Schedule Session'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl mb-8 overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {editingSession ? <Edit size={24} /> : <Plus size={24} />}
                {editingSession ? 'Edit Session' : 'Schedule New Session'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Skill/Topic *</label>
                <input
                  type="text"
                  placeholder="e.g., React Development, Guitar Lessons"
                  value={formData.skill}
                  onChange={(e) => setFormData({...formData, skill: e.target.value})}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Duration (minutes) *</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Meeting Link</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                    className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-lg"
                  />
                  <button
                    type="button"
                    onClick={generateMeetingLink}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap text-sm sm:text-base"
                  >
                    Generate Link
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Notes</label>
                <textarea
                  placeholder="Add any notes or agenda for this session..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-lg resize-none"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  {editingSession ? 'Update Session' : 'Schedule Session'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats & Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Total Sessions</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{sessions.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Scheduled</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{sessions.filter(s => s.status === 'Scheduled').length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Completed</p>
            <p className="text-2xl sm:text-3xl font-black text-green-600">{sessions.filter(s => s.status === 'Completed').length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Cancelled</p>
            <p className="text-2xl sm:text-3xl font-black text-red-600">{sessions.filter(s => s.status === 'Cancelled').length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Scheduled', 'Completed', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-sm sm:text-base ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4 sm:space-y-5">
          {sessions.filter(s => filterStatus === 'All' || s.status === filterStatus).map((session) => (
            <div key={session._id} className="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
                  {/* Session Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        <Users size={24} className="sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 mb-2 sm:mb-3">{session.skill || 'Skill Session'}</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                            <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-xs sm:text-sm font-bold text-blue-900">{new Date(session.scheduledAt || session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                            <Clock size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                            <span className="text-xs sm:text-sm font-bold text-purple-900">{new Date(session.scheduledAt || session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                            <Clock size={14} className="sm:w-4 sm:h-4 text-green-600" />
                            <span className="text-xs sm:text-sm font-bold text-green-900">{session.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {session.meetingLink && (
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition-all text-sm sm:text-base"
                      >
                        <Video size={18} className="sm:w-5 sm:h-5" />
                        Join Meeting
                        <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      </a>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${getStatusColor(session.status)} text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-lg`}>
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                    {(session.status === 'Scheduled' || session.status === 'pending') && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(session)}
                          className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-all"
                          title="Edit session"
                        >
                          <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(session._id)}
                          className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all"
                          title="Cancel session"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {sessions.filter(s => filterStatus === 'All' || s.status === filterStatus).length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 lg:p-20 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calendar size={32} className="sm:w-10 sm:h-10 text-gray-500" />
              </div>
              <p className="text-gray-500 text-lg sm:text-xl font-bold">No sessions yet</p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">Start by requesting a skill swap!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
