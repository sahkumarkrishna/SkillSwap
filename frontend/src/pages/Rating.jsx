import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../store/slices/reviewsSlice';
import { Star, TrendingUp, Award, Users, BarChart3, Target, Trophy, Zap } from 'lucide-react';

export default function Rating() {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchReviews(user._id));
    }
  }, [dispatch, user]);

  const receivedReviews = reviews?.filter(review => review.reviewee?._id === user?._id) || [];
  const totalReviews = receivedReviews.length;
  const averageRating = totalReviews > 0 
    ? (receivedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: receivedReviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 ? (receivedReviews.filter(review => review.rating === rating).length / totalReviews * 100).toFixed(1) : 0
  }));

  const getGrade = (rating) => {
    if (rating >= 4.5) return { grade: 'A+', color: 'from-green-600 to-emerald-600' };
    if (rating >= 4) return { grade: 'A', color: 'from-green-500 to-emerald-500' };
    if (rating >= 3.5) return { grade: 'B+', color: 'from-blue-600 to-indigo-600' };
    if (rating >= 3) return { grade: 'B', color: 'from-blue-500 to-indigo-500' };
    return { grade: 'C', color: 'from-gray-600 to-gray-700' };
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

  const gradeInfo = getGrade(averageRating);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <Award size={24} className="sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-yellow-900 to-orange-900 bg-clip-text text-transparent">My Rating</h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Your performance & feedback overview</p>
          </div>
        </div>

        {/* Rating Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Average Rating */}
          <div className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Star size={20} className="sm:w-6 sm:h-6 fill-white" />
                <h2 className="text-base sm:text-xl font-bold opacity-90">Average Rating</h2>
              </div>
              <p className="text-5xl sm:text-6xl font-black mb-3 sm:mb-4">{averageRating}</p>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating), 20)}
                <span className="text-xs sm:text-sm opacity-90">out of 5</span>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Users size={20} className="sm:w-6 sm:h-6" />
                <h2 className="text-base sm:text-xl font-bold opacity-90">Total Reviews</h2>
              </div>
              <p className="text-5xl sm:text-6xl font-black mb-3 sm:mb-4">{totalReviews}</p>
              <p className="text-xs sm:text-sm opacity-90">Reviews received</p>
            </div>
          </div>

          {/* Performance Grade */}
          <div className={`bg-gradient-to-br ${gradeInfo.color} text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative sm:col-span-2 lg:col-span-1`}>
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Trophy size={20} className="sm:w-6 sm:h-6" />
                <h2 className="text-base sm:text-xl font-bold opacity-90">Performance</h2>
              </div>
              <p className="text-5xl sm:text-6xl font-black mb-3 sm:mb-4">{gradeInfo.grade}</p>
              <p className="text-xs sm:text-sm opacity-90">Grade level</p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 mb-6 sm:mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
              <BarChart3 size={24} className="sm:w-7 sm:h-7" />
              Rating Distribution
            </h2>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1 sm:gap-2 w-14 sm:w-20">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{rating}</span>
                    <Star size={14} className="sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-10 sm:w-16 text-right">
                    <span className="text-xs sm:text-sm font-bold text-gray-600">{count}</span>
                  </div>
                  <div className="w-12 sm:w-16 text-right">
                    <span className="text-xs sm:text-sm font-semibold text-gray-500">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
              <Target size={24} className="sm:w-7 sm:h-7" />
              Recent Reviews About You
            </h2>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              {receivedReviews.slice(0, 5).map((review) => (
                <div key={review._id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 hover:border-yellow-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-base sm:text-lg font-black flex-shrink-0">
                        {review.reviewer?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base sm:text-lg text-gray-900 truncate">{review.reviewer?.name}</p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating, 14)}
                          <span className="text-xs sm:text-sm font-bold text-gray-600">({review.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 font-semibold flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bg-white/60 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words">{review.feedback}</p>
                  </div>
                </div>
              ))}
              
              {receivedReviews.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Star size={32} className="sm:w-10 sm:h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-lg sm:text-xl font-bold">No reviews yet</p>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">Complete sessions to receive reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
