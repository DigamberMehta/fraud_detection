import { useState } from 'react';
import { Home, Send, CreditCard, FileText, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeTab from '../components/customer/HomeTab';
import SendMoneyTab from '../components/customer/SendMoneyTab';
import TransactionsTab from '../components/customer/TransactionsTab';
import CardsTab from '../components/customer/CardsTab';
import ProfileTab from '../components/customer/ProfileTab';

type Tab = 'home' | 'send' | 'transactions' | 'cards' | 'profile';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const navigate = useNavigate();

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'send' as Tab, label: 'Send Money', icon: Send },
    { id: 'transactions' as Tab, label: 'Transactions', icon: FileText },
    { id: 'cards' as Tab, label: 'Cards', icon: CreditCard },
    { id: 'profile' as Tab, label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      {/* Background orbs for glassmorphism */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      
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
            <p className="text-sm text-gray-400">Customer Portal</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'send' && <SendMoneyTab />}
          {activeTab === 'transactions' && <TransactionsTab />}
          {activeTab === 'cards' && <CardsTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-navbar px-4 py-2 z-50">
          <div className="flex justify-around">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-400'
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
