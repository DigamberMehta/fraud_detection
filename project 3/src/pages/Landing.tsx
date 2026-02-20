import { useNavigate } from "react-router-dom";
import {
  Shield,
  BarChart3,
  ChevronRight,
  Zap,
  ShieldCheck,
  Lock,
  Globe,
  Clock,
  Sparkles,
  Brain,
  Bell,
  TrendingUp,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Star,
  Layers,
  Activity,
  Database,
  Eye,
  AlertTriangle,
} from "lucide-react";

const stats = [
  { value: "$2.4B+", label: "Protected Assets", icon: Shield },
  { value: "99.98%", label: "Uptime Guarantee", icon: Activity },
  { value: "0.3ms", label: "Detection Speed", icon: Zap },
  { value: "12M+", label: "Active Users", icon: Globe },
];

const features = [
  {
    icon: Brain,
    color: "blue",
    title: "AI-Powered Detection",
    description:
      "Gemini-powered machine learning models analyze thousands of signals in real-time to detect suspicious patterns before they become threats.",
  },
  {
    icon: Bell,
    color: "purple",
    title: "Instant Alerts",
    description:
      "Get notified immediately via push, email and SMS the moment suspicious activity is detected on your account.",
  },
  {
    icon: Eye,
    color: "pink",
    title: "Behavioural Analytics",
    description:
      "Advanced profiling of spending habits, location data, and device fingerprints creates an invisible security layer around your account.",
  },
  {
    icon: Database,
    color: "cyan",
    title: "Encrypted Vault",
    description:
      "Military-grade AES-256 encryption for all data at rest and TLS 1.3 for every byte in transit.",
  },
  {
    icon: TrendingUp,
    color: "emerald",
    title: "Risk Scoring",
    description:
      "Every transaction receives a dynamic risk score, enabling intelligent decisions that block fraud while approving legitimate payments.",
  },
  {
    icon: Globe,
    color: "amber",
    title: "Global Coverage",
    description:
      "Protect your money across 190+ countries with localised compliance and 24/7 regional monitoring centres.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in under 2 minutes with secure KYC verification and instant account activation.",
  },
  {
    step: "02",
    title: "Fund & Transact",
    description:
      "Add money via bank transfer, card, or wallet and start sending payments globally.",
  },
  {
    step: "03",
    title: "AI Monitors 24/7",
    description:
      "Our models watch every transaction in real-time, flagging and blocking any anomaly automatically.",
  },
  {
    step: "04",
    title: "Stay in Control",
    description:
      "Review flagged activity, dispute transactions, and customise your security thresholds anytime.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Small Business Owner",
    avatar: "PS",
    rating: 5,
    text: "FraudShield caught a fraudulent transaction on my business account within seconds. The real-time alerts saved me thousands.",
  },
  {
    name: "Marcus Lee",
    role: "Freelance Developer",
    avatar: "ML",
    rating: 5,
    text: "I've used several fintech platforms but FraudShield's AI detection is on another level. Total peace of mind for international payments.",
  },
  {
    name: "Aisha Patel",
    role: "E-commerce Manager",
    avatar: "AP",
    rating: 5,
    text: "The admin dashboard gives our team complete visibility. Fraud dropped by 94% in the first month after switching.",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      {/* ── Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full filter blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full filter blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-600/8 rounded-full filter blur-[180px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar border-t-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              FraudShield<span className="text-blue-400"> Bank</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/customer")}
              className="hidden sm:block text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-28 px-6 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-blue-300 mb-8 border border-blue-500/20">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Google Gemini AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Banking That Fights Back
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Against Fraud
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          FraudShield combines next-gen banking with real-time AI fraud
          detection — so every transaction is protected, every second of the
          day.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/customer")}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
          >
            Open a Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="group flex items-center gap-2 glass border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:bg-white/10"
          >
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Admin Dashboard
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          {[
            { icon: Lock, label: "Bank-grade Encryption" },
            { icon: ShieldCheck, label: "PCI-DSS Compliant" },
            { icon: Clock, label: "24/7 Monitoring" },
            { icon: CheckCircle, label: "FCA Regulated" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-green-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="glass-card p-6 text-center hover:bg-white/8 transition-all"
            >
              <Icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-purple-300 border border-purple-500/20 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Enterprise-Grade Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Stay
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Protected
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A full suite of financial security tools, built for individuals and
            businesses alike.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div key={title} className="glass-card-hover p-6 group">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-cyan-300 border border-cyan-500/20 mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple Onboarding</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Up and Running in
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              4 Steps
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Get protected in minutes, no paperwork required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, title, description }, i) => (
            <div
              key={step}
              className="relative glass-card p-6 hover:bg-white/8 transition-all"
            >
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
              )}
              <div className="text-4xl font-extrabold bg-gradient-to-br from-blue-400/40 to-purple-400/40 bg-clip-text text-transparent mb-4">
                {step}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-amber-300 border border-amber-500/20 mb-4">
            <Star className="w-3.5 h-3.5" />
            <span>Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Millions
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Worldwide
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, avatar, rating, text }) => (
            <div
              key={name}
              className="glass-card p-6 hover:bg-white/8 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className="text-xs text-gray-500">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security Section ── */}
      <section id="security" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">
                  Security First
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built on a Foundation of
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  Zero Trust
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Every request authenticated. Every packet encrypted. Our
                zero-trust architecture assumes breach and verifies everything —
                because your security shouldn't depend on a single point of
                failure.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "AES-256 Encryption",
                  "TLS 1.3 Transit",
                  "OAuth 2.0 + JWT",
                  "Rate Limiting",
                  "Device Fingerprinting",
                  "IP Reputation",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="w-40 h-40 rounded-3xl glass flex flex-col items-center justify-center border border-white/10">
                <Shield className="w-16 h-16 text-blue-400 mb-2" />
                <span className="text-xs text-gray-400">Protected</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.997%</div>
                <div className="text-sm text-gray-500">Threat Block Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to Bank Without
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}
            Fear?
          </span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10">
          Join over 12 million people who trust FraudShield Bank to protect
          their money every day.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/customer")}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
          >
            Start for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="group flex items-center gap-2 glass border border-white/10 hover:border-white/20 hover:bg-white/10 text-gray-300 hover:text-white font-semibold px-10 py-4 rounded-2xl transition-all"
          >
            <CreditCard className="w-5 h-5 text-purple-400" />
            Admin Access
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              FraudShield Bank
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
            <span>© 2026 FraudShield Bank. All rights reserved.</span>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Security
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
