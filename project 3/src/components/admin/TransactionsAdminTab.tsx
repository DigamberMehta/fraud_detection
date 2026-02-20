import { useState } from 'react';
import { mockTransactions } from '../../data/mockData';
import { FileText, Filter, CreditCard, Smartphone, Landmark, AlertTriangle, Flag, CheckCircle } from 'lucide-react';

type RiskFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
type MethodFilter = 'all' | 'card' | 'upi' | 'bankTransfer';

export default function TransactionsAdminTab() {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filteredTransactions = mockTransactions.filter(txn => {
    if (riskFilter !== 'all' && txn.riskLevel !== riskFilter) return false;
    if (methodFilter !== 'all' && txn.paymentMethod !== methodFilter) return false;
    if (flaggedOnly && !txn.isFlagged) return false;
    return true;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <FileText className="w-8 h-8 text-purple-400" />
        All Transactions
      </h2>

      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Level
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as MethodFilter)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="all">All</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bankTransfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flaggedOnly}
                onChange={(e) => setFlaggedOnly(e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-white/5"
              />
              <Flag className="w-4 h-4 text-red-400" />
              <span className="text-white">Flagged Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="glass-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-sm font-medium text-gray-400 p-4">Transaction ID</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">User</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Merchant</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Amount</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Method</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Risk Score</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Risk Level</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-400 p-4">Flagged</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    txn.riskLevel === 'critical' ? 'pulse-red' : ''
                  }`}
                >
                  <td className="p-4">
                    <p className="text-white font-mono text-sm">{txn.referenceId}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{txn.userId}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{txn.merchant}</p>
                    <p className="text-xs text-gray-400">{txn.merchantCategory}</p>
                  </td>
                  <td className="p-4">
                    <p className={`font-medium ${txn.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-white capitalize">{txn.paymentMethod}</p>
                    {txn.paymentMethod === 'card' && (
                      <p className="text-xs text-gray-400">•••• {txn.cardDetails?.last4}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="w-24">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            txn.riskScore >= 75 ? 'bg-red-500' :
                            txn.riskScore >= 50 ? 'bg-orange-500' :
                            txn.riskScore >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${txn.riskScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{txn.riskScore}/100</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(txn.riskLevel)}`}>
                      {txn.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      txn.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      txn.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {txn.isFlagged ? (
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                    ) : (
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-gray-400">
        Showing {filteredTransactions.length} of {mockTransactions.length} transactions
      </div>
    </div>
  );
}
