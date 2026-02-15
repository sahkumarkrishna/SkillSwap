import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchForumPosts, createForumPost, upvotePost, upvoteAnswer, acceptAnswer, addAnswer, updatePost, deletePost } from '../store/slices/forumSlice';
import { Plus, X, MessageSquare, ThumbsUp, CheckCircle, User, Send, Filter, Tag, Search, TrendingUp, Clock, Award, Edit, Trash2, Heart } from 'lucide-react';

export default function Forum() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.forum);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    dispatch(fetchForumPosts());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await dispatch(updatePost({ postId: editingPost, postData: formData })).unwrap();
        toast.success('Post updated successfully!');
        setEditingPost(null);
      } else {
        await dispatch(createForumPost(formData)).unwrap();
        toast.success('Post created successfully!');
      }
      setShowForm(false);
      setFormData({ title: '', content: '', category: '' });
    } catch (error) {
      toast.error(editingPost ? 'Failed to update post' : 'Failed to create post');
    }
  };

  const handleEditPost = (post) => {
    setFormData({ title: post.title, content: post.content, category: post.category });
    setEditingPost(post._id);
    setShowForm(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(postId)).unwrap();
        toast.success('Post deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleAddAnswer = async (postId) => {
    if (answerText.trim()) {
      try {
        await dispatch(addAnswer({ postId, content: answerText })).unwrap();
        toast.success('Answer posted!');
        setAnswerText('');
      } catch (error) {
        toast.error('Failed to post answer');
      }
    }
  };

  const handleUpvotePost = async (postId) => {
    try {
      await dispatch(upvotePost(postId)).unwrap();
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleUpvoteAnswer = async (postId, answerId) => {
    try {
      await dispatch(upvoteAnswer({ postId, answerId })).unwrap();
    } catch (error) {
      toast.error('Failed to upvote answer');
    }
  };

  const handleAcceptAnswer = async (postId, answerId) => {
    try {
      await dispatch(acceptAnswer({ postId, answerId })).unwrap();
      toast.success('Answer accepted!');
    } catch (error) {
      toast.error('Failed to accept answer');
    }
  };

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">Forum</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Ask questions & share knowledge</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-lg"
          >
            {showForm ? <X size={20} className="sm:w-6 sm:h-6" /> : <Plus size={20} className="sm:w-6 sm:h-6" />}
            {showForm ? 'Close' : 'New Post'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Total Posts</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Total Answers</p>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{posts.reduce((acc, p) => acc + (p.answers?.length || 0), 0)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Categories</p>
            <p className="text-2xl sm:text-3xl font-black text-pink-600">{categories.length - 1}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">My Posts</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{posts.filter(p => p.user?._id === user?._id).length}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 outline-none transition-all text-sm sm:text-base font-medium"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
                    filterCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-10 overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
                {editingPost ? <Edit size={20} className="sm:w-7 sm:h-7" /> : <Plus size={20} className="sm:w-7 sm:h-7" />}
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <MessageSquare size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                  Title *
                </label>
                <input 
                  type="text" 
                  placeholder="What's your question or topic?" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all text-base sm:text-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <Tag size={14} className="sm:w-4 sm:h-4 text-pink-600" />
                  Category *
                </label>
                <input 
                  type="text" 
                  placeholder="Programming, Design, Music, etc." 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all text-base sm:text-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-800 mb-2 sm:mb-3">Content *</label>
                <textarea 
                  placeholder="Describe your question or share your thoughts in detail..." 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all text-base sm:text-lg resize-none" 
                  rows="6" 
                  required
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  {editingPost ? <Edit size={20} className="sm:w-6 sm:h-6" /> : <Send size={20} className="sm:w-6 sm:h-6" />}
                  {editingPost ? 'Update' : 'Post'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingPost(null); setFormData({ title: '', content: '', category: '' }); }} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-300 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Forum Posts */}
        <div className="space-y-4 sm:space-y-5">
          {filteredPosts.map((post) => (
            <div key={post._id} className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    {post.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 break-words flex-1">{post.title}</h3>
                      {post.user?._id === user?._id && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                            title="Edit post"
                          >
                            <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete post"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-3 py-1.5 rounded-lg sm:rounded-xl font-bold">
                        <Tag size={12} className="sm:w-3.5 sm:h-3.5" />
                        {post.category}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold truncate">{post.user?.name}</span>
                      <span className="text-xs sm:text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 ml-0 sm:ml-16 break-words">{post.content}</p>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 ml-0 sm:ml-16 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleUpvotePost(post._id)}
                    className={`flex items-center gap-2 font-bold transition-all ${
                      post.upvotes?.includes(user?._id) 
                        ? 'text-pink-600 scale-110' 
                        : 'text-gray-600 hover:text-pink-600 hover:scale-110'
                    }`}
                  >
                    <Heart size={18} className={`sm:w-5 sm:h-5 ${post.upvotes?.includes(user?._id) ? 'fill-pink-600' : ''}`} />
                    <span className="text-sm sm:text-base">{post.upvotes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-bold transition-colors"
                  >
                    <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{post.answers?.length || 0} Answers</span>
                  </button>
                </div>

                {/* Answers Section */}
                {selectedPost === post._id && (
                  <div className="mt-4 sm:mt-6 ml-0 sm:ml-16 border-t border-gray-200 pt-4 sm:pt-6">
                    <h4 className="font-black text-base sm:text-lg mb-4 flex items-center gap-2">
                      <MessageSquare size={18} className="sm:w-5 sm:h-5 text-purple-600" />
                      Answers ({post.answers?.length || 0})
                    </h4>
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      {post.answers?.map((answer) => (
                        <div key={answer._id} className="bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-gray-200 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-black flex-shrink-0">
                                {answer.user?.name?.charAt(0).toUpperCase()}
                              </div>
                              <p className="font-bold text-sm sm:text-base text-gray-900">{answer.user?.name}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              {answer.isAccepted && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold">
                                  <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                  Accepted
                                </span>
                              )}
                              {post.user?._id === user?._id && !answer.isAccepted && (
                                <button 
                                  onClick={() => handleAcceptAnswer(post._id, answer._id)}
                                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-bold transition-all"
                                >
                                  Accept
                                </button>
                              )}
                              <button 
                                onClick={() => handleUpvoteAnswer(post._id, answer._id)}
                                className={`flex items-center gap-1 font-semibold transition-all ${
                                  answer.upvotes?.includes(user?._id) 
                                    ? 'text-pink-600 scale-110' 
                                    : 'text-gray-600 hover:text-pink-600 hover:scale-110'
                                }`}
                              >
                                <Heart size={14} className={`sm:w-4 sm:h-4 ${answer.upvotes?.includes(user?._id) ? 'fill-pink-600' : ''}`} />
                                <span className="text-xs sm:text-sm">{answer.upvotes?.length || 0}</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words">{answer.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input 
                        type="text" 
                        placeholder="Write your answer..." 
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
                      />
                      <button 
                        onClick={() => handleAddAnswer(post._id)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Send size={18} className="sm:w-5 sm:h-5" />
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MessageSquare size={32} className="sm:w-10 sm:h-10 text-gray-500" />
              </div>
              <p className="text-gray-500 text-lg sm:text-xl font-bold">No posts found</p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
