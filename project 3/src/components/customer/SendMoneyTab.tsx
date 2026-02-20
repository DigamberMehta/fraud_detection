import { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  XCircle,
  Send,
  ArrowRight,
  Loader2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

type PaymentMethod = "card" | "upi" | "bank";
type PaymentStatus = "idle" | "processing" | "success" | "declined";
type TransferType = "NEFT" | "RTGS" | "IMPS";

interface Merchant {
  _id: string;
  name: string;
  category: string;
  country: string;
}

interface SuccessData {
  transactionId: string;
  amount: number;
  merchantName: string;
  alertMessage?: string;
}

function getDeviceId(): string {
  const key = "fs_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      "browser-" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

const formatCardInput = (value: string) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 16);
  return (cleaned.match(/.{1,4}/g) || []).join(" ");
};

const detectCardBrand = (number: string) => {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "Visa";
  if (n.startsWith("5")) return "Mastercard";
  if (n.startsWith("3")) return "Amex";
  if (n.startsWith("6")) return "RuPay";
  return "";
};

const upiApps = [
  { name: "GPay", icon: "🟢" },
  { name: "PhonePe", icon: "🟣" },
  { name: "Paytm", icon: "🔵" },
  { name: "BHIM", icon: "🟠" },
  { name: "AmazonPay", icon: "🟡" },
];

export default function SendMoneyTab() {
  const { token, user } = useAuth();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState("");
  const [loadingMerchants, setLoadingMerchants] = useState(true);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("IMPS");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/merchants/active`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMerchants(data.data.merchants);
      })
      .catch(console.error)
      .finally(() => setLoadingMerchants(false));
  }, [token]);

  const selectedMerchant = merchants.find((m) => m._id === selectedMerchantId);

  const buildPaymentMethod = () => {
    if (method === "card") {
      return {
        type: "card",
        card: {
          last4: cardNumber.replace(/\s/g, "").slice(-4),
          cardBrand: detectCardBrand(cardNumber) || "Other",
        },
      };
    }
    if (method === "upi") {
      return {
        type: "upi",
        upi: { upiId: upiId.trim(), upiApp: selectedUpiApp || "Other" },
      };
    }
    return {
      type: "bank_transfer",
      bankTransfer: {
        accountLast4: accountNumber.slice(-4),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
        transferType,
      },
    };
  };

  const validate = (): string | null => {
    if (!selectedMerchantId) return "Please select a recipient/merchant.";
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0)
      return "Please enter a valid amount.";
    if (method === "card" && cardNumber.replace(/\s/g, "").length < 16)
      return "Enter a valid 16-digit card number.";
    if (method === "upi" && !upiId.includes("@"))
      return "Enter a valid UPI ID (e.g. name@bank).";
    if (method === "bank") {
      if (accountNumber.length < 4) return "Enter a valid account number.";
      if (ifscCode.length < 6) return "Enter a valid IFSC code.";
    }
    return null;
  };

  const handlePayment = async () => {
    setErrorMsg("");
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setStatus("processing");
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          merchantId: selectedMerchantId,
          deviceId: getDeviceId(),
          amount: parseFloat(amount),
          currency: "INR",
          paymentMethod: buildPaymentMethod(),
          paymentChannel: "mobile_app",
          location: { city: "Mumbai", country: "India" },
          isInternational: selectedMerchant?.country !== "India",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Transaction failed. Please try again.");
        setStatus("declined");
        return;
      }
      const txn = data.data.transaction;
      if (txn.status === "blocked") {
        setErrorMsg(
          data.data.alert?.message || "Transaction blocked due to fraud risk.",
        );
        setStatus("declined");
        return;
      }
      setSuccessData({
        transactionId: txn._id,
        amount: txn.amount,
        merchantName: selectedMerchant?.name ?? "Merchant",
        alertMessage: data.data.alert?.message,
      });
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("declined");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
    setSuccessData(null);
    setAmount("");
    setCardNumber("");
    setUpiId("");
    setSelectedUpiApp("");
    setAccountNumber("");
    setIfscCode("");
    setBankName("");
    setSelectedMerchantId("");
  };

  // ── Screens ──────────────────────────────────────────────────────────────

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-modal p-12 text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Processing Payment…</h2>
          <p className="text-gray-400">Please wait while we verify your transaction</p>
        </div>
      </div>
    );
  }

  if (status === 'success' && successData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-modal p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">Your transaction has been processed</p>

          <div className="space-y-3 text-left glass rounded-2xl p-6 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-semibold">₹{successData.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">To</span>
              <span className="text-white font-semibold">{successData.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-white font-mono text-xs break-all">{successData.transactionId}</span>
            </div>
          </div>

          {successData.alertMessage && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{successData.alertMessage}</span>
            </div>
          )}

          <button onClick={reset} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
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
        <div className="glass-modal p-12 text-center max-w-md w-full border-red-500/50 glass-glow-red">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Transaction Declined</h2>
          <p className="text-gray-400 mb-4">{errorMsg || "We couldn't process your payment. Please try again."}</p>
          <button onClick={() => setStatus('idle')} className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Send className="w-8 h-8 text-blue-400" />
        Send Money
      </h2>

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Recipient selector */}
      <div className="glass-card p-5 mb-4">
        <label className="block text-sm text-gray-400 mb-2">Recipient (Merchant)</label>
        {loadingMerchants ? (
          <div className="flex items-center gap-2 text-gray-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading merchants…</span>
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="glass-input w-full appearance-none pr-10 cursor-pointer"
            >
              <option value="">— Select merchant —</option>
              {merchants.map((m) => (
                <option key={m._id} value={m._id} className="bg-[#12121A] text-white">
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        )}
        {selectedMerchant && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedMerchant.category} · {selectedMerchant.country}
            {selectedMerchant.country !== 'India' && <span className="ml-2 text-yellow-400">⚠ International transaction</span>}
          </p>
        )}
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-4 mb-6">
        {([
          { id: 'card' as PaymentMethod, label: 'Card', Icon: CreditCard, color: 'blue' },
          { id: 'upi' as PaymentMethod, label: 'UPI', Icon: Smartphone, color: 'purple' },
          { id: 'bank' as PaymentMethod, label: 'Bank Transfer', Icon: Building2, color: 'green' },
        ] as const).map(({ id, label, Icon, color }) => (
          <button
            key={id}
            onClick={() => { setMethod(id); setErrorMsg(''); }}
            className={`flex-1 p-4 rounded-xl transition-all backdrop-blur-xl ${
              method === id
                ? `bg-${color}-500/20 border-2 border-${color}-500 text-${color}-400 shadow-lg shadow-${color}-500/20`
                : 'glass hover:bg-white/10'
            }`}
          >
            <Icon className="w-6 h-6 mx-auto mb-2" />
            <p className="font-medium text-sm">{label}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">

        {/* Card */}
        {method === 'card' && (
          <>
            <h3 className="text-xl font-semibold text-white mb-2">Pay with Card</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="glass-input w-full"
                />
                {detectCardBrand(cardNumber) && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-400">
                    {detectCardBrand(cardNumber)}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expiry</label>
                <input type="text" placeholder="MM/YY" className="glass-input w-full" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">CVV</label>
                <input type="password" placeholder="•••" maxLength={4} className="glass-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" className="glass-input w-full" />
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-400 mb-4">Available balance: ₹{user?.balance?.toLocaleString('en-IN') ?? '—'}</p>
              <button onClick={handlePayment} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />Pay Now
              </button>
            </div>
          </>
        )}

        {/* UPI */}
        {method === 'upi' && (
          <>
            <h3 className="text-xl font-semibold text-white mb-2">Pay with UPI</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-2">UPI ID</label>
              <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="username@bank" className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-3">UPI App</label>
              <div className="grid grid-cols-5 gap-3">
                {upiApps.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => setSelectedUpiApp(app.name)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedUpiApp === app.name ? 'bg-purple-500/20 border-2 border-purple-500' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs text-gray-400">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" className="glass-input w-full" />
            </div>
            <button onClick={handlePayment} className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5" />Pay via UPI
            </button>
          </>
        )}

        {/* Bank Transfer */}
        {method === 'bank' && (
          <>
            <h3 className="text-xl font-semibold text-white mb-2">Bank Transfer</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Account Number</label>
              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder="Enter account number" className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">IFSC Code</label>
              <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value.toUpperCase())} placeholder="SBIN0001234" className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bank Name</label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. State Bank of India" className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-3">Transfer Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['NEFT', 'RTGS', 'IMPS'] as TransferType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransferType(t)}
                    className={`p-3 rounded-xl transition-all ${
                      transferType === t ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <p className="font-medium mb-1">{t}</p>
                    <p className="text-xs text-gray-400">{t === 'NEFT' ? '2-4 hrs' : t === 'RTGS' ? '₹2L min' : 'Instant'}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" className="glass-input w-full" />
            </div>
            <button onClick={handlePayment} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5" />Transfer Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
