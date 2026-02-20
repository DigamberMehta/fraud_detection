import { useState } from 'react';
import { Download, AlertCircle, X, ShoppingBag, Utensils, Wallet, Film, Zap, CreditCard, Filter, Calendar, CheckCircle, Clock as ClockIcon, XCircle } from 'lucide-react';
import { mockTransactions } from '../../data/mockData';

type Filter = 'all' | 'card' | 'upi' | 'bankTransfer';

export default function TransactionsTab() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedTxn, setSelectedTxn] = useState<any>(null);

  const filteredTransactions = mockTransactions
    .filter(t => t.status !== 'blocked')
    .filter(t => filter === 'all' || t.paymentMethod === filter);

  const groupByDate = (transactions: typeof mockTransactions) => {
    const groups: { [key: string]: typeof mockTransactions } = {};

    transactions.forEach(txn => {
      const date = new Date(txn.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label = '';
      if (date.toDateString() === today.toDateString()) {
        label = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday';
      } else {
        label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(txn);
    });

    return groups;
  };

  const groupedTransactions = groupByDate(filteredTransactions);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-blue-400" />
        Transactions
      </h2>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Filter className="w-4 h-4" />
          All
        </button>
        <button
          onClick={() => setFilter('card')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            filter === 'card'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Card
        </button>
        <button
          onClick={() => setFilter('upi')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            filter === 'upi'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          UPI
        </button>
        <button
          onClick={() => setFilter('bankTransfer')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            filter === 'bankTransfer'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Bank Transfer
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">{date}</h3>

            <div className="glass-table">
              {transactions.map((txn, idx) => (
                  <button
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors ${
                    idx !== transactions.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      {txn.merchantCategory === 'Shopping' ? <ShoppingBag className="w-6 h-6 text-pink-400" /> : 
                       txn.merchantCategory === 'Food & Dining' ? <Utensils className="w-6 h-6 text-orange-400" /> : 
                       txn.merchantCategory === 'Income' ? <Wallet className="w-6 h-6 text-green-400" /> : 
                       txn.merchantCategory === 'Entertainment' ? <Film className="w-6 h-6 text-purple-400" /> : 
                       txn.merchantCategory === 'Utilities' ? <Zap className="w-6 h-6 text-yellow-400" /> : 
                       <CreditCard className="w-6 h-6 text-blue-400" />}
                    </div>

                    <div className="text-left">
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
                      <div className={`w-2 h-2 rounded-full ${
                        txn.status === 'completed' ? 'bg-green-500' :
                        txn.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-gray-400 capitalize">{txn.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-4">
          <div className="glass-modal max-w-md w-full overflow-hidden">
            <div className={`p-8 ${
              selectedTxn.status === 'completed' ? 'bg-green-500/10' :
              selectedTxn.status === 'pending' ? 'bg-yellow-500/10' :
              'bg-red-500/10'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedTxn.status === 'completed' ? 'bg-green-500/20' :
                  selectedTxn.status === 'pending' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  {selectedTxn.status === 'completed' ? <CheckCircle className="w-8 h-8 text-green-400" /> :
                   selectedTxn.status === 'pending' ? <ClockIcon className="w-8 h-8 text-yellow-400" /> : 
                   <XCircle className="w-8 h-8 text-red-400" />}
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h3 className="text-3xl font-bold text-white mb-2">
                {selectedTxn.type === 'credit' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString('en-IN')}
              </h3>
              <p className="text-gray-400 capitalize">{selectedTxn.status}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-b border-dashed border-white/10 pb-4">
                <p className="text-sm text-gray-400 mb-1">To</p>
                <p className="text-white font-medium">{selectedTxn.merchant}</p>
                <p className="text-sm text-gray-400">{selectedTxn.merchantCategory}</p>
              </div>

              <div className="border-b border-dashed border-white/10 pb-4">
                <p className="text-sm text-gray-400 mb-1">Via</p>
                <p className="text-white font-medium">
                  {selectedTxn.paymentMethod === 'card' && `${selectedTxn.cardDetails?.cardBrand} •••• ${selectedTxn.cardDetails?.last4}`}
                  {selectedTxn.paymentMethod === 'upi' && selectedTxn.upiDetails?.upiId}
                  {selectedTxn.paymentMethod === 'bankTransfer' && `${selectedTxn.bankTransferDetails?.bankName} ${selectedTxn.bankTransferDetails?.transferType}`}
                </p>
                {selectedTxn.paymentMethod === 'card' && (
                  <p className="text-sm text-gray-400">{selectedTxn.cardDetails?.bankName}</p>
                )}
              </div>

              <div className="border-b border-dashed border-white/10 pb-4">
                <p className="text-sm text-gray-400 mb-1">Date & Time</p>
                <p className="text-white font-medium">
                  {new Date(selectedTxn.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="border-b border-dashed border-white/10 pb-4">
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-white font-medium">{selectedTxn.location}</p>
              </div>

              <div className="pb-4">
                <p className="text-sm text-gray-400 mb-1">Reference ID</p>
                <p className="text-white font-mono text-sm">{selectedTxn.referenceId}</p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-white/10">
                  <AlertCircle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
