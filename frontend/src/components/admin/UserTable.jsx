import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Users, Shield, Edit, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import { updateUser, deleteUser } from '../../store/slices/adminSlice';

export default function UserTable({ users }) {
  const dispatch = useDispatch();
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', isVerified: false });

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });
  };

  const handleUpdate = async (userId) => {
    try {
      await dispatch(updateUser({ userId, userData: formData })).unwrap();
      toast.success('User updated successfully');
      setEditingUser(null);
    } catch (err) {
      toast.error(err || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete user');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Users size={32} />
          User Management
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6 font-black text-gray-700">User</th>
              <th className="text-left p-6 font-black text-gray-700">Email</th>
              <th className="text-left p-6 font-black text-gray-700">Role</th>
              <th className="text-left p-6 font-black text-gray-700">Status</th>
              <th className="text-left p-6 font-black text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="p-6">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                  )}
                </td>
                <td className="p-6">
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">{user.email}</span>
                  )}
                </td>
                <td className="p-6">
                  {editingUser === user._id ? (
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-md ${
                      user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    }`}>
                      <Shield size={14} />
                      {user.role || 'user'}
                    </span>
                  )}
                </td>
                <td className="p-6">
                  {editingUser === user._id ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVerified}
                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Verified</span>
                    </label>
                  ) : (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  )}
                </td>
                <td className="p-6">
                  {editingUser === user._id ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdate(user._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingUser(null)}
                        className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-16">
            <Users size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-bold">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
