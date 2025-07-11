import { useState } from 'react';
import { Activity, Users, TrendingUp, AlertTriangle, Plus, FileText } from 'lucide-react';
import { VitalSigns, Patient } from '../../types';
import { mockPatients, mockVitals } from '../../lib/mock-data';
import { predictHealthRisk } from '../../lib/ai-prediction';
import { VitalsForm } from '../VitalsForm';
import { PatientCard } from '../PatientCard';
import { RiskChart } from '../RiskChart';

export function DoctorDashboard() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [vitals, setVitals] = useState<VitalSigns[]>(mockVitals);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  const handleVitalsSubmit = (newVitals: Omit<VitalSigns, 'id' | 'recorded_at'>) => {
    const vitalsWithId: VitalSigns = {
      ...newVitals,
      id: Date.now().toString(),
      recorded_at: new Date().toISOString(),
    };
    setVitals([...vitals, vitalsWithId]);
    setShowVitalsForm(false);
  };

  const getPatientRisk = (patientId: string) => {
    const patientVitals = vitals.filter(v => v.patient_id === patientId);
    if (patientVitals.length === 0) return null;
    
    const latestVitals = patientVitals[patientVitals.length - 1];
    return predictHealthRisk(latestVitals);
  };

  const highRiskPatients = patients.filter(p => {
    const risk = getPatientRisk(p.id);
    return risk?.riskLevel === 'high';
  });

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'text-cyan-400',
    },
    {
      title: 'High Risk',
      value: highRiskPatients.length,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      title: 'Vitals Recorded',
      value: vitals.length,
      icon: Activity,
      color: 'text-green-400',
    },
    {
      title: 'AI Predictions',
      value: vitals.length,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            Doctor Dashboard
          </h1>
          <p className="text-cyan-300/70 mt-2">
            Monitor patients and analyze health risks with AI assistance
          </p>
        </div>
        <button
          onClick={() => setShowVitalsForm(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Vitals</span>
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

      {/* High Risk Alerts */}
      {highRiskPatients.length > 0 && (
        <div className="cyber-border rounded-xl p-6 border-red-400/50">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold danger-text">High Risk Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highRiskPatients.map(patient => {
              const risk = getPatientRisk(patient.id);
              return (
                <div key={patient.id} className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-red-100">{patient.name}</h3>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                      HIGH RISK
                    </span>
                  </div>
                  <p className="text-sm text-red-300/70 mb-2">ID: {patient.medical_id}</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-2">
          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-6">Patient Overview</h2>
            <div className="space-y-4">
              {patients.map(patient => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  vitals={vitals.filter(v => v.patient_id === patient.id)}
                  onClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="space-y-6">
          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Risk Analysis</h2>
            <RiskChart patients={patients} vitals={vitals} />
          </div>

          <div className="cyber-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-cyan-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
              <button className="w-full cyber-button flex items-center justify-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Form Modal */}
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
    </div>
  );
}