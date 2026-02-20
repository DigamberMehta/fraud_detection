import { useState } from 'react';
import { LayoutDashboard, Shield, CreditCard, Users, BarChart3, ArrowLeft, Map, Brain, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OverviewTab from '../components/admin/OverviewTab';
import FraudQueueTab from '../components/admin/FraudQueueTab';
import TransactionsAdminTab from '../components/admin/TransactionsAdminTab';
import UsersTab from '../components/admin/UsersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import HeatmapTab from '../components/admin/HeatmapTab';
import AlertsTab from '../components/admin/AlertsTab';
import MLModelTab from '../components/admin/MLModelTab';

type Tab = 'overview' | 'fraud' | 'transactions' | 'users' | 'analytics' | 'heatmap' | 'alerts' | 'mlmodel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'fraud' as Tab, label: 'Fraud Queue', icon: Shield },
    { id: 'transactions' as Tab, label: 'Transactions', icon: CreditCard },
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'heatmap' as Tab, label: 'Heatmap', icon: Map },
    { id: 'alerts' as Tab, label: 'Alerts', icon: Bell },
    { id: 'mlmodel' as Tab, label: 'ML Model', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      {/* Background orbs for glassmorphism */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full filter blur-[180px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:flex w-64 glass-sidebar flex-col">
          <div className="p-6 border-b border-white/10">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">FraudShield</h1>
            <p className="text-sm text-gray-400">Admin Portal</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AD</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin User</p>
                  <p className="text-gray-400 text-xs">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'fraud' && <FraudQueueTab />}
          {activeTab === 'transactions' && <TransactionsAdminTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'heatmap' && <HeatmapTab />}
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'mlmodel' && <MLModelTab />}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-navbar px-2 py-2 z-50">
          <div className="flex justify-around">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-400'
                    : 'text-gray-500'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
