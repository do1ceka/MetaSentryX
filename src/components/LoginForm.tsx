import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    { role: 'Doctor', email: 'dr.smith@hospital.com', password: 'password123' },
    { role: 'Patient', email: 'john.doe@email.com', password: 'password123' },
    { role: 'IT Admin', email: 'it.admin@hospital.com', password: 'password123' },
    { role: 'Admin', email: 'admin@hospital.com', password: 'password123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 p-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-cyan-400 animate-pulse-neon" />
          </div>
          <h1 className="text-4xl font-cyber font-bold neon-text mb-2">
            MetaSentryX
          </h1>
          <p className="text-cyan-300/70 font-mono text-sm">
            AI-Powered Healthcare Security Platform
          </p>
        </div>

        {/* Login Form */}
        <div className="cyber-border rounded-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-100 mb-2">
              Secure Access Portal
            </h2>
            <p className="text-cyan-300/70 text-sm">
              Enter your credentials to access the system
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
                  className="cyber-input w-full pl-10"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input w-full pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Access System'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="cyber-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 text-center">
            Demo Credentials
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
                className="text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-cyan-400/30 hover:border-cyan-400/60"
              >
                <div className="font-medium text-cyan-100">{cred.role}</div>
                <div className="text-sm text-cyan-300/70 font-mono">{cred.email}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-cyan-300/50 mt-3 text-center">
            Click any role to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  );
}