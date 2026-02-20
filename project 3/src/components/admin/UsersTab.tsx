import { useState } from 'react';
import { Lock, Unlock, Plus, Users, Store, Search, UserPlus, DollarSign } from 'lucide-react';
import { allUsers, merchants } from '../../data/mockData';

type ViewTab = 'users' | 'merchants';

export default function UsersTab() {
  const [view, setView] = useState<ViewTab>('users');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <Users className="w-8 h-8 text-purple-400" />
        User & Merchant Management
      </h2>

      <div className="flex gap-3">
        <button
          onClick={() => setView('users')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            view === 'users'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
        <button
          onClick={() => setView('merchants')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            view === 'merchants'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Store className="w-4 h-4" />
          Merchants
        </button>
      </div>

      {view === 'users' && (
        <div className="glass-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Name</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Email</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Balance</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Total Txns</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Avg Txn</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Age (days)</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      user.isLocked ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{user.avatar}</span>
                        </div>
                        <p className="text-white font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">₹{user.balance.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{user.totalTransactions}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">₹{user.averageTransactionAmount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{user.accountAgeDays}</p>
                    </td>
                    <td className="p-4">
                      {user.isLocked ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 flex items-center gap-1 w-fit">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1 w-fit">
                          <Unlock className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                          {user.isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {user.isLocked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                          onClick={() => setShowCreditModal(true)}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center gap-1"
                        >
                          <DollarSign className="w-3 h-3" />
                          Credit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'merchants' && (
        <div className="glass-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Name</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Category</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Risk Score</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Fraud Reports</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{merchant.name}</p>
                          {merchant.isHighRisk && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">High Risk</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400">{merchant.category}</p>
                    </td>
                    <td className="p-4">
                      <div className="w-32">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              merchant.riskScore >= 75 ? 'bg-red-500' :
                              merchant.riskScore >= 50 ? 'bg-orange-500' :
                              merchant.riskScore >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${merchant.riskScore}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{merchant.riskScore}/100</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className={`font-medium ${merchant.fraudReports > 20 ? 'text-red-400' : 'text-white'}`}>
                        {merchant.fraudReports}
                      </p>
                    </td>
                    <td className="p-4">
                      {merchant.isActive ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                          Update Risk
                        </button>
                        <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                          {merchant.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Credit Balance</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="text"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="₹ 0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Reason</label>
                <textarea
                  placeholder="Enter reason for crediting..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreditModal(false);
                    setCreditAmount('');
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Credit ₹
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
