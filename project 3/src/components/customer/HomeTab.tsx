import { ArrowUpRight, Send, Smartphone, Building2, Clock, ShoppingBag, Utensils, Wallet, Film, CreditCard, PlusCircle, ArrowRightCircle, TrendingUp } from 'lucide-react';
import { currentUser, mockTransactions, spendingData } from '../../data/mockData';
import { useCountUp } from '../../hooks/useCountUp';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HomeTab() {
  const balance = useCountUp(currentUser.balance, 1500);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const recentTransactions = mockTransactions
    .filter(t => t.status !== 'blocked')
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {getTimeGreeting()}, {currentUser.name.split(' ')[0]}
        </h2>
      </div>

      <div className="relative glass-card p-8 glass-glow-blue">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-2">Available Balance</p>
          <h1 className="text-5xl font-bold text-white mb-6">
            ₹{balance.toLocaleString('en-IN')}.00
          </h1>

          <div className="flex gap-4">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add Money
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/20 flex items-center justify-center gap-2">
              <ArrowRightCircle className="w-5 h-5" />
              Send Money
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <button className="glass-card-hover p-4 group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors group-hover:shadow-lg group-hover:shadow-blue-500/20">
            <Send className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-gray-300">Send</p>
        </button>

        <button className="glass-card-hover p-4 group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors group-hover:shadow-lg group-hover:shadow-purple-500/20">
            <Smartphone className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-gray-300">UPI</p>
        </button>

        <button className="glass-card-hover p-4 group">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors group-hover:shadow-lg group-hover:shadow-green-500/20">
            <Building2 className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-sm text-gray-300">Transfer</p>
        </button>

        <button className="glass-card-hover p-4 group">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-500/30 transition-colors group-hover:shadow-lg group-hover:shadow-orange-500/20">
            <Clock className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-sm text-gray-300">History</p>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Recent Transactions
          </h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((txn) => {
            const getCategoryIcon = () => {
              switch(txn.merchantCategory) {
                case 'Shopping': return <ShoppingBag className="w-6 h-6 text-pink-400" />;
                case 'Food & Dining': return <Utensils className="w-6 h-6 text-orange-400" />;
                case 'Income': return <Wallet className="w-6 h-6 text-green-400" />;
                case 'Entertainment': return <Film className="w-6 h-6 text-purple-400" />;
                default: return <CreditCard className="w-6 h-6 text-blue-400" />;
              }
            };
            return (
            <div key={txn.id} className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  {getCategoryIcon()}
                </div>

                <div>
                  <p className="font-medium text-white">{txn.merchant}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{txn.merchantCategory}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                      {txn.paymentMethod === 'card' && `•••• ${txn.cardDetails?.last4}`}
                      {txn.paymentMethod === 'upi' && txn.upiDetails?.upiId}
                      {txn.paymentMethod === 'bankTransfer' && `${txn.bankTransferDetails?.bankName} ${txn.bankTransferDetails?.transferType}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${txn.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <div className={`w-2 h-2 rounded-full ${txn.status === 'completed' ? 'bg-green-500' : txn.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-400 capitalize">{txn.status}</span>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Spending This Week</h3>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={spendingData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
