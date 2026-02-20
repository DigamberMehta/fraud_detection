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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // role-based redirect handled via ProtectedRoute + AuthContext, but we can read user after login
      const stored = localStorage.getItem("fs_token");
      if (stored) {
        // Decode role from JWT payload (base64)
        const payload = JSON.parse(atob(stored.split(".")[1]));
        navigate(payload.role === "admin" ? "/admin" : "/customer", {
          replace: true,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0A0A0F] to-purple-700/20" />
        <div className="absolute top-0 left-0 w-[480px] h-[480px] bg-blue-500/20 rounded-full filter blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full filter blur-[120px] translate-x-1/3 translate-y-1/3" />
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-none">
                FraudShield
              </span>
              <span className="text-xs text-blue-400 font-medium">Bank</span>
            </div>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-snug mb-4">
              Secure banking,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Every transaction monitored. Every threat blocked. Sign in and let
              our AI handle the rest.
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

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">
            All systems operational &mdash; 99.98% uptime
          </span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              FraudShield <span className="text-blue-400">Bank</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8 group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your FraudShield account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="glass-input w-full pl-10 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-10 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] mt-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-gray-600">New to FraudShield?</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <Link
            to="/auth/signup"
            className="flex items-center justify-center gap-2 w-full glass border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-all text-sm group"
          >
            Create a free account
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="text-center text-xs text-gray-600 mt-8">
            Protected by AES-256 encryption &amp; AI fraud detection
          </p>
        </div>
      </div>
    </div>
  );
}
