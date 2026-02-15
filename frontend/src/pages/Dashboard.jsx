import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSkills } from '../store/slices/skillsSlice';
import { fetchSessions } from '../store/slices/sessionsSlice';
import { fetchSwapRequests } from '../store/slices/swapsSlice';
import { fetchWallet } from '../store/slices/walletSlice';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import { fetchReviews } from '../store/slices/reviewsSlice';
import { toast } from 'react-toastify';
import { 
  Wallet, BookOpen, Calendar, ArrowRightLeft, Star, Bell, TrendingUp, Award,
  Users, Target, Clock, Zap, ArrowRight, Activity
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentSessions from '../components/dashboard/RecentSessions';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { skills } = useSelector((state) => state.skills);
  const { sessions } = useSelector((state) => state.sessions);
  const { swaps } = useSelector((state) => state.swaps);
  const { balance, transactions } = useSelector((state) => state.wallet);
  const { notifications } = useSelector((state) => state.notifications);
  const { reviews } = useSelector((state) => state.reviews);

  useEffect(() => {
    const loadData = async () => {
      if (!user?._id && !user?.id) return;
      
      try {
        await Promise.all([
          dispatch(fetchSkills()).unwrap(),
          dispatch(fetchSessions()).unwrap(),
          dispatch(fetchSwapRequests()).unwrap(),
          dispatch(fetchWallet()).unwrap(),
          dispatch(fetchNotifications()).unwrap(),
          dispatch(fetchReviews(user._id || user.id)).unwrap()
        ]);
      } catch (error) {
        console.error('Dashboard load error:', error);
      }
    };
    loadData();
  }, [dispatch, user?._id, user?.id]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const totalSwaps = swaps.filter(s => s.status === 'Accepted').length;
  const userId = user?._id || user?.id;
  const learningCount = swaps.filter(s => s.requester?._id === userId || s.requester?.id === userId || s.requester === userId).length;
  const teachingCount = swaps.filter(s => s.mentor?._id === userId || s.mentor?.id === userId || s.mentor === userId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 lg:py-8 px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-black shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium mt-1">Here's your learning and teaching overview</p>
            </div>
          </div>
        </div>
        
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatsCard 
            icon={Wallet}
            title="Credits"
            value={balance || 50}
            color="text-green-600"
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard 
            icon={BookOpen}
            title="Skills"
            value={skills.length}
            color="text-blue-600"
            gradient="from-blue-500 to-indigo-600"
          />
          <StatsCard 
            icon={Calendar}
            title="Sessions"
            value={sessions.filter(s => s.status === 'Scheduled').length}
            color="text-purple-600"
            gradient="from-purple-500 to-pink-600"
          />
          <StatsCard 
            icon={ArrowRightLeft}
            title="Requests"
            value={swaps.filter(s => s.status === 'Pending').length}
            color="text-orange-600"
            gradient="from-orange-500 to-red-600"
          />
          <StatsCard 
            icon={TrendingUp}
            title="Swaps"
            value={totalSwaps}
            color="text-cyan-600"
            gradient="from-cyan-500 to-blue-600"
          />
          <StatsCard 
            icon={Award}
            title="Completed"
            value={completedSessions}
            color="text-teal-600"
            gradient="from-teal-500 to-green-600"
          />
          <StatsCard 
            icon={Star}
            title="Rating"
            value={avgRating}
            color="text-yellow-600"
            gradient="from-yellow-500 to-orange-600"
          />
          <StatsCard 
            icon={Bell}
            title="Alerts"
            value={unreadNotifications}
            color="text-red-600"
            gradient="from-red-500 to-pink-600"
          />
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-blue-600">LEARNING</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{learningCount}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Skills you're learning</p>
            <Link to="/swaps" className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View Details <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-purple-600">TEACHING</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{teachingCount}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Skills you're teaching</p>
            <Link to="/skills" className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
              View Details <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-green-600">REVIEWS</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{reviews.length}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total reviews received</p>
            <Link to="/reviews" className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
              View Details <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <Zap size={20} className="text-yellow-500 sm:w-6 sm:h-6" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/skills" className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg group">
              <BookOpen size={20} className="text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
              <p className="text-xs sm:text-sm font-bold text-gray-900">Browse Skills</p>
            </Link>
            <Link to="/sessions" className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg group">
              <Calendar size={20} className="text-purple-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
              <p className="text-xs sm:text-sm font-bold text-gray-900">My Sessions</p>
            </Link>
            <Link to="/swaps" className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg group">
              <ArrowRightLeft size={20} className="text-orange-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
              <p className="text-xs sm:text-sm font-bold text-gray-900">Swap Requests</p>
            </Link>
            <Link to="/wallet" className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg group">
              <Wallet size={20} className="text-green-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
              <p className="text-xs sm:text-sm font-bold text-gray-900">My Wallet</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <RecentSessions sessions={sessions.slice(0, 5)} />
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
