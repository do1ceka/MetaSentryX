import { useState } from 'react';
import { Activity, Heart, Thermometer, Droplets, TrendingUp, Calendar, AlertCircle, Pill, FileText, Phone } from 'lucide-react';
import { VitalSigns, Appointment, Prescription } from '../../types';
import { mockVitals, mockAppointments, mockPrescriptions, mockPatients } from '../../lib/mock-data';
import { predictHealthRisk } from '../../lib/ai-prediction';
import { formatDate } from '../../lib/utils';

export function PatientDashboard() {
  const [vitals] = useState<VitalSigns[]>(mockVitals);
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'appointments' | 'prescriptions'>('overview');
  
  // In a real app, this would be filtered by the current patient's ID
  const currentPatientId = '1';
  const currentPatient = mockPatients.find(p => p.id === currentPatientId);
  const patientVitals = vitals.filter(v => v.patient_id === currentPatientId);
  const patientAppointments = appointments.filter(a => a.patient_id === currentPatientId);
  const patientPrescriptions = prescriptions.filter(p => p.patient_id === currentPatientId);
  
  const latestVitals = patientVitals[patientVitals.length - 1];
  const riskPrediction = latestVitals ? predictHealthRisk(latestVitals) : null;

  const vitalCards = [
    {
      title: 'Heart Rate',
      value: latestVitals?.heart_rate || '--',
      unit: 'BPM',
      icon: Heart,
      color: 'text-red-400',
      normal: '60-100',
      status: latestVitals?.heart_rate ? 
        (latestVitals.heart_rate >= 60 && latestVitals.heart_rate <= 100 ? 'normal' : 'abnormal') : 'unknown'
    },
    {
      title: 'Blood Pressure',
      value: latestVitals ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}` : '--',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-400',
      normal: '<120/80',
      status: latestVitals ? 
        (latestVitals.blood_pressure_systolic < 120 && latestVitals.blood_pressure_diastolic < 80 ? 'normal' : 'abnormal') : 'unknown'
    },
    {
      title: 'Temperature',
      value: latestVitals?.temperature.toFixed(1) || '--',
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-400',
      normal: '97-99',
      status: latestVitals?.temperature ? 
        (latestVitals.temperature >= 97 && latestVitals.temperature <= 99 ? 'normal' : 'abnormal') : 'unknown'
    },
    {
      title: 'Oxygen Saturation',
      value: latestVitals?.oxygen_saturation || '--',
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-400',
      normal: '>95',
      status: latestVitals?.oxygen_saturation ? 
        (latestVitals.oxygen_saturation > 95 ? 'normal' : 'abnormal') : 'unknown'
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-900/20 border-red-400/30';
      case 'medium': return 'bg-yellow-900/20 border-yellow-400/30';
      case 'low': return 'bg-green-900/20 border-green-400/30';
      default: return 'bg-gray-900/20 border-gray-400/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'abnormal': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const upcomingAppointments = patientAppointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status === 'scheduled'
  );

  const activePrescriptions = patientPrescriptions.filter(rx => rx.status === 'active');

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">
            Patient Portal
          </h1>
          <p className="text-cyan-300/70 mt-2">
            Welcome back, {currentPatient?.name}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-cyan-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Health Monitoring Active</span>
            </div>
            <div>Last Updated: {latestVitals ? formatDate(latestVitals.recorded_at) : 'No data'}</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="cyber-button flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Contact Doctor</span>
          </button>
          <button className="cyber-button flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Download Records</span>
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      {currentPatient && (
        <div className="cyber-border rounded-xl p-6 bg-gradient-to-r from-gray-900/80 to-gray-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-100 mb-2">Personal Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-cyan-300/70">Age:</span> <span className="text-cyan-100">{currentPatient.age} years</span></div>
                <div><span className="text-cyan-300/70">Gender:</span> <span className="text-cyan-100 capitalize">{currentPatient.gender}</span></div>
                <div><span className="text-cyan-300/70">Blood Type:</span> <span className="text-cyan-100">{currentPatient.blood_type}</span></div>
                <div><span className="text-cyan-300/70">BMI:</span> <span className="text-cyan-100">{currentPatient.bmi}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100 mb-2">Medical Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-cyan-300/70">Medical ID:</span> <span className="text-cyan-100 font-mono">{currentPatient.medical_id}</span></div>
                <div><span className="text-cyan-300/70">Insurance:</span> <span className="text-cyan-100">{currentPatient.insurance}</span></div>
                <div><span className="text-cyan-300/70">Emergency Contact:</span> <span className="text-cyan-100">{currentPatient.emergency_contact}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100 mb-2">Conditions & Allergies</h3>
              <div className="space-y-2 text-sm">
                {currentPatient.chronic_conditions && currentPatient.chronic_conditions.length > 0 && (
                  <div>
                    <span className="text-cyan-300/70">Conditions:</span>
                    <div className="mt-1 space-y-1">
                      {currentPatient.chronic_conditions.map((condition, index) => (
                        <div key={index} className="text-yellow-400 text-xs">• {condition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {currentPatient.allergies && currentPatient.allergies.length > 0 && (
                  <div>
                    <span className="text-cyan-300/70">Allergies:</span>
                    <div className="mt-1 space-y-1">
                      {currentPatient.allergies.map((allergy, index) => (
                        <div key={index} className="text-red-400 text-xs">• {allergy}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'overview', label: 'Health Overview', icon: TrendingUp },
          { key: 'vitals', label: 'Vital Signs', icon: Activity },
          { key: 'appointments', label: 'Appointments', icon: Calendar },
          { key: 'prescriptions', label: 'Prescriptions', icon: Pill }
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

      {/* Health Status Overview */}
      {activeTab === 'overview' && riskPrediction && (
        <div className={`cyber-border rounded-xl p-6 ${getRiskBgColor(riskPrediction.riskLevel)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-8 h-8 ${getRiskColor(riskPrediction.riskLevel)}`} />
              <div>
                <h2 className="text-xl font-bold text-cyan-100">Health Status Assessment</h2>
                <p className="text-cyan-300/70 text-sm">AI-powered risk analysis based on latest vitals</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRiskColor(riskPrediction.riskLevel)} uppercase`}>
                {riskPrediction.riskLevel} Risk
              </div>
              <div className="text-sm text-cyan-300/70">
                {(riskPrediction.confidence * 100).toFixed(1)}% confidence
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-cyan-100 mb-3">Risk Factors Identified</h3>
              <div className="space-y-2">
                {riskPrediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-cyan-300/70">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 mb-3">Personalized Recommendations</h3>
              <div className="space-y-2">
                {riskPrediction.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-4 h-4 bg-green-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    <span className="text-cyan-300/70">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vital Signs Grid */}
      {(activeTab === 'overview' || activeTab === 'vitals') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vitalCards.map((card, index) => (
            <div key={index} className="cyber-border rounded-xl p-6 hover:border-cyan-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`w-8 h-8 ${card.color}`} />
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-100">
                    {card.value}
                  </div>
                  <div className="text-sm text-cyan-300/70">{card.unit}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-cyan-100">{card.title}</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-cyan-300/70">Normal: {card.normal}</span>
                  <span className={`font-medium uppercase ${getStatusColor(card.status)}`}>
                    {card.status}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    card.status === 'normal' ? 'bg-green-400' : 
                    card.status === 'abnormal' ? 'bg-red-400' : 'bg-gray-400'
                  } transition-all duration-1000`}
                       style={{ width: card.status === 'normal' ? '100%' : '60%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content based on active tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'vitals' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Activity className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-100">Vital Signs History</h2>
              </div>
              
              {patientVitals.length > 0 ? (
                <div className="space-y-4">
                  {patientVitals.slice(-10).reverse().map((vital, index) => (
                    <div key={vital.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-cyan-300/70">
                          {formatDate(vital.recorded_at)}
                        </div>
                        <div className="text-xs text-cyan-400 font-mono">
                          Recorded by: Dr. {vital.recorded_by}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-cyan-300/70">HR:</span>
                          <span className="text-cyan-100 ml-2 font-semibold">{vital.heart_rate} BPM</span>
                        </div>
                        <div>
                          <span className="text-cyan-300/70">BP:</span>
                          <span className="text-cyan-100 ml-2 font-semibold">
                            {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                          </span>
                        </div>
                        <div>
                          <span className="text-cyan-300/70">Temp:</span>
                          <span className="text-cyan-100 ml-2 font-semibold">{vital.temperature.toFixed(1)}°F</span>
                        </div>
                        <div>
                          <span className="text-cyan-300/70">O2:</span>
                          <span className="text-cyan-100 ml-2 font-semibold">{vital.oxygen_saturation}%</span>
                        </div>
                      </div>
                      {vital.notes && (
                        <div className="text-xs text-cyan-300/50 bg-gray-700/30 rounded p-2">
                          <strong>Notes:</strong> {vital.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                  <p className="text-cyan-300/70">No vital signs recorded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-100">Upcoming Appointments</h2>
              </div>
              
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-cyan-100">{appointment.reason}</h3>
                          <p className="text-sm text-cyan-300/70 capitalize">{appointment.type} appointment</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-100">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-cyan-100">
                            {new Date(appointment.date).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-cyan-300/70">
                            Duration: {appointment.duration} min
                          </div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-cyan-300/50 bg-gray-700/30 rounded p-2 mt-2">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                  <p className="text-cyan-300/70">No upcoming appointments</p>
                  <button className="cyber-button mt-4">Schedule Appointment</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="cyber-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Pill className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-100">Active Prescriptions</h2>
              </div>
              
              {activePrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {activePrescriptions.map(prescription => (
                    <div key={prescription.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-cyan-100">{prescription.medication}</h3>
                          <p className="text-sm text-cyan-300/70">{prescription.dosage}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-100">
                            Qty: {prescription.quantity}
                          </div>
                          <div className="text-xs text-cyan-300/70">
                            Refills: {prescription.refills} remaining
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-cyan-300/70 mb-2">
                        Prescribed: {formatDate(prescription.prescribed_date)}
                      </div>
                      {prescription.instructions && (
                        <div className="text-xs text-cyan-300/50 bg-gray-700/30 rounded p-2">
                          <strong>Instructions:</strong> {prescription.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pill className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                  <p className="text-cyan-300/70">No active prescriptions</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Total Visits:</span>
                <span className="text-cyan-100 font-semibold">{patientVitals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Upcoming Appointments:</span>
                <span className="text-cyan-100 font-semibold">{upcomingAppointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Active Prescriptions:</span>
                <span className="text-cyan-100 font-semibold">{activePrescriptions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">Last Visit:</span>
                <span className="text-cyan-100 font-semibold">
                  {latestVitals ? new Date(latestVitals.recorded_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4">Personalized Health Tips</h3>
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                <h4 className="font-medium text-blue-100 mb-1 text-sm">Stay Hydrated</h4>
                <p className="text-xs text-blue-300/70">
                  Drink at least 8 glasses of water daily to maintain optimal health.
                </p>
              </div>
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                <h4 className="font-medium text-green-100 mb-1 text-sm">Regular Exercise</h4>
                <p className="text-xs text-green-300/70">
                  Aim for 30 minutes of moderate exercise most days of the week.
                </p>
              </div>
              <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
                <h4 className="font-medium text-purple-100 mb-1 text-sm">Quality Sleep</h4>
                <p className="text-xs text-purple-300/70">
                  Get 7-9 hours of quality sleep each night for optimal recovery.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="cyber-border rounded-xl p-6 border-red-400/30">
            <h3 className="text-lg font-semibold text-red-100 mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Call Emergency: 911
              </button>
              <button className="w-full cyber-button">
                Contact Doctor
              </button>
              <div className="text-xs text-cyan-300/50 text-center">
                For non-emergency medical questions, use the contact doctor button
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}