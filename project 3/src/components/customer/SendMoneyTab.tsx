import { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle, XCircle, Send, ArrowRight, Loader2, User, Lock, Calendar } from 'lucide-react';
import { currentUser, upiContacts } from '../../data/mockData';

type PaymentMethod = 'card' | 'upi' | 'bank';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'declined';

export default function SendMoneyTab() {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const detectCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    return '';
  };

  const handlePayment = () => {
    setStatus('processing');

    setTimeout(() => {
      const shouldSucceed = Math.random() > 0.3;
      setStatus(shouldSucceed ? 'success' : 'declined');

      setTimeout(() => {
        setStatus('idle');
        if (status === 'success') {
          setCardNumber('');
          setUpiId('');
          setUpiVerified(false);
        }
      }, 3000);
    }, 2000);
  };

  const upiApps = [
    { name: 'GPay', icon: '🟢' },
    { name: 'PhonePe', icon: '🟣' },
    { name: 'Paytm', icon: '🔵' },
    { name: 'BHIM', icon: '🟠' },
    { name: 'AmazonPay', icon: '🟡' }
  ];

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-modal p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">Your transaction has been processed</p>

          <div className="space-y-3 text-left glass rounded-2xl p-6 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-semibold">₹5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reference ID</span>
              <span className="text-white font-mono text-sm">REF{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={() => setStatus('idle')}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Done
          </button>
        </div>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-modal p-12 text-center max-w-md w-full shake border-red-500/50 glass-glow-red">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Transaction Declined</h2>
          <p className="text-gray-400 mb-6">We couldn't process your payment. Please try again or contact support.</p>

          <button
            onClick={() => setStatus('idle')}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-modal p-12 text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-3">Processing Payment...</h2>
          <p className="text-gray-400">Please wait while we process your transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Send className="w-8 h-8 text-blue-400" />
        Send Money
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMethod('card')}
          className={`flex-1 p-4 rounded-xl transition-all backdrop-blur-xl ${
            method === 'card'
              ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20'
              : 'glass hover:bg-white/10'
          }`}
        >
          <CreditCard className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Card</p>
        </button>

        <button
          onClick={() => setMethod('upi')}
          className={`flex-1 p-4 rounded-xl transition-all backdrop-blur-xl ${
            method === 'upi'
              ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/20'
              : 'glass hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">UPI</p>
        </button>

        <button
          onClick={() => setMethod('bank')}
          className={`flex-1 p-4 rounded-xl transition-all backdrop-blur-xl ${
            method === 'bank'
              ? 'bg-green-500/20 border-2 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
              : 'glass hover:bg-white/10'
          }`}
        >
          <Building2 className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Bank Transfer</p>
        </button>
      </div>

      <div className="glass-card p-6">
        {method === 'card' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Pay with Card</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Recipient Name</label>
              <input
                type="text"
                placeholder="Enter recipient name"
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                    setCardNumber(formatted);
                  }}
                  placeholder="0000 0000 0000 0000"
                  className="glass-input w-full"
                />
                {detectCardBrand(cardNumber) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-400">
                    {detectCardBrand(cardNumber)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="text"
                placeholder="₹ 0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-400 mb-4">Available balance: ₹{currentUser.balance.toLocaleString('en-IN')}</p>
              <button
                onClick={handlePayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-medium transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {method === 'upi' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Pay with UPI</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-2">UPI ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => setUpiVerified(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Verify
                </button>
              </div>
              {upiVerified && (
                <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Digamber Singh · HDFC Bank</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Select UPI App</label>
              <div className="grid grid-cols-5 gap-3">
                {upiApps.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => setSelectedUpiApp(app.name)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedUpiApp === app.name
                        ? 'bg-purple-500/20 border-2 border-purple-500'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl">{app.icon}</span>
                    <span className="text-xs text-gray-400">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Recent Contacts</label>
              <div className="space-y-2">
                {upiContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setUpiId(contact.upiId);
                      setUpiVerified(true);
                    }}
                    className="w-full flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{contact.avatar}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-xs text-gray-400">{contact.upiId}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="text"
                placeholder="₹ 0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Remark (Optional)</label>
              <input
                type="text"
                placeholder="Add a note"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl font-medium transition-colors"
            >
              Pay via UPI
            </button>
          </div>
        )}

        {method === 'bank' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Bank Transfer</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Account Holder Name</label>
              <input
                type="text"
                placeholder="Enter account holder name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Account Number</label>
              <input
                type="text"
                placeholder="Enter account number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Account Number</label>
              <input
                type="text"
                placeholder="Re-enter account number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">IFSC Code</label>
              <input
                type="text"
                placeholder="SBIN0001234"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Bank: State Bank of India, Branch: Mumbai Main</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Transfer Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-green-500/20 hover:border-green-500 transition-all">
                  <p className="font-medium text-white mb-1">NEFT</p>
                  <p className="text-xs text-gray-400">2-4 hours</p>
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-green-500/20 hover:border-green-500 transition-all">
                  <p className="font-medium text-white mb-1">RTGS</p>
                  <p className="text-xs text-gray-400">₹2L min</p>
                </button>
                <button className="p-3 bg-green-500/20 border-2 border-green-500 rounded-xl">
                  <p className="font-medium text-white mb-1">IMPS</p>
                  <p className="text-xs text-gray-400">Instant</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="text"
                placeholder="₹ 0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Purpose</label>
              <input
                type="text"
                placeholder="Purpose of transfer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-medium transition-colors"
            >
              Transfer Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
