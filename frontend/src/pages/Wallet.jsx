import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet } from '../store/slices/walletSlice';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Gift, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles, Filter, Calendar, CreditCard, PieChart } from 'lucide-react';

export default function Wallet() {
  const dispatch = useDispatch();
  const { credits, transactions, loading } = useSelector((state) => state.wallet);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const getTransactionIcon = (type) => { 
    const icons = {
      earned: <TrendingUp size={20} className="sm:w-6 sm:h-6 text-green-600" />,
      spent: <TrendingDown size={20} className="sm:w-6 sm:h-6 text-red-600" />,
      bonus: <Gift size={20} className="sm:w-6 sm:h-6 text-purple-600" />
    };
    return icons[type] || <DollarSign size={20} className="sm:w-6 sm:h-6 text-gray-600" />;
  };

  const filteredTransactions = filterType === 'All' 
    ? transactions 
    : transactions?.filter(tx => tx.type === filterType.toLowerCase());

  const totalEarned = transactions?.filter(tx => tx.type === 'earned' || tx.type === 'bonus').reduce((sum, tx) => sum + tx.amount, 0) || 0;
  const totalSpent = transactions?.filter(tx => tx.type === 'spent').reduce((sum, tx) => sum + tx.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <WalletIcon size={24} className="sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent">My Wallet</h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">Manage your credits and transactions</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Sparkles size={20} className="sm:w-6 sm:h-6" />
              <h2 className="text-base sm:text-xl font-bold opacity-90">Available Credits</h2>
            </div>
            <p className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 sm:mb-8">{credits || 50}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm font-semibold opacity-90">Total Earned</p>
                </div>
                <p className="text-xl sm:text-2xl font-black">{totalEarned} credits</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight size={16} className="sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm font-semibold opacity-90">Total Spent</p>
                </div>
                <p className="text-xl sm:text-2xl font-black">{totalSpent} credits</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gift size={16} className="sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm font-semibold opacity-90">Transactions</p>
                </div>
                <p className="text-xl sm:text-2xl font-black">{transactions?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Balance</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{credits || 50}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-green-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Earned</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-green-600">{totalEarned}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="sm:w-5 sm:h-5 text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Spent</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-red-600">{totalSpent}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <PieChart size={16} className="sm:w-5 sm:h-5 text-purple-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-600">Net</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{totalEarned - totalSpent}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
            <Filter size={18} className="text-gray-600 flex-shrink-0" />
            {['All', 'Earned', 'Spent', 'Bonus'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-base ${
                  filterType === type
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
              <DollarSign size={24} className="sm:w-7 sm:h-7" />
              Transaction History
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {filteredTransactions?.map((tx, i) => (
                <div key={i} className="group bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 hover:border-blue-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base sm:text-lg text-gray-900 truncate">{tx.description || `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} Transaction`}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium mt-1">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span className="truncate">{new Date(tx.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-2xl sm:text-3xl font-black ${
                        tx.type === 'earned' || tx.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'earned' || tx.type === 'bonus' ? '+' : '-'}{tx.amount}
                      </span>
                      <p className="text-xs text-gray-500 font-semibold mt-1">credits</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!filteredTransactions || filteredTransactions.length === 0) && (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <DollarSign size={32} className="sm:w-10 sm:h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-lg sm:text-xl font-bold">No transactions found</p>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
