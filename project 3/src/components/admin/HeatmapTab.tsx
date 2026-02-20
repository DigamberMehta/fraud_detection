import { useState } from 'react';
import {
  MapPin, TrendingUp, TrendingDown, Minus, AlertTriangle, Clock,
  Building2, ChevronRight, Activity, Target, Zap, Info, Filter, RefreshCw,
  BarChart3, PieChart, Map
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, Line } from 'recharts';
import { geographicFraudData, fraudTypeDefinitions, hourlyFraudPatterns } from '../../data/mockData';

export default function HeatmapTab() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const selectedStateData = geographicFraudData.find(s => s.id === selectedState);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-500/30 to-red-600/20 border-red-500/50';
      case 'high': return 'from-orange-500/30 to-orange-600/20 border-orange-500/50';
      case 'medium': return 'from-yellow-500/30 to-yellow-600/20 border-yellow-500/50';
      case 'low': return 'from-green-500/30 to-green-600/20 border-green-500/50';
      default: return 'from-gray-500/30 to-gray-600/20 border-gray-500/50';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const filteredData = filterRisk === 'all' 
    ? geographicFraudData 
    : geographicFraudData.filter(s => s.riskLevel === filterRisk);

  const totalFraudCases = geographicFraudData.reduce((sum, s) => sum + s.fraudCases, 0);
  const totalTransactions = geographicFraudData.reduce((sum, s) => sum + s.totalTransactions, 0);
  const avgFraudRate = (totalFraudCases / totalTransactions * 100).toFixed(2);

  const fraudTypeChartData = Object.entries(fraudTypeDefinitions).map(([key, value]) => ({
    name: value.label,
    value: geographicFraudData.reduce((sum, s) => sum + (s.fraudTypes[key as keyof typeof s.fraudTypes] || 0), 0),
    color: value.color
  }));

  const stateChartData = geographicFraudData
    .sort((a, b) => b.fraudCases - a.fraudCases)
    .slice(0, 8)
    .map(s => ({
      name: s.stateCode,
      cases: s.fraudCases,
      rate: s.fraudRate
    }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Map className="w-7 h-7 text-purple-400" />
            Fraud Heatmap
          </h2>
          <p className="text-gray-400 mt-1">Geographic distribution of fraud cases across India</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="glass-input px-4 py-2 rounded-xl text-white text-sm"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          <button className="glass-button p-2 rounded-xl text-gray-400 hover:text-white">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card glass-glow-red p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Fraud Cases</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalFraudCases.toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-1">+12.5% from last month</p>
        </div>

        <div className="glass-card glass-glow-orange p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Fraud Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgFraudRate}%</p>
          <p className="text-xs text-orange-400 mt-1">Per total transactions</p>
        </div>

        <div className="glass-card glass-glow-purple p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">High Risk Regions</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {geographicFraudData.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length}
          </p>
          <p className="text-xs text-purple-400 mt-1">Out of {geographicFraudData.length} states</p>
        </div>

        <div className="glass-card glass-glow-blue p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Loss/Case</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ₹{Math.round(geographicFraudData.reduce((sum, s) => sum + s.avgLoss, 0) / geographicFraudData.length).toLocaleString()}
          </p>
          <p className="text-xs text-blue-400 mt-1">Average per fraud</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Heatmap Grid */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              Regional Fraud Distribution
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredData.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedState(state.id === selectedState ? null : state.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedState === state.id
                      ? 'ring-2 ring-purple-500 bg-purple-500/10 border-purple-500/50'
                      : `bg-gradient-to-br ${getRiskColor(state.riskLevel)}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-white">{state.stateCode}</span>
                    {getTrendIcon(state.trend)}
                  </div>
                  <p className="text-xs text-gray-400 mb-2 text-left">{state.state}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{state.fraudCases.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadgeColor(state.riskLevel)}`}>
                      {state.fraudRate}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredData
                .sort((a, b) => b.fraudCases - a.fraudCases)
                .map((state, index) => (
                  <button
                    key={state.id}
                    onClick={() => setSelectedState(state.id === selectedState ? null : state.id)}
                    className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      selectedState === state.id
                        ? 'ring-2 ring-purple-500 bg-purple-500/10 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-gray-500 w-6">#{index + 1}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{state.state}</p>
                      <p className="text-xs text-gray-400">{state.topCities[0]?.name} • {state.topCities[1]?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{state.fraudCases.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadgeColor(state.riskLevel)}`}>
                        {state.riskLevel}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
            </div>
          )}

          {/* Risk Level Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-gray-400">Risk Levels:</span>
            {['critical', 'high', 'medium', 'low'].map((level) => (
              <div key={level} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${
                  level === 'critical' ? 'bg-red-500' :
                  level === 'high' ? 'bg-orange-500' :
                  level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="text-xs text-gray-400 capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Details Panel */}
        <div className="glass-card p-5">
          {selectedStateData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedStateData.state}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadgeColor(selectedStateData.riskLevel)}`}>
                    {selectedStateData.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{selectedStateData.fraudCases.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">fraud cases</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Fraud Rate</p>
                  <p className="text-lg font-bold text-white">{selectedStateData.fraudRate}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Avg Loss</p>
                  <p className="text-lg font-bold text-white">₹{selectedStateData.avgLoss.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Transactions</p>
                  <p className="text-lg font-bold text-white">{(selectedStateData.totalTransactions / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                  <p className="text-xs text-gray-400">Trend</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(selectedStateData.trend)}
                    <span className="text-sm text-white capitalize">{selectedStateData.trend}</span>
                  </div>
                </div>
              </div>

              {/* Top Cities */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  Top Affected Cities
                </h4>
                <div className="space-y-2">
                  {selectedStateData.topCities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <span className="text-sm text-white">{city.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{city.cases} cases</span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              city.riskScore >= 70 ? 'bg-red-500' :
                              city.riskScore >= 50 ? 'bg-orange-500' :
                              city.riskScore >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${city.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud Type Distribution */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-400" />
                  Fraud Type Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedStateData.fraudTypes).map(([key, value]) => {
                    const typeDef = fraudTypeDefinitions[key as keyof typeof fraudTypeDefinitions];
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: typeDef.color }}
                        />
                        <span className="text-xs text-gray-400 flex-1">{typeDef.label}</span>
                        <span className="text-sm text-white font-medium">{value}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="p-4 rounded-full bg-purple-500/10 mb-4">
                <Info className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Select a Region</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Click on any state in the heatmap to view detailed fraud statistics and city-level breakdown
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top States Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Top 8 States by Fraud Cases
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData} layout="vertical">
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [value?.toLocaleString(), 'Fraud Cases']}
                />
                <Bar dataKey="cases" fill="#a855f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Type Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Fraud Type Distribution (India)
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={fraudTypeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fraudTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {fraudTypeChartData.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-xs text-gray-400">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time-based Fraud Patterns */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Fraud Activity by Time of Day
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyFraudPatterns}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [
                  name === 'cases' ? value?.toLocaleString() + ' cases' : '₹' + value?.toLocaleString(),
                  name === 'cases' ? 'Fraud Cases' : 'Avg Amount'
                ]}
              />
              <Area type="monotone" dataKey="cases" stroke="#a855f7" fillOpacity={1} fill="url(#colorCases)" strokeWidth={2} />
              <Line type="monotone" dataKey="avgAmount" stroke="#ec4899" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-400">Fraud Cases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span className="text-sm text-gray-400">Avg Amount (₹)</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-medium">Peak Fraud Hours Detected</p>
              <p className="text-xs text-gray-400 mt-1">
                Highest fraud activity observed between <span className="text-white">4 PM - 8 PM</span>. 
                Consider increasing monitoring staff during these hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}