import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBadges, fetchUserBadges } from '../store/slices/badgesSlice';
import { Trophy, Award, Target, Lock, CheckCircle, Sparkles, Star, Zap, Crown, Medal } from 'lucide-react';

export default function Badges() {
  const dispatch = useDispatch();
  const { badges, userBadges } = useSelector((state) => state.badges);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBadges());
    if (user?._id) {
      dispatch(fetchUserBadges(user._id));
    }
  }, [dispatch, user]);

  const earnedCount = userBadges?.length || 0;
  const totalCount = badges?.length || 0;
  const progress = totalCount > 0 ? ((earnedCount / totalCount) * 100).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <Trophy size={32} className="sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-yellow-900 to-orange-900 bg-clip-text text-transparent mb-2 sm:mb-3">Badges</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 font-medium px-4">Earn badges by completing milestones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="sm:w-5 sm:h-5 text-yellow-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Earned</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-yellow-600">{earnedCount}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Total</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{totalCount}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="sm:w-5 sm:h-5 text-purple-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Progress</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{progress}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="sm:w-5 sm:h-5 text-orange-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Remaining</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-orange-600">{totalCount - earnedCount}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10 border border-white/20">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm sm:text-base font-black text-gray-900">Overall Progress</p>
            <p className="text-sm sm:text-base font-black text-yellow-600">{progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* My Badges Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 mb-6 sm:mb-10">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2 sm:gap-3">
              <Sparkles size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              My Badges
            </h2>
          </div>
          <div className="p-4 sm:p-6 lg:p-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {userBadges?.map((badge) => (
                <div key={badge._id} className="text-center group">
                  <div className="relative mb-3 sm:mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-2xl group-hover:scale-110 transition-transform border-2 sm:border-4 border-white">
                      {badge.icon || '🏅'}
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <CheckCircle size={12} className="sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <p className="font-black text-xs sm:text-sm lg:text-base text-gray-900 mb-1 truncate px-1">{badge.name}</p>
                  <p className="text-xs text-gray-500 font-semibold">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              ))}
              {(!userBadges || userBadges.length === 0) && (
                <div className="col-span-full text-center py-12 sm:py-16">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Target size={40} className="sm:w-12 sm:h-12 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-lg sm:text-xl font-bold mb-2">No badges earned yet</p>
                  <p className="text-gray-400 text-sm sm:text-base">Start learning to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Badges Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2 sm:gap-3">
              <Award size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              Available Badges
            </h2>
          </div>
          <div className="p-4 sm:p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {badges.map((badge) => {
                const isEarned = userBadges?.some(ub => ub.badge?._id === badge._id || ub.name === badge.name);
                return (
                  <div key={badge._id} className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all border-2 ${
                    isEarned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-lg ${
                        isEarned 
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}>
                        {badge.icon || '🏅'}
                        {!isEarned && (
                          <div className="absolute inset-0 bg-black/40 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <Lock size={20} className="sm:w-6 sm:h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-black text-base sm:text-lg text-gray-900 truncate">{badge.name}</h3>
                          {isEarned && (
                            <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed break-words">{badge.description}</p>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Target size={12} className="sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                            <p className="text-xs font-black text-blue-900">Criteria:</p>
                          </div>
                          <p className="text-xs text-blue-800 font-semibold break-words">{badge.criteria}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
