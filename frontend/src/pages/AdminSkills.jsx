import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/admin/skills');
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkillStatus = async (skillId, currentStatus) => {
    try {
      const { data } = await api.patch(`/admin/skills/${skillId}/status`, {
        isApproved: !currentStatus
      });
      setSkills(skills.map(skill => skill._id === skillId ? data : skill));
      toast.success('Skill status updated');
    } catch (error) {
      toast.error('Failed to update skill status');
    }
  };

  const deleteSkill = async (skillId) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/admin/skills/${skillId}`);
      setSkills(skills.filter(skill => skill._id !== skillId));
      toast.success('Skill deleted');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && skill.isApproved) ||
                         (filterStatus === 'pending' && !skill.isApproved);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Skills Management
            </h1>
            <p className="text-gray-600 font-medium">Approve and manage all skills</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'approved', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div key={skill._id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{skill.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  skill.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {skill.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {skill.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{skill.user?.name}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSkillStatus(skill._id, skill.isApproved)}
                  className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    skill.isApproved
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {skill.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  {skill.isApproved ? 'Unapprove' : 'Approve'}
                </button>
                <button
                  onClick={() => deleteSkill(skill._id)}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No skills found</p>
          </div>
        )}
      </div>
    </div>
  );
}
