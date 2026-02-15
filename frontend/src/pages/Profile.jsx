import { useState, useEffect } from 'react';
import { Mail, MapPin, Clock, Award, Star, Edit2, X, Camera, Upload, Check, TrendingUp, Users, BookOpen, Sparkles, Zap, Target, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    availability: '',
    skillsOffered: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        location: data.location || '',
        availability: data.availability || '',
        skillsOffered: data.skillsOffered?.join(', ') || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData);
      await api.put('/users/profile', { profilePicture: data.url });
      toast.success('Profile picture updated!');
      fetchProfile();
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(s => s)
      };
      await api.put('/users/profile', updateData);
      toast.success('Profile updated!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Cover Image */}
      <div className="h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-40 relative z-10 pb-16">
        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Profile Header */}
          <div className="p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="relative w-40 h-40 rounded-3xl object-cover shadow-2xl border-4 border-white"
                  />
                ) : (
                  <div className="relative w-40 h-40 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-white text-6xl font-black shadow-2xl border-4 border-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all cursor-pointer shadow-xl">
                  {uploading ? <Upload size={22} className="animate-spin" /> : <Camera size={22} />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {user?.isVerified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <Check size={18} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">{user?.name}</h1>
                      <Sparkles className="text-yellow-500" size={28} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <Mail size={16} className="text-blue-600" />
                        <span className="text-sm font-medium">{user?.email}</span>
                      </div>
                      {user?.location && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <MapPin size={16} className="text-red-600" />
                          <span className="text-sm font-medium">{user.location}</span>
                        </div>
                      )}
                      {user?.availability && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Clock size={16} className="text-green-600" />
                          <span className="text-sm font-medium">{user.availability}</span>
                        </div>
                      )}
                    </div>
                    {user?.bio && <p className="text-gray-700 text-lg max-w-3xl leading-relaxed">{user.bio}</p>}
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 mt-5">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                        <Users size={18} /> {user?.totalSwaps || 0} Swaps
                      </span>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                        <Star size={18} fill="currentColor" /> {user?.rating?.toFixed(1) || '0.0'} Rating
                      </span>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                        <Trophy size={18} /> Top Contributor
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 font-bold text-lg group"
                  >
                    {editing ? <X size={22} /> : <Edit2 size={22} />}
                    {editing ? 'Cancel' : 'Edit Profile'}
                    <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 px-10 py-8 border-y border-gray-200/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100">
                  <div className="flex items-center justify-center gap-3 text-4xl font-black text-blue-600 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <TrendingUp size={24} />
                    </div>
                    {user?.totalSwaps || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-bold text-center">Total Swaps</div>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-yellow-100">
                  <div className="flex items-center justify-center gap-3 text-4xl font-black text-yellow-600 mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Star size={24} fill="currentColor" />
                    </div>
                    {user?.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600 font-bold text-center">Rating</div>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-green-100">
                  <div className="flex items-center justify-center gap-3 text-4xl font-black text-green-600 mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    {user?.skillsOffered?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-bold text-center">Skills Offered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            {editing ? (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                        <MapPin size={14} className="text-red-600" />
                      </div>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles size={14} className="text-purple-600" />
                    </div>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={5}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock size={14} className="text-green-600" />
                    </div>
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg"
                    placeholder="Weekends, Evenings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={14} className="text-green-600" />
                    </div>
                    Skills You Offer
                  </label>
                  <input
                    type="text"
                    name="skillsOffered"
                    value={formData.skillsOffered}
                    onChange={(e) => setFormData({...formData, skillsOffered: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg"
                    placeholder="JavaScript, Python, Design (comma separated)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                  <Check size={24} />
                  Save Changes
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                </button>
              </form>
            ) : (
              /* View Mode */
              <div className="grid lg:grid-cols-1 gap-10">
                {/* Skills Offered */}
                <div className="group">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      Skills I Offer
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {user?.skillsOffered?.map((skill, idx) => (
                        <span key={idx} className="px-5 py-3 bg-white text-green-700 rounded-2xl text-base font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all border border-green-200">
                          {skill}
                        </span>
                      ))}
                      {(!user?.skillsOffered || user.skillsOffered.length === 0) && (
                        <p className="text-gray-500 text-lg">No skills added yet</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
