import { useAuth } from '../contexts/AuthContext';
import { LogOut, Shield, Activity, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Activity className="w-5 h-5" />;
      case 'patient':
        return <Users className="w-5 h-5" />;
      case 'it':
        return <Shield className="w-5 h-5" />;
      case 'admin':
        return <Settings className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-30"></div>
        <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-1 h-24 bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="cyber-border border-b-2 border-cyan-400/30 bg-gray-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-cyan-400 animate-pulse-neon" />
                <h1 className="text-2xl font-cyber font-bold neon-text">
                  MetaSentryX
                </h1>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-cyan-300/70 font-mono">
                  AI-Powered Healthcare Security Platform
                </span>
              </div>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 cyber-border rounded-lg px-3 py-1">
                  {getRoleIcon(user.role)}
                  <span className="text-cyan-100 font-medium">{user.name}</span>
                  <span className="text-xs text-cyan-400 uppercase font-mono">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="cyber-button flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-400/30 bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-cyan-300/70">
              © 2024 MetaSentryX. Advanced Healthcare Security Platform.
            </div>
            <div className="flex items-center space-x-4 text-xs text-cyan-400">
              <span>System Status: </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="success-text">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}