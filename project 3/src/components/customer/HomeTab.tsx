import { useState, useEffect } from "react";
import {
  Send,
  Smartphone,
  Building2,
  Clock,
  ShoppingBag,
  Utensils,
  Wallet,
  Film,
  CreditCard,
  PlusCircle,
  ArrowRightCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

interface ApiTransaction {
  _id: string;
  amount: number;
  currency: string;
  status: "completed" | "blocked" | "pending";
  paymentMethod: {
    type: "card" | "bank_transfer" | "upi";
    card?: { last4: string; cardBrand?: string; bankName?: string };
    bankTransfer?: {
      bankName?: string;
      transferType?: string;
      accountLast4?: string;
    };
    upi?: { upiId: string; upiApp?: string };
  };
  merchantId?: { name: string; category: string };
  createdAt: string;
}

function buildWeeklySpending(transactions: ApiTransaction[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const result: { day: string; amount: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    result.push({ day: days[d.getDay()], amount: 0 });
  }

  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  transactions.forEach((t) => {
    if (t.status === "blocked") return;
    const txDate = new Date(t.createdAt);
    if (txDate < cutoff) return;
    const diffDays = Math.floor(
      (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const idx = 6 - diffDays;
    if (idx >= 0 && idx < 7) {
      result[idx].amount += t.amount;
    }
  });

  return result;
}

export default function HomeTab() {
  const auth = useAuth();
  const token = auth?.token;

  const [profile, setProfile] = useState<{
    name: string;
    balance: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE_URL}/users/me/profile`, { headers }).then((r) =>
        r.json(),
      ),
      fetch(`${API_BASE_URL}/transactions/my`, { headers }).then((r) =>
        r.json(),
      ),
    ])
      .then(([profileRes, txnRes]) => {
        if (profileRes.success) {
          setProfile({
            name: profileRes.data.user.name,
            balance: profileRes.data.user.balance,
          });
        }
        if (txnRes.success) {
          setTransactions(txnRes.data.transactions);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const currentBalance = profile?.balance ?? 0;
  const balance = useCountUp(currentBalance, 1500);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const recentTransactions = transactions
    .filter((t) => t.status !== "blocked")
    .slice(0, 4);

  const spendingData = buildWeeklySpending(transactions);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {getTimeGreeting()}, {(profile?.name ?? "there").split(" ")[0]}
        </h2>
      </div>

      <div className="relative glass-card p-8 glass-glow-blue">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-2">Available Balance</p>
          <h1 className="text-5xl font-bold text-white mb-6">
            ₹{balance.toLocaleString("en-IN")}.00
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
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No transactions yet.
            </p>
          )}
          {recentTransactions.map((txn) => {
            const category = txn.merchantId?.category ?? "";
            const getCategoryIcon = () => {
              switch (category) {
                case "Shopping":
                  return <ShoppingBag className="w-6 h-6 text-pink-400" />;
                case "Food & Dining":
                  return <Utensils className="w-6 h-6 text-orange-400" />;
                case "Income":
                  return <Wallet className="w-6 h-6 text-green-400" />;
                case "Entertainment":
                  return <Film className="w-6 h-6 text-purple-400" />;
                default:
                  return <CreditCard className="w-6 h-6 text-blue-400" />;
              }
            };
            const paymentLabel = () => {
              const pm = txn.paymentMethod;
              if (pm.type === "card" && pm.card?.last4)
                return `•••• ${pm.card.last4}`;
              if (pm.type === "upi" && pm.upi?.upiId) return pm.upi.upiId;
              if (pm.type === "bank_transfer" && pm.bankTransfer)
                return `${pm.bankTransfer.bankName ?? ""} ${pm.bankTransfer.transferType ?? ""}`.trim();
              return pm.type;
            };
            return (
              <div
                key={txn._id}
                className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    {getCategoryIcon()}
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      {txn.merchantId?.name ?? "Unknown"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{category}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                        {paymentLabel()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-red-400">
                    -₹{txn.amount.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        txn.status === "completed"
                          ? "bg-green-500"
                          : txn.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-400 capitalize">
                      {txn.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Spending This Week
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={spendingData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
