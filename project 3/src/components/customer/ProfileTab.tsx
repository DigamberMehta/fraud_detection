import { User, Mail, Phone, Calendar, Shield, Bell, HelpCircle, LogOut, ChevronRight, Edit, Activity, Clock } from 'lucide-react';
import { currentUser } from '../../data/mockData';

export default function ProfileTab() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <User className="w-8 h-8 text-blue-400" />
        Profile
      </h2>

      <div className="glass-card p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{currentUser.avatar}</span>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h3>
            <p className="text-gray-400 mb-3">{currentUser.email}</p>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Transactions</p>
                  <p className="text-xl font-semibold text-white">{currentUser.totalTransactions}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-xl font-semibold text-white">{Math.floor(currentUser.accountAgeDays / 30)} months</p>
                </div>
              </div>
            </div>
          </div>

          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-white font-medium">{currentUser.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="text-white font-medium">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="text-white font-medium">{currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Account Age</p>
              <p className="text-white font-medium">{currentUser.accountAgeDays} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-white font-medium">Security</p>
                <p className="text-sm text-gray-400">Change password, trusted devices</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <p className="text-white font-medium">Notifications</p>
                <p className="text-sm text-gray-400">Manage notification preferences</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <p className="text-white font-medium">Help & Support</p>
                <p className="text-sm text-gray-400">FAQs, contact support</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <button className="w-full glass-card p-4 hover:bg-red-500/20 transition-colors group border-red-500/50">
        <div className="flex items-center justify-center gap-3 text-red-400 group-hover:text-red-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </div>
      </button>
    </div>
  );
}
