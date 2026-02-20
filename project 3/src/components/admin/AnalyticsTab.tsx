import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockTransactions, fraudLogs } from '../../data/mockData';
import { TrendingUp, Target, Clock, DollarSign, ShieldCheck, AlertTriangle, BarChart3, Activity, PieChart } from 'lucide-react';

export default function AnalyticsTab() {
  const paymentMethodFraudRate = [
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
      method: 'Bank Transfer',
      total: mockTransactions.filter(t => t.paymentMethod === 'bankTransfer').length,
      flagged: mockTransactions.filter(t => t.paymentMethod === 'bankTransfer' && t.isFlagged).length
    }
  ];

  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
    const txnsInHour = mockTransactions.filter(t => {
      const txnHour = new Date(t.timestamp).getHours();
      return txnHour === hour;
    }).length;

    return {
      hour: `${hour}:00`,
      transactions: txnsInHour,
      isUnusual: hour < 5 || hour > 23
    };
  });

  const allRiskReasons = fraudLogs.flatMap(log => log.riskReasons);
  const reasonCounts: { [key: string]: number } = {};
  allRiskReasons.forEach(reason => {
    const key = reason.slice(0, 40);
    reasonCounts[key] = (reasonCounts[key] || 0) + 1;
  });

  const topRiskReasons = Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const fraudTrend = [
    { day: 'Mon', total: 1450, flagged: 42, blocked: 8 },
    { day: 'Tue', total: 1680, flagged: 38, blocked: 6 },
    { day: 'Wed', total: 1920, flagged: 55, blocked: 12 },
    { day: 'Thu', total: 1750, flagged: 48, blocked: 9 },
    { day: 'Fri', total: 2100, flagged: 72, blocked: 15 },
    { day: 'Sat', total: 1880, flagged: 51, blocked: 10 },
    { day: 'Sun', total: 1420, flagged: 35, blocked: 7 }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-purple-400" />
        Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Fraud Rate by Payment Method
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodFraudRate}>
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
              <Bar dataKey="total" fill="#3B82F6" name="Total Transactions" radius={[8, 8, 0, 0]} />
              <Bar dataKey="flagged" fill="#EF4444" name="Flagged" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {paymentMethodFraudRate.map((item) => (
              <div key={item.method} className="glass rounded-xl p-3">
                <p className="text-sm text-gray-400">{item.method}</p>
                <p className="text-2xl font-bold text-white">
                  {item.total > 0 ? ((item.flagged / item.total) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">fraud rate</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Fraud Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudTrend}>
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
              <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="flagged" stroke="#F59E0B" strokeWidth={2} name="Flagged" />
              <Line type="monotone" dataKey="blocked" stroke="#EF4444" strokeWidth={2} name="Blocked" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-3">
              <p className="text-sm text-gray-400">Avg Daily Txns</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(fraudTrend.reduce((sum, d) => sum + d.total, 0) / fraudTrend.length)}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-sm text-gray-400">Avg Flagged</p>
              <p className="text-2xl font-bold text-orange-400">
                {Math.round(fraudTrend.reduce((sum, d) => sum + d.flagged, 0) / fraudTrend.length)}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-sm text-gray-400">Avg Blocked</p>
              <p className="text-2xl font-bold text-red-400">
                {Math.round(fraudTrend.reduce((sum, d) => sum + d.blocked, 0) / fraudTrend.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          Hourly Transaction Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyDistribution}>
            <XAxis dataKey="hour" stroke="#6B7280" tick={{ fontSize: 10 }} />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="transactions" radius={[4, 4, 0, 0]}>
              {hourlyDistribution.map((entry, index) => (
                <Bar
                  key={index}
                  fill={entry.isUnusual ? '#F97316' : '#3B82F6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-400">Normal Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-400">Unusual Hours (12AM-5AM)</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Top Risk Reasons
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topRiskReasons} layout="horizontal">
            <XAxis type="number" stroke="#6B7280" />
            <YAxis type="category" dataKey="reason" width={300} stroke="#6B7280" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" fill="#8B5CF6" name="Occurrences" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 glass-glow-green">
          <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Detection Accuracy
          </h4>
          <p className="text-3xl font-bold text-white mb-1">94.2%</p>
          <p className="text-xs text-green-400">+2.1% from last week</p>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            False Positive Rate
          </h4>
          <p className="text-3xl font-bold text-white mb-1">5.8%</p>
          <p className="text-xs text-green-400">-0.4% from last week</p>
        </div>

        <div className="glass-card p-6 glass-glow-blue">
          <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Avg Response Time
          </h4>
          <p className="text-3xl font-bold text-white mb-1">24ms</p>
          <p className="text-xs text-green-400">-3ms from last week</p>
        </div>

        <div className="glass-card p-6 glass-glow-purple">
          <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Blocked Losses
          </h4>
          <p className="text-3xl font-bold text-white mb-1">₹2.4M</p>
          <p className="text-xs text-green-400">+₹0.3M from last week</p>
        </div>
      </div>
    </div>
  );
}
