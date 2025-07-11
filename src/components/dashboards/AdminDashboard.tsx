import React, { useState } from 'react';
import { Users, Activity, Shield, TrendingUp, Settings, UserPlus, Database, Globe } from 'lucide-react';
import { User, SystemLog } from '../../types';
import { mockUsers, mockLogs } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';

export function AdminDashboard() {
  const [users] = useState<User[]>(mockUsers);
  const [logs] = useState<SystemLog[]>(mockLogs);

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-cyan-400',
    },
    {
      title: 'Active Sessions',
      value: '12',
      icon: Activity,
      color: 'text-green-400',
    },
    {
      title: 'Security Score',
      value: '94%',
      icon: Shield,
      color: 'text-purple-400',
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
  ];

  const roleColors = {
    doctor: 'text-blue-400 bg-blue-900/20 border-blue-400/30',
    patient: 'text-green-400 bg-green-900/20 border-green-400/30',
    it: 'text-purple-400 bg-purple-900/20 border-purple-400/30',
    admin: 'text-red-400 bg-red-900/20 border-red-400/30',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            Admin Dashboard
          </h1>
          <p className="text-cyan-300/70 mt-2">
            System overview and user management
          </p>
        </div>
        <button className="cyber-button flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Add User</span>
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

      {/* User Distribution */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-6">User Distribution by Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(usersByRole).map(([role, count]) => (
            <div key={role} className={`rounded-lg p-4 border ${roleColors[role as keyof typeof roleColors]}`}>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{count}</div>
                <div className="text-sm uppercase font-medium">{role}s</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="cyber-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-100">User Management</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-cyan-100">{user.name}</h3>
                    <p className="text-sm text-cyan-300/70">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-cyan-300/70">
                  <span>ID: {user.id}</span>
                  <span>Joined: {formatDate(user.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="cyber-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-100">Recent Activity</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map(log => (
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

      {/* System Configuration */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-6">System Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
            <div className="flex items-center space-x-3 mb-3">
              <Database className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold text-cyan-100">Database</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Status:</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Storage:</span>
                <span className="text-cyan-100">2.4 GB / 10 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Connections:</span>
                <span className="text-cyan-100">12 / 100</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold text-cyan-100">Security</h3>
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
                <span className="text-cyan-300/70">Last Scan:</span>
                <span className="text-cyan-100">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-cyan-100">Network</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Uptime:</span>
                <span className="text-green-400">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Bandwidth:</span>
                <span className="text-cyan-100">45 Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Latency:</span>
                <span className="text-cyan-100">12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <Settings className="w-5 h-5" />
            <span>System Config</span>
          </button>
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <Database className="w-5 h-5" />
            <span>Backup Data</span>
          </button>
          <button className="cyber-button flex items-center justify-center space-x-2 py-4">
            <Shield className="w-5 h-5" />
            <span>Security Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
}