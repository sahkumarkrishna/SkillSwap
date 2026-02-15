import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function RecentSessions({ sessions }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Calendar size={28} />
          Recent Sessions
        </h2>
      </div>
      <div className="p-6">
        {sessions.slice(0, 5).map((session) => (
          <div key={session._id} className="flex items-center gap-4 border-b border-gray-200 py-4 last:border-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{session.swapRequest?.skillWanted?.title || 'Session'}</p>
              <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              session.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
              session.status === 'Completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {session.status}
            </span>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-center text-gray-500 py-8">No sessions yet</p>
        )}
        <Link to="/sessions" className="block text-center mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
          View All Sessions
        </Link>
      </div>
    </div>
  );
}
