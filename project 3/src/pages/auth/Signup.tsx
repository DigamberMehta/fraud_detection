import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  ShieldCheck,
  ChevronLeft,
  User,
  Phone,
  UserPlus,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Strength Logic
  const pwStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = pwStrength(password);
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match.");
    
    setLoading(true);
    try {
      await signup(name, email, password, role, phone || undefined);
      navigate(role === "admin" ? "/admin" : "/customer", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: ShieldCheck, label: "Bank-grade AES-256 encryption" },
    { icon: Zap, label: "AI fraud detection in 0.3ms" },
    { icon: Globe, label: "Protected across 190+ countries" },
    { icon: CheckCircle, label: "99.98% uptime, always available" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-hidden">
      {/* ── Left panel (Identical to Login) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0A0A0F] to-purple-700/20" />
        <div className="absolute top-0 left-0 w-[480px] h-[480px] bg-blue-500/20 rounded-full filter blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full filter blur-[120px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-none">FraudShield</span>
              <span className="text-xs text-blue-400 font-medium">Bank</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-snug mb-4">
              Join the future of<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">secure finance.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Create an account in minutes and experience banking protected by world-class AI.
            </p>
          </div>
          <div className="space-y-3">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live AI monitoring active</span>
        </div>
      </div>

      {/* ── Right panel (Signup Form) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8 group">
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
              <Sparkles className="w-3 h-3" /> Get Started Free
            </div>
            <h1 className="text-2xl font-bold text-white mb-1.5">Create Account</h1>
            <p className="text-gray-500 text-sm">Join FraudShield Bank today</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-2">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                    role === r ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="glass-input w-full pl-10 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="glass-input w-full pl-10 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="glass-input w-full pl-10 pr-11 text-sm" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor : "bg-white/5"}`} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="glass-input w-full pl-10 text-sm" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all mt-4 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Register Account <UserPlus className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8">
            Already have an account? <Link to="/auth/login" className="text-blue-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}