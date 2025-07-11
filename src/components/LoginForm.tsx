import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const demoCredentials = [
    { 
      role: 'Doctor', 
      email: 'dr.smith@hospital.com', 
      password: 'password123',
      description: 'Cardiology Department - Full patient access'
    },
    { 
      role: 'Patient', 
      email: 'john.doe@email.com', 
      password: 'password123',
      description: 'Personal health dashboard and records'
    },
    { 
      role: 'IT Admin', 
      email: 'it.admin@hospital.com', 
      password: 'password123',
      description: 'Security monitoring and system management'
    },
    { 
      role: 'System Admin', 
      email: 'admin@hospital.com', 
      password: 'password123',
      description: 'Full system administration and user management'
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 p-8">
        {/* Enhanced Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-cyan-400 animate-pulse-neon" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400/30 rounded-full animate-spin"></div>
            </div>
          </div>
          <h1 className="text-4xl font-cyber font-bold neon-text mb-2">
            MetaSentryX
          </h1>
          <p className="text-cyan-300/70 font-mono text-sm mb-1">
            AI-Powered Healthcare Security Platform
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-cyan-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Status: OPERATIONAL</span>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="cyber-border rounded-xl p-8 space-y-6 bg-gray-900/90 backdrop-blur-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-100 mb-2">
              Secure Access Portal
            </h2>
            <p className="text-cyan-300/70 text-sm">
              Multi-factor authentication required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input w-full pl-10 pr-4"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input w-full pl-10 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access System'
              )}
            </button>
          </form>

          {/* Security Features */}
          <div className="text-center text-xs text-cyan-300/50 space-y-1">
            <div>🔒 256-bit AES Encryption</div>
            <div>🛡️ Multi-layer Security Protocol</div>
            <div>📊 Real-time Threat Monitoring</div>
          </div>
        </div>

        {/* Enhanced Demo Credentials */}
        <div className="cyber-border rounded-xl p-6 bg-gray-900/80 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 text-center flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Demo Access Credentials</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
                className="text-left p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-cyan-100">{cred.role}</div>
                  <div className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">
                    DEMO
                  </div>
                </div>
                <div className="text-sm text-cyan-300/70 font-mono mb-1">{cred.email}</div>
                <div className="text-xs text-cyan-300/50">{cred.description}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-cyan-300/50">
              Click any role to auto-fill credentials • Password: password123
            </p>
          </div>
        </div>

        {/* System Information */}
        <div className="text-center text-xs text-cyan-300/40 space-y-1">
          <div>MetaSentryX v2.1.0 • Build 2024.03.04</div>
          <div>© 2024 MetaSentryX Healthcare Security Solutions</div>
        </div>
      </div>
    </div>
  );
}