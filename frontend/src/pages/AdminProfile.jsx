import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, loadUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { User, Mail, Shield, Edit2, Save, X, Calendar, Phone, Building, RefreshCw, Camera, Upload, Image } from 'lucide-react';

export default function AdminProfile() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    permissions: [],
    profilePicture: ''
  });
  const [originalData, setOriginalData] = useState({});

  const predefinedAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
  ];

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || 'Administration',
        permissions: user.permissions || ['read', 'write', 'delete'],
        profilePicture: user.profilePicture || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await dispatch(loadUser()).unwrap();
      toast.success('Profile refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'skillswap_profiles');
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dshwzxrf7/image/upload`, {
        method: 'POST',
        body: uploadData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, profilePicture: data.secure_url }));
        toast.success('Profile picture uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setShowAvatarModal(false);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({ ...prev, profilePicture: avatarUrl }));
    setShowAvatarModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Admin profile updated successfully!');
      setIsEditing(false);
      setOriginalData(formData);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (permission) => {
    if (!isEditing) return;
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
              Admin Profile
            </h1>
            <p className="text-gray-600 font-medium mt-1">Manage your administrator account</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black">{user?.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-1 -right-1 bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-gray-50"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{user?.name}</h2>
                  <p className="text-red-100">System Administrator</p>
                  <p className="text-red-200 text-sm">{user?.department || 'Administration'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
                >
                  {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-red-600" />
                  Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 appearance-none"
                    >
                      <option value="Administration">Administration</option>
                      <option value="IT">IT Department</option>
                      <option value="Support">Support</option>
                      <option value="Management">Management</option>
                      <option value="Security">Security</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                      {formData.profilePicture ? (
                        <img src={formData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <Image size={16} />
                        Select Picture
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield size={20} className="text-red-600" />
                  Administrator Details
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['read', 'write', 'delete', 'manage_users', 'system_config', 'reports'].map((permission) => (
                      <button
                        key={permission}
                        type="button"
                        onClick={() => handlePermissionToggle(permission)}
                        disabled={!isEditing}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                          formData.permissions.includes(permission)
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                        } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {permission.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">Click to toggle permissions</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Created</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl">
                    <Shield size={16} className="text-red-600" />
                    <span className="text-red-800 font-bold">System Administrator</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-medium shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Profile Picture</h3>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Upload Option */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Upload size={20} />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Custom Image'}
                </button>
              </div>
              
              {/* Predefined Avatars */}
              <div className="grid grid-cols-3 gap-3">
                {predefinedAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className="w-full aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-red-500 transition-all"
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}