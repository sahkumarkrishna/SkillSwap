import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchSwapRequests, createSwapRequest, updateSwapStatus, deleteSwapRequest } from '../store/slices/swapsSlice';
import { fetchSkills } from '../store/slices/skillsSlice';
import { Plus, X, Send, ArrowRightLeft, Calendar, MessageSquare, User, CheckCircle, XCircle, Clock, Gift, Trash2, Filter, TrendingUp } from 'lucide-react';

export default function SwapRequests() {
  const dispatch = useDispatch();
  const { swaps } = useSelector((state) => state.swaps);
  const { skills } = useSelector((state) => state.skills);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('sent');
  const [formData, setFormData] = useState({
    mentor: '',
    skillWanted: '',
    skillOffered: '',
    message: '',
    preferredSchedule: ''
  });

  useEffect(() => {
    dispatch(fetchSwapRequests());
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSwapRequest(formData)).unwrap();
      toast.success('Swap request sent successfully!');
      setShowForm(false);
      setFormData({ mentor: '', skillWanted: '', skillOffered: '', message: '', preferredSchedule: '' });
    } catch (error) {
      toast.error(error || 'Failed to send request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateSwapStatus({ id, status })).unwrap();
      toast.success(`Request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await dispatch(deleteSwapRequest(id)).unwrap();
        toast.success('Request deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'from-yellow-500 to-orange-500',
      Accepted: 'from-green-500 to-emerald-500',
      Rejected: 'from-red-500 to-pink-500'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <Clock size={14} className="sm:w-4 sm:h-4" />,
      Accepted: <CheckCircle size={14} className="sm:w-4 sm:h-4" />,
      Rejected: <XCircle size={14} className="sm:w-4 sm:h-4" />
    };
    return icons[status] || <Clock size={14} className="sm:w-4 sm:h-4" />;
  };

  const sentRequests = swaps.filter(s => s.requester?._id === user?._id);
  const receivedRequests = swaps.filter(s => s.mentor?._id === user?._id);
  
  const filteredSent = filterStatus === 'All' ? sentRequests : sentRequests.filter(s => s.status === filterStatus);
  const filteredReceived = filterStatus === 'All' ? receivedRequests : receivedRequests.filter(s => s.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <ArrowRightLeft size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">Swap Requests</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Manage your skill exchange requests</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Total Requests</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{swaps.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl font-black text-yellow-600">{swaps.filter(s => s.status === 'Pending').length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Accepted</p>
            <p className="text-2xl sm:text-3xl font-black text-green-600">{swaps.filter(s => s.status === 'Accepted').length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Rejected</p>
            <p className="text-2xl sm:text-3xl font-black text-red-600">{swaps.filter(s => s.status === 'Rejected').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-sm sm:text-base ${
              activeTab === 'sent'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send size={16} className="sm:w-5 sm:h-5" />
              Sent ({sentRequests.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-sm sm:text-base ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Gift size={16} className="sm:w-5 sm:h-5" />
              Received ({receivedRequests.length})
            </div>
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
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

        {/* Requests List */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'sent' && (
            <>
              {filteredSent.map((swap) => (
                <div key={swap._id} className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">{swap.skillWanted?.title}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-sm sm:text-base font-semibold">To: {swap.mentor?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <ArrowRightLeft size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                            <span className="text-sm sm:text-base font-semibold">Offering: {swap.skillOffered}</span>
                          </div>
                          {swap.preferredSchedule && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={14} className="sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm">{swap.preferredSchedule}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${getStatusColor(swap.status)} text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-md flex-1 sm:flex-none justify-center`}>
                          {getStatusIcon(swap.status)}
                          {swap.status}
                        </span>
                        <button
                          onClick={() => handleDelete(swap._id)}
                          className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all"
                          title="Delete request"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                    {swap.message && (
                      <div className="bg-blue-50/60 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-4">
                        <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">"{swap.message}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredSent.length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Send size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg sm:text-xl font-bold">No sent requests</p>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">Create your first swap request</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'received' && (
            <>
              {filteredReceived.map((swap) => (
                <div key={swap._id} className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">{swap.skillWanted?.title}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-sm sm:text-base font-semibold">From: {swap.requester?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <ArrowRightLeft size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                            <span className="text-sm sm:text-base font-semibold">Offering: {swap.skillOffered}</span>
                          </div>
                          {swap.preferredSchedule && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={14} className="sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm">{swap.preferredSchedule}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${getStatusColor(swap.status)} text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-md`}>
                        {getStatusIcon(swap.status)}
                        {swap.status}
                      </span>
                    </div>
                    {swap.message && (
                      <div className="bg-green-50/60 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-4">
                        <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">"{swap.message}"</p>
                      </div>
                    )}
                    {swap.status === 'Pending' && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                        <button 
                          onClick={() => handleStatusUpdate(swap._id, 'Accepted')}
                          className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                          Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(swap._id, 'Rejected')}
                          className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <XCircle size={18} className="sm:w-5 sm:h-5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredReceived.length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Gift size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg sm:text-xl font-bold">No received requests</p>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">Others will send you requests soon</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
