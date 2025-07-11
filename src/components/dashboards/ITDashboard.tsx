import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, Server, Play, FileText, Eye, Lock } from 'lucide-react';
import { SystemLog, SecurityEvent } from '../../types';
import { mockLogs, mockSecurityEvents } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';

export function ITDashboard() {
  const [logs] = useState<SystemLog[]>(mockLogs);
  const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [isRunningPenTest, setIsRunningPenTest] = useState(false);
  const [penTestResults, setPenTestResults] = useState<string[]>([]);

  const runPenetrationTest = async () => {
    setIsRunningPenTest(true);
    setPenTestResults([]);

    const testSteps = [
      'Initializing security scan...',
      'Checking network vulnerabilities...',
      'Testing authentication systems...',
      'Analyzing database security...',
      'Scanning for malware signatures...',
      'Evaluating encryption protocols...',
      'Testing firewall configurations...',
      'Generating security report...',
    ];

    for (let i = 0; i < testSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPenTestResults(prev => [...prev, testSteps[i]]);
    }

    // Add final results
    await new Promise(resolve => setTimeout(resolve, 500));
    setPenTestResults(prev => [
      ...prev,
      '✅ Network security: SECURE',
      '✅ Authentication: STRONG',
      '⚠️ Database: MINOR ISSUES DETECTED',
      '✅ Malware scan: CLEAN',
      '✅ Encryption: AES-256 ACTIVE',
      '✅ Firewall: PROPERLY CONFIGURED',
      '📊 Overall Security Score: 94/100',
    ]);

    setIsRunningPenTest(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-400/30';
      case 'error': return 'text-red-400 bg-red-900/20 border-red-400/30';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
      case 'info': return 'text-cyan-400 bg-cyan-900/20 border-cyan-400/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30';
    }
  };

  const getEventSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const stats = [
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: Server,
      color: 'text-green-400',
    },
    {
      title: 'Active Threats',
      value: securityEvents.filter(e => !e.resolved).length,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      title: 'Security Score',
      value: '94/100',
      icon: Shield,
      color: 'text-cyan-400',
    },
    {
      title: 'System Logs',
      value: logs.length,
      icon: Activity,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            IT Security Dashboard
          </h1>
          <p className="text-cyan-300/70 mt-2">
            Monitor system security and run automated penetration tests
          </p>
        </div>
        <button
          onClick={runPenetrationTest}
          disabled={isRunningPenTest}
          className="cyber-button flex items-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>{isRunningPenTest ? 'Running Test...' : 'Run Pen Test'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="cyber-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300/70 text-sm font-medium">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Penetration Test Results */}
      {(isRunningPenTest || penTestResults.length > 0) && (
        <div className="cyber-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-100">Penetration Test Results</h2>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {penTestResults.map((result, index) => (
              <div key={index} className="text-cyan-100 mb-1">
                <span className="text-cyan-400">[{new Date().toLocaleTimeString()}]</span> {result}
              </div>
            ))}
            {isRunningPenTest && (
              <div className="text-cyan-400 animate-pulse">
                <span className="text-cyan-400">[{new Date().toLocaleTimeString()}]</span> Running...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Events */}
        <div className="cyber-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-cyan-100">Security Events</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {securityEvents.map(event => (
              <div key={event.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getEventSeverityColor(event.severity).replace('text-', 'bg-')}`}></div>
                    <span className={`text-sm font-medium uppercase ${getEventSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300/70">
                    {formatDate(event.timestamp)}
                  </div>
                </div>
                <h3 className="font-semibold text-cyan-100 mb-1">
                  {event.event_type.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm text-cyan-300/70 mb-2">{event.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-cyan-400 font-mono">IP: {event.source_ip}</span>
                  <span className={`px-2 py-1 rounded ${event.resolved ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {event.resolved ? 'RESOLVED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="cyber-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-100">System Logs</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className={`rounded-lg p-3 border ${getSeverityColor(log.severity)}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{log.action}</span>
                  <span className="text-xs text-cyan-300/70">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-cyan-300/70 mb-1">{log.details}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono">User: {log.user_id}</span>
                  <span className="font-mono">IP: {log.ip_address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-4">Security Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <Lock className="w-5 h-5" />
            <span>Encrypt Database</span>
          </button>
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <Shield className="w-5 h-5" />
            <span>Update Firewall</span>
          </button>
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}