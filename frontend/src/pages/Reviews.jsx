import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchReviews, createReview } from '../store/slices/reviewsSlice';
import { fetchSessions } from '../store/slices/sessionsSlice';
import { Star, Plus, X, User, MessageSquare, Calendar, CheckCircle, Award, TrendingUp, Filter, Send } from 'lucide-react';

export default function Reviews() {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.reviews);
  const { sessions } = useSelector((state) => state.sessions);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('received');
  const [filterRating, setFilterRating] = useState('All');
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: ''
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchReviews(user._id));
      dispatch(fetchSessions());
    }
  }, [dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        rating: formData.rating,
        feedback: formData.feedback,
        reviewee: user._id
      };
      await dispatch(createReview(reviewData)).unwrap();
      toast.success('Review submitted successfully!');
      setShowForm(false);
      setFormData({ rating: 5, feedback: '' });
      dispatch(fetchReviews(user._id));
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating, size = 20) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={size}
            className={`${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const receivedReviews = reviews?.filter(r => r.reviewee?._id === user?._id) || [];
  const givenReviews = reviews?.filter(r => r.reviewer?._id === user?._id) || [];

  const filteredReviews = activeTab === 'received' ? receivedReviews : givenReviews;
  const ratingFilteredReviews = filterRating === 'All' 
    ? filteredReviews 
    : filteredReviews.filter(r => r.rating === parseInt(filterRating));

  const avgRating = receivedReviews.length > 0
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : 0;

  const completedSessions = sessions?.filter(s => s.status === 'Completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Star size={24} className="sm:w-7 sm:h-7 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-yellow-900 to-orange-900 bg-clip-text text-transparent">Reviews</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Share your experience & feedback</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-lg"
          >
            {showForm ? <X size={20} className="sm:w-6 sm:h-6" /> : <Plus size={20} className="sm:w-6 sm:h-6" />}
            {showForm ? 'Close' : 'Write Review'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="sm:w-5 sm:h-5 text-yellow-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Avg Rating</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-yellow-600">{avgRating}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-green-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Received</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-green-600">{receivedReviews.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Send size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Given</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{givenReviews.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="sm:w-5 sm:h-5 text-purple-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Total</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{reviews?.length || 0}</p>
          </div>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-10 overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
                <MessageSquare size={20} className="sm:w-7 sm:h-7" />
                Write a Review
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Star size={14} className="sm:w-4 sm:h-4 text-yellow-600" />
                  Rating *
                </label>
                <div className="flex gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="transition-transform hover:scale-125"
                    >
                      <Star 
                        size={36}
                        className={`sm:w-12 sm:h-12 ${star <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <MessageSquare size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                  Your Feedback *
                </label>
                <textarea 
                  placeholder="Share your experience and what you learned..." 
                  value={formData.feedback} 
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-yellow-500 focus:bg-white outline-none transition-all text-base sm:text-lg resize-none"
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={20} className="sm:w-6 sm:h-6" />
                  Submit Review
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-300 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-sm sm:text-base ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="sm:w-5 sm:h-5" />
              Received ({receivedReviews.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-sm sm:text-base ${
              activeTab === 'given'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send size={16} className="sm:w-5 sm:h-5" />
              Given ({givenReviews.length})
            </div>
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
            <Filter size={18} className="text-gray-600 flex-shrink-0" />
            {['All', '5', '4', '3', '2', '1'].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
                  filterRating === rating
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating === 'All' ? 'All' : `${rating} ⭐`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 sm:space-y-5">
          {ratingFilteredReviews.map((review) => (
            <div key={review._id} className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-black shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                      {(activeTab === 'received' ? review.reviewer?.name : review.reviewee?.name)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <p className="font-black text-base sm:text-xl text-gray-900 truncate">
                          {activeTab === 'received' ? review.reviewer?.name : review.reviewee?.name}
                        </p>
                        {activeTab === 'received' && (
                          <>
                            <span className="text-gray-500 text-sm hidden sm:inline">→</span>
                            <p className="font-semibold text-sm sm:text-lg text-gray-600 truncate">You</p>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {renderStars(review.rating, 16)}
                        <span className="text-xs sm:text-sm font-bold text-gray-600">({review.rating}/5)</span>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-5">
                        <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed break-words">{review.feedback}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-semibold">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {ratingFilteredReviews.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Star size={32} className="sm:w-10 sm:h-10 text-gray-500" />
              </div>
              <p className="text-gray-500 text-lg sm:text-xl font-bold">No reviews found</p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                {activeTab === 'received' ? 'Complete sessions to receive reviews' : 'Write your first review'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
