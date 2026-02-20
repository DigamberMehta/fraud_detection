import { useState } from 'react';
import {
  Brain, Activity, Target, TrendingUp, CheckCircle2,
  Settings, RefreshCw, Download, AlertTriangle, Shield, LineChart as LineChartIcon,
  Play, Pause, Sliders, Save, Info
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { mlModelMetrics } from '../../data/mockData';

export default function MLModelTab() {
  const [isTraining, setIsTraining] = useState(false);
  const [selectedThreshold, setSelectedThreshold] = useState(mlModelMetrics.riskThresholds);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const performanceMetrics = [
    { label: 'Accuracy', value: mlModelMetrics.accuracy, icon: Target, color: 'purple', description: 'Overall correctness of predictions' },
    { label: 'Precision', value: mlModelMetrics.precision, icon: CheckCircle2, color: 'green', description: 'True positives / All positive predictions' },
    { label: 'Recall', value: mlModelMetrics.recall, icon: Shield, color: 'blue', description: 'True positives / All actual positives' },
    { label: 'F1 Score', value: mlModelMetrics.f1Score, icon: Activity, color: 'pink', description: 'Harmonic mean of precision and recall' }
  ];

  const errorMetrics = [
    { label: 'False Positive Rate', value: mlModelMetrics.falsePositiveRate, desc: 'Legitimate flagged as fraud', color: 'yellow' },
    { label: 'False Negative Rate', value: mlModelMetrics.falseNegativeRate, desc: 'Fraud missed by model', color: 'red' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Brain className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">ML Model Performance</h2>
            <p className="text-gray-400 mt-1">Monitor and optimize fraud detection model</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isTraining
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isTraining ? (
              <>
                <Pause className="w-4 h-4" />
                Training...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Training
              </>
            )}
          </button>
          <button className="glass-button p-2 rounded-xl text-gray-400 hover:text-white">
            <Download className="w-5 h-5" />
          </button>
          <button className="glass-button p-2 rounded-xl text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model Info Banner */}
      <div className="glass-card p-4 border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Model Active: {mlModelMetrics.currentVersion}</p>
              <p className="text-sm text-gray-400">Last updated: {formatDate(mlModelMetrics.lastUpdated)}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{(mlModelMetrics.totalPredictions / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-gray-400">Total Predictions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{mlModelMetrics.fraudsCaught.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Frauds Caught</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{mlModelMetrics.fraudsMissed.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Frauds Missed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{mlModelMetrics.avgResponseTime}ms</p>
              <p className="text-xs text-gray-400">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <div key={metric.label} className={`glass-card glass-glow-${metric.color} p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${
                  metric.color === 'purple' ? 'from-purple-500 to-purple-400' :
                  metric.color === 'green' ? 'from-green-500 to-green-400' :
                  metric.color === 'blue' ? 'from-blue-500 to-blue-400' : 'from-pink-500 to-pink-400'
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Performance */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-purple-400" />
            Historical Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mlModelMetrics.historicalPerformance}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="version" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[85, 100]} stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#a855f7" 
                  fillOpacity={1} 
                  fill="url(#colorAccuracy)" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">Model accuracy improved by</span>
            <span className="text-green-400 font-semibold">+6.5%</span>
            <span className="text-gray-400">since v2.0.0</span>
          </div>
        </div>

        {/* Error Rates */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Error Analysis
          </h3>
          <div className="space-y-4">
            {errorMetrics.map((metric) => (
              <div key={metric.label} className={`p-4 rounded-xl ${
                metric.color === 'yellow' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`font-semibold ${metric.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {metric.label}
                    </p>
                    <p className="text-xs text-gray-400">{metric.desc}</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{metric.value}%</p>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${metric.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${metric.value * 5}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Industry Benchmark</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your false positive rate of {mlModelMetrics.falsePositiveRate}% is below industry average of 5%.
                    False negative rate at {mlModelMetrics.falseNegativeRate}% is competitive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Threshold Configuration */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Risk Threshold Configuration
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors text-sm font-medium">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(selectedThreshold).map(([level, range]) => {
            const colors = {
              low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', bar: 'bg-green-500' },
              medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', bar: 'bg-yellow-500' },
              high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', bar: 'bg-orange-500' },
              critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', bar: 'bg-red-500' }
            };
            const color = colors[level as keyof typeof colors];
            
            return (
              <div key={level} className={`p-4 rounded-xl ${color.bg} border ${color.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold ${color.text} capitalize`}>{level}</span>
                  <span className="text-white font-medium">{range.min} - {range.max}</span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full ${color.bar}`}
                    style={{ left: `${range.min}%`, width: `${range.max - range.min}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <input
                    type="number"
                    value={range.min}
                    onChange={(e) => setSelectedThreshold(prev => ({
                      ...prev,
                      [level]: { ...range, min: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-16 glass-input px-2 py-1 rounded text-center text-sm text-white"
                    min="0"
                    max="100"
                  />
                  <input
                    type="number"
                    value={range.max}
                    onChange={(e) => setSelectedThreshold(prev => ({
                      ...prev,
                      [level]: { ...range, max: parseInt(e.target.value) || 100 }
                    }))}
                    className="w-16 glass-input px-2 py-1 rounded text-center text-sm text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Range Visualization */}
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-2">Risk Score Scale (0-100)</p>
          <div className="relative h-8 rounded-xl overflow-hidden flex">
            <div className="flex-1 bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center">
              <span className="text-xs font-medium text-white">Low</span>
            </div>
            <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center">
              <span className="text-xs font-medium text-white">Medium</span>
            </div>
            <div className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center">
              <span className="text-xs font-medium text-white">High</span>
            </div>
            <div className="flex-1 bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center">
              <span className="text-xs font-medium text-white">Critical</span>
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0</span>
            <span>30</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Training Progress (shown when training) */}
      {isTraining && (
        <div className="glass-card p-5 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
              Model Training in Progress
            </h3>
            <button
              onClick={() => setIsTraining(false)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50 text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              Cancel Training
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Training Progress</span>
                <span className="text-white">67%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '67%' }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Epoch</p>
                <p className="text-lg font-bold text-white">23/50</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Training Loss</p>
                <p className="text-lg font-bold text-green-400">0.0234</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">ETA</p>
                <p className="text-lg font-bold text-white">~12 min</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}