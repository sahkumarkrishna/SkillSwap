import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api';
import { ArrowLeft, User, BookOpen, Calendar, Clock, CheckCircle, XCircle, MessageSquare, Sparkles } from 'lucide-react';

export default function SwapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwapDetail();
  }, [id]);

  const fetchSwapDetail = async () => {
    try {
      const { data } = await api.get(`/swaps/${id}`);
      setSwap(data);
    } catch (error) {
      toast.error('Failed to load swap details');
      navigate('/swaps');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await api.patch(`/swaps/${id}`, { status: 'Accepted' });
      toast.success('Swap request accepted!');
      fetchSwapDetail();
    } catch (error) {
      toast.error('Failed to accept swap');
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/swaps/${id}`, { status: 'Rejected' });
      toast.success('Swap request rejected');
      navigate('/swaps');
    } catch (error) {
      toast.error('Failed to reject swap');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!swap) return null;

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'from-yellow-500 to-orange-500',
      Accepted: 'from-green-500 to-emerald-600',
      Rejected: 'from-red-500 to-pink-600'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/swaps')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Swaps
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-black flex items-center gap-3">
                <Sparkles size={32} />
                Swap Request Details
              </h1>
              <span className={`px-6 py-3 bg-gradient-to-r ${getStatusColor(swap.status)} text-white rounded-2xl font-bold text-lg shadow-lg`}>
                {swap.status}
              </span>
            </div>
            <p className="text-blue-100 text-lg">Request ID: {swap._id}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Requester Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-blue-600" />
                Requester
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {swap.requester?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{swap.requester?.name}</p>
                  <p className="text-gray-600">{swap.requester?.email}</p>
                </div>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-purple-600" />
                Mentor
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {swap.mentor?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{swap.mentor?.name}</p>
                  <p className="text-gray-600">{swap.mentor?.email}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={20} className="text-green-600" />
                  Skill Wanted
                </h3>
                <p className="text-lg font-bold text-green-700">{swap.skillWanted?.title}</p>
                <p className="text-sm text-gray-600 mt-2">{swap.skillWanted?.description}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100">
                <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-600" />
                  Skill Offered
                </h3>
                <p className="text-lg font-bold text-orange-700">{swap.skillOffered || 'Not specified'}</p>
              </div>
            </div>

            {/* Message */}
            {swap.message && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={20} className="text-gray-600" />
                  Message
                </h3>
                <p className="text-gray-700 leading-relaxed">{swap.message}</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Calendar size={16} />
                <span>Created: {new Date(swap.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Clock size={16} />
                <span>Updated: {new Date(swap.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            {swap.status === 'Pending' && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={24} />
                  Accept Request
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={24} />
                  Reject Request
                </button>
              </div>
            )}

            {swap.status === 'Accepted' && (
              <Link
                to="/chat"
                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
              >
                <MessageSquare className="inline mr-2" size={24} />
                Start Chat
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
