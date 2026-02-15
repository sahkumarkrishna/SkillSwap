import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <TrendingUp size={28} />
          Recent Transactions
        </h2>
      </div>
      <div className="p-6">
        {transactions?.slice(0, 5).map((tx, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-200 py-4 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === 'earned' || tx.type === 'bonus' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {tx.type === 'earned' || tx.type === 'bonus' ? (
                  <TrendingUp size={20} className="text-green-600" />
                ) : (
                  <TrendingUp size={20} className="text-red-600 rotate-180" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{tx.description || 'Transaction'}</p>
                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <span className={`text-xl font-black ${
              tx.type === 'earned' || tx.type === 'bonus' ? 'text-green-600' : 'text-red-600'
            }`}>
              {tx.type === 'earned' || tx.type === 'bonus' ? '+' : '-'}{tx.amount}
            </span>
          </div>
        ))}
        {(!transactions || transactions.length === 0) && (
          <p className="text-center text-gray-500 py-8">No transactions yet</p>
        )}
        <Link to="/wallet" className="block text-center mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
          View All Transactions
        </Link>
      </div>
    </div>
  );
}
