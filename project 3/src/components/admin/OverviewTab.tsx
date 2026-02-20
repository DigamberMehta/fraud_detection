import { useCountUp } from '../../hooks/useCountUp';
import { mockTransactions, fraudLogs, fraudTrendData } from '../../data/mockData';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Shield, XCircle, CheckCircle, TrendingUp, Percent, Activity, Eye, Clock } from 'lucide-react';

export default function OverviewTab() {
  const totalTxns = mockTransactions.length;
  const flaggedTxns = mockTransactions.filter(t => t.isFlagged).length;
  const criticalTxns = mockTransactions.filter(t => t.riskLevel === 'critical').length;
  const blockedTxns = mockTransactions.filter(t => t.status === 'blocked').length;
  const confirmedFraud = fraudLogs.filter(f => f.status === 'confirmed_fraud').length;
  const flaggedRate = ((flaggedTxns / totalTxns) * 100).toFixed(1);

  const totalCount = useCountUp(totalTxns, 1000);
  const flaggedCount = useCountUp(flaggedTxns, 1200);
  const criticalCount = useCountUp(criticalTxns, 1400);
  const blockedCount = useCountUp(blockedTxns, 1600);

  const riskLevelData = [
    { name: 'Low', value: mockTransactions.filter(t => t.riskLevel === 'low').length, color: '#10B981' },
    { name: 'Medium', value: mockTransactions.filter(t => t.riskLevel === 'medium').length, color: '#F59E0B' },
    { name: 'High', value: mockTransactions.filter(t => t.riskLevel === 'high').length, color: '#F97316' },
    { name: 'Critical', value: mockTransactions.filter(t => t.riskLevel === 'critical').length, color: '#EF4444' }
  ];

  const paymentMethodData = [
    {
      method: 'Card',
      total: mockTransactions.filter(t => t.paymentMethod === 'card').length,
      flagged: mockTransactions.filter(t => t.paymentMethod === 'card' && t.isFlagged).length
    },
    {
      method: 'UPI',
      total: mockTransactions.filter(t => t.paymentMethod === 'upi').length,
      flagged: mockTransactions.filter(t => t.paymentMethod === 'upi' && t.isFlagged).length
    },
    {
      method: 'Bank',
      total: mockTransactions.filter(t => t.paymentMethod === 'bankTransfer').length,
      flagged: mockTransactions.filter(t => t.paymentMethod === 'bankTransfer' && t.isFlagged).length
    }
  ];

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <Activity className="w-8 h-8 text-blue-400" />
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalCount}</p>
          <p className="text-sm text-gray-400">Total Transactions</p>
        </div>

        <div className="glass-card p-6 border-orange-500/50 glass-glow-orange">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-400 mb-1">{flaggedCount}</p>
          <p className="text-sm text-gray-400">Flagged</p>
        </div>

        <div className="glass-card p-6 border-red-500/50 pulse-red glass-glow-red">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400 mb-1">{criticalCount}</p>
          <p className="text-sm text-gray-400">Critical</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{blockedCount}</p>
          <p className="text-sm text-gray-400">Blocked</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{confirmedFraud}</p>
          <p className="text-sm text-gray-400">Confirmed Fraud</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{flaggedRate}%</p>
          <p className="text-sm text-gray-400">Flagged Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Fraud by Risk Level
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskLevelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {riskLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {riskLevelData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Transaction Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={fraudTrendData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
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
              <Legend />
              <Area type="monotone" dataKey="total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="flagged" stroke="#EF4444" fillOpacity={1} fill="url(#colorFlagged)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Fraud by Payment Method
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentMethodData}>
              <XAxis dataKey="method" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="flagged" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          Live Fraud Feed
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-sm font-medium text-gray-400 pb-3">User</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Amount</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Risk Level</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Top Reason</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Action</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {fraudLogs.slice(0, 5).map((log) => {
                const txn = mockTransactions.find(t => t.id === log.transactionId);
                return (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <p className="text-white font-medium">{txn?.userId}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">₹{txn?.amount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                        log.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        log.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-400 text-sm max-w-xs truncate">{log.riskReasons[0]}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-400 text-sm">{log.actionTaken}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-400 text-sm">{getTimeAgo(log.timestamp)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
