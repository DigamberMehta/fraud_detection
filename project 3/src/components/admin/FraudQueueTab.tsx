import { useState } from 'react';
import { X, Lock, Unlock, AlertTriangle, ShieldAlert, CheckCircle, XCircle, Eye, Flag, Search } from 'lucide-react';
import { fraudLogs, mockTransactions, allUsers } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type FilterStatus = 'all' | 'flagged' | 'under_review' | 'confirmed_fraud' | 'false_positive' | 'resolved';

export default function FraudQueueTab() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredLogs = fraudLogs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'under_review') return log.status === 'flagged';
    return log.status === filter;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const RadialGauge = ({ score }: { score: number }) => {
    const radius = 60;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = () => {
      if (score >= 75) return '#EF4444';
      if (score >= 50) return '#F97316';
      if (score >= 25) return '#F59E0B';
      return '#10B981';
    };

    return (
      <svg width={radius * 2} height={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-3xl font-bold fill-white"
        >
          {score}
        </text>
      </svg>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-red-400" />
        Fraud Queue
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { id: 'all' as FilterStatus, label: 'All', icon: Eye },
          { id: 'flagged' as FilterStatus, label: 'Flagged', icon: Flag },
          { id: 'under_review' as FilterStatus, label: 'Under Review', icon: Search },
          { id: 'confirmed_fraud' as FilterStatus, label: 'Confirmed Fraud', icon: XCircle },
          { id: 'false_positive' as FilterStatus, label: 'False Positive', icon: CheckCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-sm font-medium text-gray-400 p-4">User</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Merchant</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Amount</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Risk Score</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Risk Level</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Reasons</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const txn = mockTransactions.find(t => t.id === log.transactionId);
                const user = allUsers.find(u => u.id === log.userId);
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      log.riskLevel === 'critical' ? 'pulse-red' : ''
                    }`}
                  >
                    <td className="p-4">
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{txn?.merchant}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">₹{txn?.amount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="p-4">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            log.riskScore >= 75 ? 'bg-red-500' :
                            log.riskScore >= 50 ? 'bg-orange-500' :
                            log.riskScore >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${log.riskScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{log.riskScore}/100</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {log.riskReasons.slice(0, 2).map((reason, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            {reason.slice(0, 30)}...
                          </span>
                        ))}
                        {log.riskReasons.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                            +{log.riskReasons.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400 capitalize">{log.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex">
          <div className="ml-auto w-full md:w-[600px] glass-modal rounded-none md:rounded-l-3xl overflow-y-auto">
            <div className="sticky top-0 bg-[#12121A]/90 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-white">Investigation Panel</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-6 p-6 glass rounded-2xl">
                <RadialGauge score={selectedLog.riskScore} />
                <div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(selectedLog.riskLevel)}`}>
                    {selectedLog.riskLevel.toUpperCase()}
                  </span>
                  <p className="text-2xl font-bold text-white mt-2">{selectedLog.fraudProbability}%</p>
                  <p className="text-sm text-gray-400">Fraud Probability</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">User Information</h4>
                  {allUsers.find(u => u.id === selectedLog.userId)?.isLocked ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Locked</span>
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/50">
                      <Unlock className="w-4 h-4" />
                      <span className="text-sm font-medium">Active</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(() => {
                    const user = allUsers.find(u => u.id === selectedLog.userId);
                    return (
                      <>
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-white font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-medium">{user?.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-400">Balance</p>
                            <p className="text-white font-medium">₹{user?.balance.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Account Age</p>
                            <p className="text-white font-medium">{user?.accountAgeDays} days</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Transaction Details</h4>
                <div className="space-y-3">
                  {(() => {
                    const txn = mockTransactions.find(t => t.id === selectedLog.transactionId);
                    return (
                      <>
                        <div>
                          <p className="text-sm text-gray-400">Amount</p>
                          <p className="text-2xl font-bold text-white">₹{txn?.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Payment Method</p>
                          <p className="text-white font-medium capitalize">{txn?.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white font-medium">{txn?.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Channel</p>
                          <p className="text-white font-medium capitalize">{selectedLog.fraudSignals.paymentChannel}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Fraud Signals</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedLog.fraudSignals).slice(0, 8).map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-xl ${value === true ? 'bg-red-500/20' : 'bg-white/5'}`}>
                      <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className={`font-medium ${value === true ? 'text-red-400' : 'text-gray-300'}`}>
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Signal Scores</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(selectedLog.detailedScores).map(([key, value]) => ({
                      name: key.replace(/([A-Z])/g, ' $1').replace('Score', ''),
                      score: value
                    }))}
                    layout="vertical"
                  >
                    <XAxis type="number" domain={[0, 100]} stroke="#6B7280" />
                    <YAxis type="category" dataKey="name" width={150} stroke="#6B7280" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="score" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Risk Reasons</h4>
                <div className="space-y-2">
                  {selectedLog.riskReasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <span className="text-red-400 mt-0.5">⚠️</span>
                      <p className="text-red-400 text-sm">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLog.triggeredCombinations?.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Triggered Combinations</h4>
                  <div className="space-y-2">
                    {selectedLog.triggeredCombinations.map((combo: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                        <span className="text-purple-400 mt-0.5">⚡</span>
                        <p className="text-purple-400 text-sm">{combo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Review & Action</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                      <option>Flagged</option>
                      <option>Under Review</option>
                      <option>Confirmed Fraud</option>
                      <option>False Positive</option>
                      <option>Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Investigation Notes</label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your investigation notes..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl font-medium transition-colors">
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
