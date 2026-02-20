import { useState } from 'react';
import { CreditCard, Plus, Trash2, Landmark, Wallet, Globe, Wifi, Shield, Eye, EyeOff, Settings } from 'lucide-react';
import { currentUser, upiContacts } from '../../data/mockData';

export default function CardsTab() {
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [international, setInternational] = useState(false);
  const [contactless, setContactless] = useState(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Wallet className="w-8 h-8 text-blue-400" />
        Cards & Accounts
      </h2>

      <div className="glass-card p-8 relative overflow-hidden glass-glow-purple">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-gray-300 text-sm mb-1">Credit Card</p>
              <p className="text-white font-medium">HDFC Bank</p>
            </div>
            <CreditCard className="w-8 h-8 text-white/40" />
          </div>

          <div className="mb-8">
            <p className="text-2xl tracking-wider text-white font-mono">
              •••• •••• •••• 4242
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-400 text-xs mb-1">Card Holder</p>
              <p className="text-white font-medium">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Expires</p>
              <p className="text-white font-medium">12/28</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">VISA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Card Controls
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Online Payments</p>
                <p className="text-sm text-gray-400">Enable card for online transactions</p>
              </div>
            </div>
            <button
              onClick={() => setOnlinePayments(!onlinePayments)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                onlinePayments ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                onlinePayments ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">International Transactions</p>
                <p className="text-sm text-gray-400">Allow payments outside India</p>
              </div>
            </div>
            <button
              onClick={() => setInternational(!international)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                international ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                international ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Contactless Payments</p>
                <p className="text-sm text-gray-400">Tap to pay at POS terminals</p>
              </div>
            </div>
            <button
              onClick={() => setContactless(!contactless)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                contactless ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                contactless ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Linked Bank Accounts</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Link Account
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">State Bank of India</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-400">•••• 7890</span>
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Savings</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">₹84,500</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-white">HDFC Bank</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-400">•••• 1234</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">Current</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">₹12,300</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">UPI IDs</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add UPI ID
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">digamber@paytm</p>
                <p className="text-sm text-gray-400">Paytm</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">digamber@ybl</p>
                <p className="text-sm text-gray-400">PhonePe</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button className="w-full glass-card-hover p-6 group">
        <div className="flex items-center justify-center gap-3 text-blue-400 group-hover:text-blue-300">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Card</span>
        </div>
      </button>
    </div>
  );
}
