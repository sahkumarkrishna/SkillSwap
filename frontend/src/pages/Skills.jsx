import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchSkills, createSkill, updateSkill, deleteSkill, requestSkill, toggleFavorite, rateSkill } from '../store/slices/skillsSlice';
import { fetchSwapRequests } from '../store/slices/swapsSlice';
import { Plus, X, BookOpen, Clock, Award, Filter, Search, Star, Heart, TrendingUp, Edit, Trash2, Tag, DollarSign, ChevronDown, Users, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

export default function Skills() {
  const dispatch = useDispatch();
  const { skills, loading } = useSelector((state) => state.skills);
  const { swaps } = useSelector((state) => state.swaps);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showMySkills, setShowMySkills] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    category: '', 
    level: 'Beginner', 
    description: '',
    timeSlots: [],
    duration: '',
    tags: [],
    price: 0
  });

  const predefinedCategories = [
    'Programming', 'Design', 'Music', 'Language', 'Cooking', 'Sports', 'Art', 'Photography',
    'Writing', 'Marketing', 'Business', 'Health & Fitness', 'Crafts', 'Technology', 'Education', 'Other'
  ];

  const categories = ['All', ...new Set(skills.map(s => s.category))];
  const isOwner = (skill) => {
    if (!user || !user._id || !skill.user) return false;
    const skillUserId = typeof skill.user === 'object' ? skill.user._id : skill.user;
    const currentUserId = user._id;
    console.log('Checking ownership:', {
      skillTitle: skill.title,
      skillUserId,
      currentUserId,
      isOwner: skillUserId === currentUserId
    });
    return skillUserId === currentUserId;
  };

  useEffect(() => {
    const params = showMySkills ? { userId: user?._id } : {};
    dispatch(fetchSkills(params));
    dispatch(fetchSwapRequests());
  }, [dispatch, showMySkills, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all required fields (Title, Category, Description)');
      return;
    }

    try {
      const skillData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        level: formData.level,
        duration: formData.duration.trim(),
        tags: formData.tags.filter(tag => tag.trim()),
        price: Number(formData.price) || 0
      };

      if (editingSkill) {
        await dispatch(updateSkill({ id: editingSkill._id, skillData })).unwrap();
        toast.success('Skill updated successfully!');
      } else {
        await dispatch(createSkill(skillData)).unwrap();
        toast.success('Skill created successfully!');
      }
      handleCancel();
    } catch (error) {
      console.error('Skill save error:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to save skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      timeSlots: skill.timeSlots || [],
      duration: skill.duration || '',
      tags: skill.tags || [],
      price: skill.price || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (skillId) => {
    if (!skillId) {
      toast.error('Invalid skill ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      try {
        await dispatch(deleteSkill(skillId)).unwrap();
        toast.success('Skill deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(typeof error === 'string' ? error : 'Failed to delete skill');
      }
    }
  };

  const handleRequest = async (skill) => {
    try {
      const swapData = {
        mentor: skill.user._id || skill.user,
        skillWanted: skill._id,
        skillOffered: '',
        message: `I would like to learn ${skill.title}`,
        preferredSchedule: []
      };
      await api.post('/swaps', swapData);
      await dispatch(requestSkill(skill._id)).unwrap();
      toast.success('Swap request sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleFavorite = async (skillId) => {
    try {
      await dispatch(toggleFavorite(skillId)).unwrap();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
    setFormData({ title: '', category: '', level: 'Beginner', description: '', timeSlots: [], duration: '', tags: [], price: 0 });
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (skill.tags && skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLevel = filterLevel === 'All' || skill.level === filterLevel;
    const matchesCategory = filterCategory === 'All' || skill.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'requests': return (b.requestCount || 0) - (a.requestCount || 0);
      case 'favorites': return (b.favoriteCount || 0) - (a.favoriteCount || 0);
      case 'price': return (a.price || 0) - (b.price || 0);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const StarRating = ({ rating, readonly = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        {readonly && <span className="text-sm text-gray-600 ml-1">({rating || 0})</span>}
      </div>
    );
  };

  const getRequestStatus = (skillId) => {
    const request = swaps.find(s => s.skillWanted?._id === skillId && s.requester?._id === user?._id);
    return request?.status;
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const config = {
      Pending: { color: 'from-yellow-500 to-orange-500', icon: <Clock size={12} /> },
      Accepted: { color: 'from-green-500 to-emerald-500', icon: <CheckCircle size={12} /> },
      Rejected: { color: 'from-red-500 to-pink-500', icon: <XCircle size={12} /> }
    };
    const { color, icon } = config[status] || config.Pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${color} text-white rounded-full text-xs font-bold`}>
        {icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">Skills Hub</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Discover, share, and master new skills</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowMySkills(!showMySkills)}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${showMySkills 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'}`}
            >
              {showMySkills ? 'All Skills' : 'My Skills'}
            </button>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              {showForm ? <X size={18} className="sm:w-5 sm:h-5" /> : <Plus size={18} className="sm:w-5 sm:h-5" />}
              {showForm ? 'Close' : 'Add Skill'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl mb-8 overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {editingSkill ? <Edit size={24} /> : <Plus size={24} />}
                {editingSkill ? 'Edit Your Skill' : 'Share Your Skill'}
              </h2>
              <p className="text-emerald-100 mt-1">Fill in the details to showcase your expertise</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Essential Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-emerald-600" />
                  Essential Information
                </h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Skill Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Advanced React Development" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Category *</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg appearance-none bg-white" 
                        required
                      >
                        <option value="">Select a category</option>
                        {predefinedCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Description *</label>
                  <textarea 
                    placeholder="Describe what you'll teach, your experience, and what students will learn..." 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg resize-none" 
                    rows="5"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Award size={20} className="text-purple-600" />
                  Additional Details
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Skill Level</label>
                    <div className="relative">
                      <select 
                        value={formData.level} 
                        onChange={(e) => setFormData({...formData, level: e.target.value})} 
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-lg appearance-none bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Session Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 1 hour, 90 minutes" 
                      value={formData.duration} 
                      onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Price (USD)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-lg" 
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-blue-600" />
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold flex items-center gap-2 border border-blue-200">
                      {tag}
                      <X size={14} className="cursor-pointer hover:text-red-600 transition-colors" onClick={() => removeTag(tag)} />
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="Add relevant tags (press Enter to add)" 
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value) {
                        addTag(value);
                        e.target.value = '';
                      }
                    }
                  }}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {editingSkill ? <Edit size={20} /> : <Plus size={20} />}
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-white/50">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 font-semibold"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 font-semibold"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 font-semibold"
              >
                <option value="createdAt">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="requests">Most Requested</option>
                <option value="favorites">Most Favorited</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {sortedSkills.map((skill) => (
            <div key={skill._id} className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:scale-[1.02]">
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{skill.title}</h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1">
                        <Filter size={12} className="sm:w-3.5 sm:h-3.5 text-blue-500" />
                        <span className="font-semibold truncate">{skill.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                      <StarRating rating={skill.rating || 0} readonly />
                      <span className="text-gray-500 font-medium">({skill.ratingCount || 0})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:gap-3 ml-2">
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
                        skill.level === 'Beginner' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        skill.level === 'Intermediate' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                        'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }`}>{skill.level}</span>
                      {getStatusBadge(getRequestStatus(skill._id))}
                    </div>
                    {skill.price > 0 && (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-lg sm:text-2xl font-bold text-emerald-600">
                        <DollarSign size={16} className="sm:w-5 sm:h-5" />
                        <span>{skill.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {skill.tags && skill.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {skill.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                        {tag}
                      </span>
                    ))}
                    {skill.tags.length > 3 && (
                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        +{skill.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed line-clamp-3">{skill.description}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                  {skill.duration && (
                    <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-blue-600 mb-1" />
                      <span className="font-semibold text-gray-700 text-center text-xs sm:text-sm">{skill.duration}</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <Users size={14} className="sm:w-4 sm:h-4 text-green-600 mb-1" />
                    <span className="font-semibold text-gray-700 text-xs sm:text-sm">{skill.requestCount || 0}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <Heart size={14} className="sm:w-4 sm:h-4 text-pink-600 mb-1" />
                    <span className="font-semibold text-gray-700 text-xs sm:text-sm">{skill.favoriteCount || 0}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t-2 border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg flex-shrink-0">
                      {skill.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold block truncate">{skill.user?.name}</span>
                      <div className="text-xs text-gray-400">Creator</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handleEdit(skill)}
                      className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-all duration-300 hover:scale-110"
                      title="Edit skill"
                    >
                      <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(skill._id)}
                      className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all duration-300 hover:scale-110"
                      title="Delete skill"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button 
                      onClick={() => handleRequest(skill)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-1.5 font-semibold text-xs sm:text-sm"
                      title="Request skill"
                    >
                      <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedSkills.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-20 text-center border border-white/50">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={48} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No skills found</h3>
            <p className="text-gray-500 text-lg mb-6">Try adjusting your filters or be the first to add a skill in this category</p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add Your First Skill
            </button>
          </div>
        )}
      </div>
    </div>
  );
}