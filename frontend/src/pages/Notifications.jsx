import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationsSlice';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Calendar, Star, Send, CheckCheck, Clock, Trash2, Filter, Check, X } from 'lucide-react';

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [filterType, setFilterType] = useState('All');
  const [filterRead, setFilterRead] = useState('All');

  useEffect(() => {
    dispatch(fetchNotifications());
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await dispatch(deleteNotification(id)).unwrap();
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      request: <Send size={20} className="sm:w-6 sm:h-6 text-blue-600" />,
      session: <Calendar size={20} className="sm:w-6 sm:h-6 text-green-600" />,
      review: <Star size={20} className="sm:w-6 sm:h-6 text-yellow-600" />,
      message: <MessageSquare size={20} className="sm:w-6 sm:h-6 text-purple-600" />
    };
    return icons[type] || <Bell size={20} className="sm:w-6 sm:h-6 text-gray-600" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      request: 'from-blue-50 to-blue-100 border-blue-200',
      session: 'from-green-50 to-green-100 border-green-200',
      review: 'from-yellow-50 to-yellow-100 border-yellow-200',
      message: 'from-purple-50 to-purple-100 border-purple-200'
    };
    return colors[type] || 'from-gray-50 to-gray-100 border-gray-200';
  };

  const filteredNotifications = notifications?.filter(notif => {
    const matchesType = filterType === 'All' || notif.type === filterType.toLowerCase();
    const matchesRead = filterRead === 'All' || 
                       (filterRead === 'Unread' && !notif.read) || 
                       (filterRead === 'Read' && notif.read);
    return matchesType && matchesRead;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg relative">
              <Bell size={24} className="sm:w-7 sm:h-7 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">Notifications</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Stay updated with your activities</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCheck size={18} className="sm:w-5 sm:h-5" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Total</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{notifications?.length || 0}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Unread</p>
            <p className="text-2xl sm:text-3xl font-black text-red-600">{unreadCount}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Read</p>
            <p className="text-2xl sm:text-3xl font-black text-green-600">{(notifications?.length || 0) - unreadCount}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1 sm:mb-2">Today</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">
              {notifications?.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter size={18} className="text-gray-600 flex-shrink-0" />
              {['All', 'Request', 'Session', 'Review', 'Message'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
                    filterType === type
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['All', 'Unread', 'Read'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterRead(status)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
                    filterRead === status
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredNotifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`group bg-gradient-to-r ${getTypeColor(notif.type)} backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 shadow-md hover:shadow-xl transition-all overflow-hidden ${
                notif.read ? 'opacity-70' : 'border-l-4 sm:border-l-8'
              }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    {getTypeIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <h3 className="font-black text-base sm:text-xl text-gray-900 break-words">{notif.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold shadow-md">
                            <CheckCheck size={12} className="sm:w-3.5 sm:h-3.5" /> New
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-3 leading-relaxed break-words">{notif.message}</p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium">{new Date(notif.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {notif.link && (
                          <Link 
                            to={notif.link} 
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                          >
                            View
                            <Send size={14} className="sm:w-4 sm:h-4" />
                          </Link>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif._id)}
                            className="p-2 sm:p-2.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif._id)}
                          className="p-2 sm:p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm p-12 sm:p-16 rounded-2xl sm:rounded-3xl shadow-xl text-center border-2 border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Bell size={32} className="sm:w-10 sm:h-10 text-gray-500" />
              </div>
              <p className="text-gray-500 text-lg sm:text-xl font-bold">No notifications found</p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
