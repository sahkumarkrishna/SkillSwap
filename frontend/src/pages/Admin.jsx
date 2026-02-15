import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, fetchStats } from '../store/slices/adminSlice';
import { toast } from 'react-toastify';
import { Users, BookOpen, Calendar, ArrowRightLeft, Shield, TrendingUp, Award, MessageSquare, CheckCircle } from 'lucide-react';
import AdminStatsCard from '../components/admin/AdminStatsCard';
import UserTable from '../components/admin/UserTable';

export default function Admin() {
  const dispatch = useDispatch();
  const { users, stats } = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(fetchAllUsers()).unwrap(),
          dispatch(fetchStats()).unwrap()
        ]);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-gray-600 font-medium mt-1">Complete platform overview and management</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - 8 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <AdminStatsCard 
            icon={Users}
            title="Total Users"
            value={stats?.totalUsers || users.length}
            color="from-blue-500 to-indigo-600"
            borderColor="border-blue-500"
          />
          <AdminStatsCard 
            icon={CheckCircle}
            title="Active Users"
            value={stats?.activeUsers || 0}
            color="from-green-500 to-emerald-600"
            borderColor="border-green-500"
          />
          <AdminStatsCard 
            icon={BookOpen}
            title="Total Skills"
            value={stats?.totalSkills || 0}
            color="from-purple-500 to-pink-600"
            borderColor="border-purple-500"
          />
          <AdminStatsCard 
            icon={Calendar}
            title="Total Sessions"
            value={stats?.totalSessions || 0}
            color="from-orange-500 to-red-600"
            borderColor="border-orange-500"
          />
          <AdminStatsCard 
            icon={ArrowRightLeft}
            title="Active Swaps"
            value={stats?.activeSwaps || 0}
            color="from-cyan-500 to-blue-600"
            borderColor="border-cyan-500"
          />
          <AdminStatsCard 
            icon={CheckCircle}
            title="Completed Sessions"
            value={stats?.completedSessions || 0}
            color="from-teal-500 to-green-600"
            borderColor="border-teal-500"
          />
          <AdminStatsCard 
            icon={Award}
            title="Pending Skills"
            value={stats?.pendingSkills?.length || 0}
            color="from-yellow-500 to-orange-600"
            borderColor="border-yellow-500"
          />
          <AdminStatsCard 
            icon={TrendingUp}
            title="Unverified Users"
            value={stats?.unverifiedUsers?.length || 0}
            color="from-red-500 to-pink-600"
            borderColor="border-red-500"
          />
        </div>

        {/* Pending Skills Section */}
        {stats?.pendingSkills?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/20">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Award className="text-yellow-600" size={28} />
              Pending Skills Approval
            </h2>
            <div className="space-y-4">
              {stats.pendingSkills.slice(0, 5).map((skill) => (
                <div key={skill._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div>
                    <p className="font-bold text-gray-900">{skill.title}</p>
                    <p className="text-sm text-gray-600">by {skill.user?.name} ({skill.user?.email})</p>
                  </div>
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm">Pending</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unverified Users Section */}
        {stats?.unverifiedUsers?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/20">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Users className="text-red-600" size={28} />
              Unverified Users
            </h2>
            <div className="space-y-4">
              {stats.unverifiedUsers.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm">Unverified</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management Table */}
        <UserTable users={users} />
      </div>
    </div>
  );
}
