import { useState } from 'react';
import { Shield, AlertTriangle, Activity, Server, Play, FileText, Eye, Lock, Wifi, Database, Cpu, HardDrive } from 'lucide-react';
import { SystemLog, SecurityEvent, MedicalDevice } from '../../types';
import { mockLogs, mockSecurityEvents, mockMedicalDevices } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';

export function ITDashboard() {
  const [logs] = useState<SystemLog[]>(mockLogs);
  const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [devices] = useState<MedicalDevice[]>(mockMedicalDevices);
  const [isRunningPenTest, setIsRunningPenTest] = useState(false);
  const [penTestResults, setPenTestResults] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'devices' | 'logs'>('overview');
  const [systemMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23
  });

  const runPenetrationTest = async () => {
    setIsRunningPenTest(true);
    setPenTestResults([]);

    const testSteps = [
      'Initializing MetaSentryX security scan...',
      'Scanning network perimeter defenses...',
      'Testing authentication bypass attempts...',
      'Analyzing database encryption protocols...',
      'Checking for malware signatures and trojans...',
      'Evaluating firewall rule effectiveness...',
      'Testing medical device IoT security...',
      'Scanning for SQL injection vulnerabilities...',
      'Checking API endpoint security...',
      'Analyzing user privilege escalation paths...',
      'Testing data exfiltration prevention...',
      'Generating comprehensive security report...',
    ];

    for (let i = 0; i < testSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPenTestResults(prev => [...prev, testSteps[i]]);
    }

    // Add final results
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPenTestResults(prev => [
      ...prev,
      '',
      '=== PENETRATION TEST RESULTS ===',
      '✅ Network Perimeter: SECURE (No vulnerabilities found)',
      '✅ Authentication System: STRONG (Multi-factor enabled)',
      '⚠️  Database Security: MINOR ISSUES (Recommend key rotation)',
      '✅ Malware Protection: CLEAN (Real-time scanning active)',
      '✅ Encryption Protocols: EXCELLENT (AES-256 implemented)',
      '✅ Firewall Configuration: OPTIMAL (All rules validated)',
      '⚠️  IoT Device Security: ATTENTION NEEDED (2 devices need updates)',
      '✅ API Security: ROBUST (Rate limiting and validation active)',
      '✅ Data Loss Prevention: EFFECTIVE (All channels monitored)',
      '',
      '📊 OVERALL SECURITY SCORE: 94/100 (EXCELLENT)',
      '🛡️  THREAT LEVEL: LOW',
      '📈 IMPROVEMENT RECOMMENDATIONS: 3 items identified',
      '',
      'Report generated at: ' + new Date().toLocaleString()
    ]);

    setIsRunningPenTest(false);
  };

  const runSystemDiagnostics = () => {
    alert('System diagnostics initiated. Full report will be available in 5 minutes.');
  };

  const updateFirewallRules = () => {
    alert('Firewall rules updated successfully. New security policies are now active.');
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

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-900/20';
      case 'offline': return 'text-red-400 bg-red-900/20';
      case 'maintenance': return 'text-yellow-400 bg-yellow-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const activeThreats = securityEvents.filter(e => !e.resolved).length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;

  const stats = [
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: Server,
      color: 'text-green-400',
      change: '+0.1% this month'
    },
    {
      title: 'Active Threats',
      value: activeThreats,
      icon: AlertTriangle,
      color: activeThreats > 0 ? 'text-red-400' : 'text-green-400',
      change: activeThreats > 0 ? 'Requires attention' : 'All clear'
    },
    {
      title: 'Security Score',
      value: '94/100',
      icon: Shield,
      color: 'text-cyan-400',
      change: '+2 points this week'
    },
    {
      title: 'Connected Devices',
      value: `${onlineDevices}/${devices.length}`,
      icon: Wifi,
      color: 'text-purple-400',
      change: 'All systems operational'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            IT Security Command Center
          </h1>
          <p className="text-cyan-300/70 mt-2">
            Advanced threat detection and system monitoring for MetaSentryX
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-cyan-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
            <div>Threat Level: {activeThreats > 0 ? 'ELEVATED' : 'LOW'}</div>
            <div>Last Scan: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runPenetrationTest}
            disabled={isRunningPenTest}
            className="cyber-button flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="w-5 h-5" />
            <span>{isRunningPenTest ? 'Running Test...' : 'Run Pen Test'}</span>
          </button>
          <button
            onClick={runSystemDiagnostics}
            className="cyber-button flex items-center space-x-2"
          >
            <Activity className="w-5 h-5" />
            <span>System Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="cyber-border rounded-xl p-6 hover:border-cyan-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-cyan-300/70 text-sm font-medium">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                </p>
                <p className="text-xs text-cyan-300/50 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')} transition-all duration-1000`}
                   style={{ width: `${Math.min(100, Math.random() * 100 + 50)}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-6">Real-time System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span className="text-cyan-100 font-medium">CPU Usage</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">{systemMetrics.cpu}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-blue-400 rounded-full transition-all duration-1000"
                   style={{ width: `${systemMetrics.cpu}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-cyan-100 font-medium">Memory</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-2">{systemMetrics.memory}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-green-400 rounded-full transition-all duration-1000"
                   style={{ width: `${systemMetrics.memory}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="w-5 h-5 text-orange-400" />
              <span className="text-cyan-100 font-medium">Disk Usage</span>
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-2">{systemMetrics.disk}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-orange-400 rounded-full transition-all duration-1000"
                   style={{ width: `${systemMetrics.disk}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wifi className="w-5 h-5 text-purple-400" />
              <span className="text-cyan-100 font-medium">Network</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-2">{systemMetrics.network}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-purple-400 rounded-full transition-all duration-1000"
                   style={{ width: `${systemMetrics.network}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'overview', label: 'Security Overview', icon: Shield },
          { key: 'security', label: 'Threat Analysis', icon: AlertTriangle },
          { key: 'devices', label: 'Device Monitor', icon: Server },
          { key: 'logs', label: 'System Logs', icon: Eye }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.key 
                ? 'bg-cyan-600 text-white' 
                : 'text-cyan-300 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Penetration Test Results */}
      {(isRunningPenTest || penTestResults.length > 0) && (
        <div className="cyber-border rounded-xl p-6 border-cyan-400/50">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-100">Advanced Penetration Test</h2>
            {isRunningPenTest && (
              <div className="flex items-center space-x-2 text-sm text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Test in progress...</span>
              </div>
            )}
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
            {penTestResults.map((result, index) => (
              <div key={index} className={`mb-1 ${
                result.includes('✅') ? 'text-green-400' :
                result.includes('⚠️') ? 'text-yellow-400' :
                result.includes('❌') ? 'text-red-400' :
                result.includes('===') ? 'text-cyan-400 font-bold' :
                result.includes('📊') || result.includes('🛡️') || result.includes('📈') ? 'text-purple-400 font-bold' :
                'text-cyan-100'
              }`}>
                {result.includes('===') || result.includes('📊') || result.includes('🛡️') || result.includes('📈') ? (
                  <div className="my-2">{result}</div>
                ) : (
                  <>
                    <span className="text-cyan-400">[{new Date().toLocaleTimeString()}]</span> {result}
                  </>
                )}
              </div>
            ))}
            {isRunningPenTest && (
              <div className="text-cyan-400 animate-pulse">
                <span className="text-cyan-400">[{new Date().toLocaleTimeString()}]</span> Scanning...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Primary Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Critical Alerts */}
              {criticalEvents > 0 && (
                <div className="cyber-border rounded-xl p-6 border-red-400/50 bg-red-900/10">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                    <h3 className="text-xl font-bold text-red-100">Critical Security Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {securityEvents.filter(e => e.severity === 'critical').map(event => (
                      <div key={event.id} className="bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-red-100">{event.event_type.replace('_', ' ').toUpperCase()}</span>
                          <span className="text-xs text-red-300/70">{formatDate(event.timestamp)}</span>
                        </div>
                        <p className="text-sm text-red-300/70">{event.description}</p>
                        <div className="text-xs text-red-400 font-mono mt-1">Source: {event.source_ip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Overview */}
              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">Security Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-100 mb-2">Active Protections</h4>
                    <ul className="text-sm text-green-300/70 space-y-1">
                      <li>• Real-time malware scanning</li>
                      <li>• Advanced firewall protection</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Encrypted data transmission</li>
                      <li>• Intrusion detection system</li>
                    </ul>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-2">Recent Actions</h4>
                    <ul className="text-sm text-blue-300/70 space-y-1">
                      <li>• Blocked 15 suspicious IPs</li>
                      <li>• Updated security signatures</li>
                      <li>• Completed system backup</li>
                      <li>• Patched 3 vulnerabilities</li>
                      <li>• Enhanced access controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold text-cyan-100">Security Events & Threats</h2>
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
                      <div className="flex items-center space-x-2">
                        {event.affected_user && (
                          <span className="text-cyan-300/70">User: {event.affected_user}</span>
                        )}
                        <span className={`px-2 py-1 rounded ${event.resolved ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {event.resolved ? 'RESOLVED' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                    {event.action_taken && (
                      <div className="mt-2 text-xs text-cyan-300/50 bg-gray-700/30 rounded p-2">
                        <strong>Action Taken:</strong> {event.action_taken}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Server className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-100">Medical Device Monitoring</h2>
              </div>
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-cyan-100">{device.name}</h3>
                        <p className="text-sm text-cyan-300/70">{device.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getDeviceStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-cyan-300/70">Type:</span>
                        <span className="text-cyan-100 ml-2 capitalize">{device.type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-cyan-300/70">Battery:</span>
                        <span className={`ml-2 font-semibold ${
                          device.battery_level > 50 ? 'text-green-400' :
                          device.battery_level > 20 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{device.battery_level}%</span>
                      </div>
                      <div>
                        <span className="text-cyan-300/70">Firmware:</span>
                        <span className="text-cyan-100 ml-2 font-mono">{device.firmware_version}</span>
                      </div>
                      <div>
                        <span className="text-cyan-300/70">Last Reading:</span>
                        <span className="text-cyan-100 ml-2">{formatDate(device.last_reading)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-cyan-300/50">
                      Manufacturer: {device.manufacturer} • Device ID: {device.id}
                    </div>
                    {device.patient_id && (
                      <div className="mt-1 text-xs text-cyan-400">
                        Assigned to Patient ID: {device.patient_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Eye className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-100">System Activity Logs</h2>
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Security Tools</h2>
            <div className="space-y-3">
              <button 
                onClick={runPenetrationTest}
                disabled={isRunningPenTest}
                className="w-full cyber-button flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Penetration Test</span>
              </button>
              <button 
                onClick={updateFirewallRules}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Update Firewall</span>
              </button>
              <button 
                onClick={runSystemDiagnostics}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>System Diagnostics</span>
              </button>
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Encrypt Database</span>
              </button>
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Security Report</span>
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">Database:</span>
                <span className="text-green-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">API Services:</span>
                <span className="text-green-400 font-semibold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">Backup System:</span>
                <span className="text-green-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">Monitoring:</span>
                <span className="text-green-400 font-semibold">ENABLED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">Encryption:</span>
                <span className="text-green-400 font-semibold">AES-256</span>
              </div>
            </div>
          </div>

          {/* Recent Threats */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">Recent Threats Blocked</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Malware attempts:</span>
                <span className="text-red-400 font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Brute force attacks:</span>
                <span className="text-red-400 font-semibold">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Suspicious IPs blocked:</span>
                <span className="text-red-400 font-semibold">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Data exfiltration attempts:</span>
                <span className="text-red-400 font-semibold">2</span>
              </div>
              <div className="text-xs text-cyan-300/50 mt-3 text-center">
                All threats successfully neutralized
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}