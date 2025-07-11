import { useState } from 'react';
import { Users, Activity, Shield, TrendingUp, Settings, UserPlus, Database, Globe, BarChart3, FileText, Download, Upload } from 'lucide-react';
import { User, SystemLog, Patient, VitalSigns } from '../../types';
import { mockUsers, mockLogs, mockPatients, mockVitals } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';

export function AdminDashboard() {
  const [users] = useState<User[]>(mockUsers);
  const [logs] = useState<SystemLog[]>(mockLogs);
  const [patients] = useState<Patient[]>(mockPatients);
  const [vitals] = useState<VitalSigns[]>(mockVitals);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'system'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const systemHealth = {
    database: 'Optimal',
    api: 'Operational',
    security: 'Secure',
    backup: 'Active',
    uptime: '99.9%'
  };

  const generateSystemReport = () => {
    const reportData = {
      totalUsers: users.length,
      totalPatients: patients.length,
      totalVitals: vitals.length,
      systemHealth,
      timestamp: new Date().toISOString()
    };
    console.log('System Report:', reportData);
    alert('System report generated successfully!');
  };

  const exportData = () => {
    alert('Data export initiated. Download will begin shortly.');
  };

  const importData = () => {
    alert('Data import wizard opened. Please select your data files.');
  };

  const createUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-cyan-400',
      change: '+3 this week',
      trend: 'up'
    },
    {
      title: 'Active Sessions',
      value: '24',
      icon: Activity,
      color: 'text-green-400',
      change: '+8 from yesterday',
      trend: 'up'
    },
    {
      title: 'Security Score',
      value: '94%',
      icon: Shield,
      color: 'text-purple-400',
      change: '+2% this month',
      trend: 'up'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: TrendingUp,
      color: 'text-blue-400',
      change: 'Stable',
      trend: 'stable'
    },
  ];

  const roleColors = {
    doctor: 'text-blue-400 bg-blue-900/20 border-blue-400/30',
    patient: 'text-green-400 bg-green-900/20 border-green-400/30',
    it: 'text-purple-400 bg-purple-900/20 border-purple-400/30',
    admin: 'text-red-400 bg-red-900/20 border-red-400/30',
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            System Administration
          </h1>
          <p className="text-cyan-300/70 mt-2">
            Complete system oversight and user management for MetaSentryX
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-cyan-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
            <div>Active Users: {users.filter(u => u.role !== 'admin').length}</div>
            <div>Last Backup: 2 hours ago</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={createUser}
            className="cyber-button flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
          <button
            onClick={generateSystemReport}
            className="cyber-button flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
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
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs">{getTrendIcon(stat.trend)}</span>
                  <span className="text-xs text-cyan-300/50">{stat.change}</span>
                </div>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')} transition-all duration-1000`}
                   style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? stat.value : 75))}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'overview', label: 'System Overview', icon: TrendingUp },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 },
          { key: 'system', label: 'System Config', icon: Settings }
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

      {/* User Distribution */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-6">User Distribution by Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(usersByRole).map(([role, count]) => (
            <div key={role} className={`rounded-lg p-4 border ${roleColors[role as keyof typeof roleColors]} hover:border-opacity-60 transition-colors`}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{count}</div>
                <div className="text-sm uppercase font-medium mb-2">{role}s</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${roleColors[role as keyof typeof roleColors].split(' ')[0].replace('text-', 'bg-')} transition-all duration-1000`}
                       style={{ width: `${(count / users.length) * 100}%` }}></div>
                </div>
                <div className="text-xs text-cyan-300/50 mt-1">
                  {((count / users.length) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Primary Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* System Status */}
              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-100 mb-3">Operational Systems</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-300/70">Database:</span>
                        <span className="text-green-400 font-semibold">{systemHealth.database}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/70">API Services:</span>
                        <span className="text-green-400 font-semibold">{systemHealth.api}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/70">Security:</span>
                        <span className="text-green-400 font-semibold">{systemHealth.security}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/70">Backup:</span>
                        <span className="text-green-400 font-semibold">{systemHealth.backup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/70">Uptime:</span>
                        <span className="text-green-400 font-semibold">{systemHealth.uptime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-3">Recent Activities</h4>
                    <div className="space-y-2 text-sm text-blue-300/70">
                      <div>• System backup completed successfully</div>
                      <div>• Security patches applied</div>
                      <div>• Database optimization performed</div>
                      <div>• User access logs reviewed</div>
                      <div>• Performance metrics updated</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">Recent System Activity</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {logs.slice(0, 8).map(log => (
                    <div key={log.id} className="bg-gray-800/30 rounded-lg p-3 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-cyan-100">{log.action}</span>
                        <span className="text-xs text-cyan-300/70">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-300/70 mb-1">{log.details}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-cyan-400 font-mono">User: {log.user_id}</span>
                        <span className="text-cyan-400 font-mono">IP: {log.ip_address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cyan-100">User Management</h2>
                <button
                  onClick={createUser}
                  className="cyber-button flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20 hover:border-cyan-300/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-cyan-100">{user.name}</h3>
                        <p className="text-sm text-cyan-300/70">{user.email}</p>
                        {user.department && (
                          <p className="text-xs text-cyan-300/50">{user.department}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                        <button
                          onClick={() => editUser(user)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-cyan-300/70">
                      <div>
                        <span>ID: {user.id}</span>
                      </div>
                      <div>
                        <span>Joined: {formatDate(user.created_at)}</span>
                      </div>
                      {user.phone && (
                        <div>
                          <span>Phone: {user.phone}</span>
                        </div>
                      )}
                      {user.license_number && (
                        <div>
                          <span>License: {user.license_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">System Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-100 mb-3">User Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Daily Active Users:</span>
                        <span className="text-cyan-100 font-semibold">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Weekly Active Users:</span>
                        <span className="text-cyan-100 font-semibold">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Average Session Time:</span>
                        <span className="text-cyan-100 font-semibold">45 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Total Sessions Today:</span>
                        <span className="text-cyan-100 font-semibold">67</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-100 mb-3">System Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Response Time:</span>
                        <span className="text-green-400 font-semibold">120ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Error Rate:</span>
                        <span className="text-green-400 font-semibold">0.02%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">CPU Usage:</span>
                        <span className="text-yellow-400 font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Memory Usage:</span>
                        <span className="text-yellow-400 font-semibold">62%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">Data Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{patients.length}</div>
                    <div className="text-sm text-blue-300/70">Total Patients</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">{vitals.length}</div>
                    <div className="text-sm text-green-300/70">Vitals Recorded</div>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">{logs.length}</div>
                    <div className="text-sm text-purple-300/70">System Events</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="cyber-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">System Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Database className="w-6 h-6 text-blue-400" />
                      <h4 className="font-semibold text-cyan-100">Database</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Status:</span>
                        <span className="text-green-400">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Storage:</span>
                        <span className="text-cyan-100">4.2 GB / 50 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Connections:</span>
                        <span className="text-cyan-100">24 / 200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Last Backup:</span>
                        <span className="text-cyan-100">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="w-6 h-6 text-purple-400" />
                      <h4 className="font-semibold text-cyan-100">Security</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Firewall:</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Encryption:</span>
                        <span className="text-green-400">AES-256</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">SSL Certificate:</span>
                        <span className="text-green-400">Valid</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Last Security Scan:</span>
                        <span className="text-cyan-100">1 hour ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Globe className="w-6 h-6 text-green-400" />
                      <h4 className="font-semibold text-cyan-100">Network</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Uptime:</span>
                        <span className="text-green-400">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Bandwidth:</span>
                        <span className="text-cyan-100">125 Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Latency:</span>
                        <span className="text-cyan-100">8ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">CDN Status:</span>
                        <span className="text-green-400">Operational</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="w-6 h-6 text-orange-400" />
                      <h4 className="font-semibold text-cyan-100">Monitoring</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Health Checks:</span>
                        <span className="text-green-400">Passing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Alerts:</span>
                        <span className="text-cyan-100">0 active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Log Retention:</span>
                        <span className="text-cyan-100">90 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300/70">Metrics Collection:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={createUser}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button 
                onClick={generateSystemReport}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>System Report</span>
              </button>
              <button 
                onClick={exportData}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button 
                onClick={importData}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </button>
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>System Config</span>
              </button>
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Backup Data</span>
              </button>
            </div>
          </div>

          {/* System Alerts */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-100 text-sm font-medium">System Healthy</span>
                </div>
                <p className="text-xs text-green-300/70">All systems operating normally</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm font-medium">Backup Completed</span>
                </div>
                <p className="text-xs text-blue-300/70">Daily backup finished successfully</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-100 text-sm font-medium">Update Available</span>
                </div>
                <p className="text-xs text-yellow-300/70">Security patch ready for installation</p>
              </div>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-300/70">CPU</span>
                  <span className="text-cyan-100">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 bg-blue-400 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-300/70">Memory</span>
                  <span className="text-cyan-100">62%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 bg-green-400 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-300/70">Storage</span>
                  <span className="text-cyan-100">28%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 bg-purple-400 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-300/70">Network</span>
                  <span className="text-cyan-100">15%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 bg-orange-400 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-border rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-100">
                {selectedUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-cyan-400 hover:text-cyan-300 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
                <input
                  type="text"
                  className="cyber-input w-full"
                  placeholder="Enter full name"
                  defaultValue={selectedUser?.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Email</label>
                <input
                  type="email"
                  className="cyber-input w-full"
                  placeholder="Enter email address"
                  defaultValue={selectedUser?.email || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Role</label>
                <select className="cyber-input w-full" defaultValue={selectedUser?.role || ''}>
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="it">IT Admin</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Department</label>
                <input
                  type="text"
                  className="cyber-input w-full"
                  placeholder="Enter department"
                  defaultValue={selectedUser?.department || ''}
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button className="cyber-button flex-1">
                  {selectedUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}