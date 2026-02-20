import { useState } from 'react';
import {
  Bell, AlertTriangle, ShieldAlert, Info, CheckCircle2, Clock, MapPin,
  ChevronRight, RefreshCw, Eye, EyeOff, Settings, Volume2,
  VolumeX, Trash2
} from 'lucide-react';
import { realtimeAlerts } from '../../data/mockData';

type AlertType = 'all' | 'critical' | 'warning' | 'info';

export default function AlertsTab() {
  const [filterType, setFilterType] = useState<AlertType>('all');
  const [alerts, setAlerts] = useState(realtimeAlerts);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredAlerts = alerts
    .filter(alert => filterType === 'all' || alert.type === filterType)
    .filter(alert => !showUnreadOnly || !alert.isRead);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <ShieldAlert className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAlertBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white/5 border-white/10';
    switch (type) {
      case 'critical': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info': return 'bg-blue-500/10 border-blue-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.isRead).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-7 h-7 text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Alerts & Notifications</h2>
            <p className="text-gray-400 mt-1">Real-time fraud alerts and system notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`glass-button p-2 rounded-xl transition-colors ${soundEnabled ? 'text-purple-400' : 'text-gray-400'}`}
            title={soundEnabled ? 'Mute alerts' : 'Unmute alerts'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button className="glass-button p-2 rounded-xl text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button className="glass-button p-2 rounded-xl text-gray-400 hover:text-white">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="glass-card glass-glow-red p-4 border-red-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-semibold">{criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''} Require Attention</p>
                <p className="text-sm text-gray-400">Immediate action may be required</p>
              </div>
            </div>
            <button
              onClick={() => setFilterType('critical')}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              View Critical
            </button>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 cursor-pointer hover:ring-1 hover:ring-purple-500/50 transition-all" onClick={() => setFilterType('all')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
              <p className="text-xs text-gray-400">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:ring-1 hover:ring-red-500/50 transition-all" onClick={() => setFilterType('critical')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.type === 'critical').length}</p>
              <p className="text-xs text-gray-400">Critical</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:ring-1 hover:ring-yellow-500/50 transition-all" onClick={() => setFilterType('warning')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <ShieldAlert className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.type === 'warning').length}</p>
              <p className="text-xs text-gray-400">Warnings</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:ring-1 hover:ring-blue-500/50 transition-all" onClick={() => setFilterType('info')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.type === 'info').length}</p>
              <p className="text-xs text-gray-400">Info</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'critical', 'warning', 'info'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as AlertType)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === type
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'glass-button text-gray-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
              showUnreadOnly ? 'bg-purple-500/20 text-purple-400' : 'glass-button text-gray-400'
            }`}
          >
            {showUnreadOnly ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showUnreadOnly ? 'Showing Unread' : 'Show Unread Only'}</span>
          </button>
          <button
            onClick={markAllAsRead}
            className="glass-button px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-gray-400">No alerts match your current filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card p-4 border transition-all ${getAlertBg(alert.type, alert.isRead)} hover:ring-1 hover:ring-purple-500/50`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  alert.type === 'critical' ? 'bg-red-500/20' :
                  alert.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${alert.isRead ? 'text-gray-300' : 'text-white'}`}>
                          {alert.title}
                        </h4>
                        {!alert.isRead && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        )}
                        {alert.actionRequired && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(alert.timestamp)}
                        </span>
                        {alert.region && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.region}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings Card */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Alert Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Critical Alerts</p>
              <p className="text-xs text-gray-400">High-priority fraud notifications</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-xs text-gray-400">Send alerts to admin email</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">SMS Alerts</p>
              <p className="text-xs text-gray-400">Critical alerts to phone</p>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Auto-resolve Low Risk</p>
              <p className="text-xs text-gray-400">Automatically clear low-risk alerts</p>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}