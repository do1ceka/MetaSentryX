import { useState } from 'react';
import { Activity, Users, TrendingUp, AlertTriangle, Plus, FileText, Mic, Eye, Calendar, Pill } from 'lucide-react';
import { VitalSigns, Patient, Appointment, Prescription } from '../../types';
import { mockPatients, mockVitals, mockAppointments, mockPrescriptions } from '../../lib/mock-data';
import { predictHealthRisk } from '../../lib/ai-prediction';
import { VitalsForm } from '../VitalsForm';
import { PatientCard } from '../PatientCard';
import { RiskChart } from '../RiskChart';
import { VoiceAssistant } from '../VoiceAssistant';
import { DigitalTwin } from '../DigitalTwin';
import { formatDate } from '../../lib/utils';

export function DoctorDashboard() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [vitals, setVitals] = useState<VitalSigns[]>(mockVitals);
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'patients' | 'appointments' | 'prescriptions'>('overview');

  const handleVitalsSubmit = (newVitals: Omit<VitalSigns, 'id' | 'recorded_at'>) => {
    const vitalsWithId: VitalSigns = {
      ...newVitals,
      id: Date.now().toString(),
      recorded_at: new Date().toISOString(),
    };
    setVitals([...vitals, vitalsWithId]);
    setShowVitalsForm(false);
  };

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'record_vitals':
        setShowVitalsForm(true);
        break;
      case 'show_patients':
        setActiveView('patients');
        break;
      case 'show_high_risk':
        setActiveView('patients');
        // Filter to high-risk patients would be implemented here
        break;
      case 'generate_report':
        generateReport();
        break;
      default:
        break;
    }
  };

  const generateReport = () => {
    // Simulate report generation
    const reportData = {
      totalPatients: patients.length,
      highRiskPatients: getHighRiskPatients().length,
      vitalsRecorded: vitals.length,
      timestamp: new Date().toISOString()
    };
    
    console.log('Generating report:', reportData);
    // In a real app, this would generate a PDF or send to a reporting service
    alert('Medical report generated successfully!');
  };

  const getPatientRisk = (patientId: string) => {
    const patientVitals = vitals.filter(v => v.patient_id === patientId);
    if (patientVitals.length === 0) return null;
    
    const latestVitals = patientVitals[patientVitals.length - 1];
    return predictHealthRisk(latestVitals);
  };

  const getHighRiskPatients = () => {
    return patients.filter(p => {
      const risk = getPatientRisk(p.id);
      return risk?.riskLevel === 'high';
    });
  };

  const getTodaysAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      new Date(apt.date).toDateString() === today && apt.status === 'scheduled'
    );
  };

  const highRiskPatients = getHighRiskPatients();
  const todaysAppointments = getTodaysAppointments();

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'text-cyan-400',
      change: '+3 this week'
    },
    {
      title: 'High Risk',
      value: highRiskPatients.length,
      icon: AlertTriangle,
      color: 'text-red-400',
      change: '-1 from yesterday'
    },
    {
      title: 'Vitals Recorded',
      value: vitals.length,
      icon: Activity,
      color: 'text-green-400',
      change: '+12 today'
    },
    {
      title: 'Today\'s Appointments',
      value: todaysAppointments.length,
      icon: Calendar,
      color: 'text-purple-400',
      change: '3 remaining'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            Doctor Dashboard
          </h1>
          <p className="text-cyan-300/70 mt-2">
            AI-powered patient monitoring and healthcare management
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-cyan-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div>Last Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
            className={`cyber-button flex items-center space-x-2 ${showVoiceAssistant ? 'bg-cyan-600' : ''}`}
          >
            <Mic className="w-5 h-5" />
            <span>Voice Assistant</span>
          </button>
          <button
            onClick={() => setShowVitalsForm(true)}
            className="cyber-button flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Record Vitals</span>
          </button>
        </div>
      </div>

      {/* Voice Assistant */}
      {showVoiceAssistant && (
        <VoiceAssistant onCommand={handleVoiceCommand} />
      )}

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
                   style={{ width: `${Math.min(100, (stat.value / 20) * 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'overview', label: 'Overview', icon: Activity },
          { key: 'patients', label: 'Patients', icon: Users },
          { key: 'appointments', label: 'Appointments', icon: Calendar },
          { key: 'prescriptions', label: 'Prescriptions', icon: Pill }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeView === tab.key 
                ? 'bg-cyan-600 text-white' 
                : 'text-cyan-300 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* High Risk Alerts */}
      {highRiskPatients.length > 0 && (
        <div className="cyber-border rounded-xl p-6 border-red-400/50 bg-red-900/10">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <h2 className="text-xl font-bold danger-text">Critical Patient Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highRiskPatients.map(patient => {
              const risk = getPatientRisk(patient.id);
              return (
                <div key={patient.id} className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-red-100">{patient.name}</h3>
                      <p className="text-sm text-red-300/70">ID: {patient.medical_id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        CRITICAL
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowDigitalTwin(true);
                        }}
                        className="text-xs bg-cyan-600 text-white px-2 py-1 rounded hover:bg-cyan-700"
                      >
                        View Twin
                      </button>
                    </div>
                  </div>
                  {risk && (
                    <div className="space-y-1">
                      <p className="text-sm text-red-200">
                        Confidence: {(risk.confidence * 100).toFixed(1)}%
                      </p>
                      <div className="text-xs text-red-300/70">
                        {risk.factors.slice(0, 2).map((factor, i) => (
                          <div key={i}>• {factor}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Primary Content */}
        <div className="lg:col-span-2">
          {activeView === 'overview' && (
            <div className="space-y-6">
              <div className="cyber-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-cyan-100 mb-6">Patient Overview</h2>
                <div className="space-y-4">
                  {patients.slice(0, 4).map(patient => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      vitals={vitals.filter(v => v.patient_id === patient.id)}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDigitalTwin(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'patients' && (
            <div className="cyber-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-cyan-100 mb-6">All Patients</h2>
              <div className="space-y-4">
                {patients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    vitals={vitals.filter(v => v.patient_id === patient.id)}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowDigitalTwin(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeView === 'appointments' && (
            <div className="cyber-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-cyan-100 mb-6">Today's Appointments</h2>
              <div className="space-y-4">
                {todaysAppointments.map(appointment => {
                  const patient = patients.find(p => p.id === appointment.patient_id);
                  return (
                    <div key={appointment.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-cyan-100">{patient?.name}</h3>
                          <p className="text-sm text-cyan-300/70">{appointment.reason}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-100">
                            {new Date(appointment.date).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-cyan-300/70">
                            {appointment.duration} min
                          </div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-cyan-300/50 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === 'prescriptions' && (
            <div className="cyber-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-cyan-100 mb-6">Recent Prescriptions</h2>
              <div className="space-y-4">
                {prescriptions.map(prescription => {
                  const patient = patients.find(p => p.id === prescription.patient_id);
                  return (
                    <div key={prescription.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-cyan-100">{patient?.name}</h3>
                          <p className="text-sm text-cyan-300/70">{prescription.medication}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-100">{prescription.dosage}</div>
                          <div className="text-xs text-cyan-300/70">
                            Qty: {prescription.quantity} • Refills: {prescription.refills}
                          </div>
                        </div>
                      </div>
                      {prescription.instructions && (
                        <p className="text-xs text-cyan-300/50 mt-2">{prescription.instructions}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Risk Analysis</h2>
            <RiskChart patients={patients} vitals={vitals} />
          </div>

          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowVitalsForm(true)}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Record Vitals</span>
              </button>
              <button 
                onClick={generateReport}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
              <button 
                onClick={() => setActiveView('appointments')}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>View Schedule</span>
              </button>
              <button 
                onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                <Mic className="w-4 h-4" />
                <span>Voice Commands</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showVitalsForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-border rounded-xl p-6 max-w-md w-full mx-4">
            <VitalsForm
              patients={patients}
              onSubmit={handleVitalsSubmit}
              onCancel={() => setShowVitalsForm(false)}
            />
          </div>
        </div>
      )}

      {showDigitalTwin && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cyber-border rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-100">Digital Twin - {selectedPatient.name}</h2>
              <button
                onClick={() => setShowDigitalTwin(false)}
                className="text-cyan-400 hover:text-cyan-300 text-2xl"
              >
                ×
              </button>
            </div>
            <DigitalTwin 
              patient={selectedPatient} 
              vitals={vitals.filter(v => v.patient_id === selectedPatient.id)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}