import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchMessages, sendMessage } from '../store/slices/messagesSlice';
import { fetchSwapRequests } from '../store/slices/swapsSlice';
import { Send, Paperclip, Search, MoreVertical, Phone, Video, Smile, ArrowLeft, Image, File, X, MessageCircle, Users, Clock } from 'lucide-react';

export default function Chat() {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  const { swaps } = useSelector((state) => state.swaps);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSwapRequests());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSwap) {
      dispatch(fetchMessages(selectedSwap._id));
    }
  }, [selectedSwap, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((messageText.trim() || selectedFile) && selectedSwap) {
      try {
        const formData = new FormData();
        formData.append('swapRequest', selectedSwap._id);
        formData.append('content', messageText);
        if (selectedFile) formData.append('file', selectedFile);
        
        await dispatch(sendMessage(formData)).unwrap();
        setMessageText('');
        setSelectedFile(null);
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSelectSwap = (swap) => {
    setSelectedSwap(swap);
    setShowSidebar(false);
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelectedSwap(null);
  };

  const filteredSwaps = swaps?.filter(swap => {
    const otherUser = swap.requester?._id === user?._id ? swap.mentor : swap.requester;
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           swap.skillWanted?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const acceptedSwaps = filteredSwaps?.filter(s => s.status === 'Accepted') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-96 bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-2xl flex-col relative z-10`}>
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <MessageCircle size={24} className="md:w-7 md:h-7" />
              Messages
            </h2>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <p className="text-xs font-bold text-white">{acceptedSwaps.length} Active</p>
            </div>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-white outline-none text-sm font-medium"
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {acceptedSwaps.length > 0 ? (
            acceptedSwaps.map((swap) => {
              const otherUser = swap.requester?._id === user?._id ? swap.mentor : swap.requester;
              const lastMessage = messages.filter(m => m.swapRequest === swap._id).slice(-1)[0];
              
              return (
                <div 
                  key={swap._id}
                  onClick={() => handleSelectSwap(swap)}
                  className={`p-4 md:p-5 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group ${
                    selectedSwap?._id === swap._id ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md group-hover:scale-110 transition-transform">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-gray-900 truncate text-base md:text-lg">{otherUser?.name}</p>
                        {lastMessage && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-blue-600 font-semibold truncate mb-1">{swap.skillWanted?.title}</p>
                      {lastMessage && (
                        <p className="text-xs text-gray-600 truncate">
                          {lastMessage.sender === user._id ? 'You: ' : ''}{lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 md:p-12 text-center text-gray-500">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="md:w-8 md:h-8 text-blue-600" />
              </div>
              <p className="font-bold text-base md:text-lg text-gray-900 mb-2">No active chats</p>
              <p className="text-xs md:text-sm text-gray-600">Accept swap requests to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showSidebar || selectedSwap ? 'flex' : 'hidden'} md:flex flex-1 flex-col relative z-10`}>
        {selectedSwap ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 p-4 md:p-5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={handleBackToList}
                  className="md:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
                >
                  <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-base md:text-lg shadow-md">
                    {(selectedSwap.requester?._id === user?._id ? selectedSwap.mentor?.name : selectedSwap.requester?.name)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900">
                    {selectedSwap.requester?._id === user?._id ? selectedSwap.mentor?.name : selectedSwap.requester?.name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {isTyping ? 'Typing...' : 'Active now'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                  <Phone size={16} className="md:w-5 md:h-5 text-blue-700" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                  <Video size={16} className="md:w-5 md:h-5 text-purple-700" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all">
                  <MoreVertical size={16} className="md:w-5 md:h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
              {messages.filter(m => m.swapRequest === selectedSwap._id).length > 0 ? (
                messages.filter(m => m.swapRequest === selectedSwap._id).map((msg, index) => {
                  const isOwn = msg.sender === user._id;
                  const showAvatar = index === 0 || messages[index - 1]?.sender !== msg.sender;
                  
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {!isOwn && showAvatar && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {(selectedSwap.requester?._id === user?._id ? selectedSwap.mentor?.name : selectedSwap.requester?.name)?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {!isOwn && !showAvatar && <div className="w-8"></div>}
                      
                      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${
                        isOwn 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl rounded-br-md' 
                          : 'bg-white text-gray-800 rounded-3xl rounded-bl-md border border-gray-200'
                      } p-3 md:p-4 shadow-md hover:shadow-lg transition-all`}>
                        <p className="text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                        {msg.fileUrl && (
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`flex items-center gap-2 text-xs md:text-sm mt-2 md:mt-3 p-2 rounded-lg transition-all ${
                              isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <File size={14} className="md:w-4 md:h-4" />
                            <span className="truncate">Attachment</span>
                          </a>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            isOwn ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={32} className="md:w-10 md:h-10 text-blue-600" />
                    </div>
                    <p className="text-lg md:text-xl font-black text-gray-900 mb-2">No messages yet</p>
                    <p className="text-sm md:text-base text-gray-600">Start the conversation!</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="bg-blue-50 border-t border-blue-200 p-3 md:p-4">
                <div className="flex items-center justify-between bg-white rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {selectedFile.type.startsWith('image/') ? <Image size={20} className="text-blue-600" /> : <File size={20} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all">
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSend} className="bg-white/90 backdrop-blur-xl border-t border-gray-200 p-3 md:p-5 shadow-lg">
              <div className="flex items-end gap-2 md:gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-xl flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                >
                  <Paperclip size={16} className="md:w-5 md:h-5 text-blue-700" />
                </button>
                <div className="flex-1 bg-gray-100 rounded-2xl p-2 md:p-3">
                  <textarea 
                    value={messageText} 
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    }}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Type your message..." 
                    className="w-full bg-transparent border-0 focus:ring-0 outline-none text-sm md:text-base resize-none"
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!messageText.trim() && !selectedFile}
                  className="px-4 py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl font-bold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base flex-shrink-0"
                >
                  <Send size={16} className="md:w-5 md:h-5" />
                  <span className="hidden md:inline">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <MessageCircle size={32} className="md:w-12 md:h-12 text-blue-600" />
              </div>
              <p className="text-xl md:text-2xl font-black text-gray-900 mb-2">Select a conversation</p>
              <p className="text-sm md:text-base text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
