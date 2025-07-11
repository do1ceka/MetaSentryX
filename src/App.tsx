import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { ITDashboard } from './components/dashboards/ITDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-100 font-mono">Initializing MetaSentryX...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      case 'it':
        return <ITDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;