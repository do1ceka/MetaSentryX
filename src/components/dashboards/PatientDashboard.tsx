import { useState } from 'react';
import { Activity, Heart, Thermometer, Droplets, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { VitalSigns } from '../../types';
import { mockVitals } from '../../lib/mock-data';
import { predictHealthRisk } from '../../lib/ai-prediction';
import { formatDate } from '../../lib/utils';

export function PatientDashboard() {
  const [vitals] = useState<VitalSigns[]>(mockVitals);
  
  // In a real app, this would be filtered by the current patient's ID
  const patientVitals = vitals.filter(v => v.patient_id === '1');
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
    },
    {
      title: 'Blood Pressure',
      value: latestVitals ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}` : '--',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-400',
      normal: '<120/80',
    },
    {
      title: 'Temperature',
      value: latestVitals?.temperature.toFixed(1) || '--',
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-400',
      normal: '97-99',
    },
    {
      title: 'Oxygen Saturation',
      value: latestVitals?.oxygen_saturation || '--',
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-400',
      normal: '>95',
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-cyber font-bold neon-text">
          Patient Dashboard
        </h1>
        <p className="text-cyan-300/70 mt-2">
          Monitor your health status and vital signs
        </p>
      </div>

      {/* Health Status Overview */}
      {riskPrediction && (
        <div className={`cyber-border rounded-xl p-6 ${getRiskBgColor(riskPrediction.riskLevel)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-8 h-8 ${getRiskColor(riskPrediction.riskLevel)}`} />
              <div>
                <h2 className="text-xl font-bold text-cyan-100">Health Status</h2>
                <p className="text-cyan-300/70 text-sm">AI-powered risk assessment</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-cyan-100 mb-2">Risk Factors</h3>
              <ul className="space-y-1">
                {riskPrediction.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-cyan-300/70 flex items-start space-x-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 mb-2">Recommendations</h3>
              <ul className="space-y-1">
                {riskPrediction.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-cyan-300/70 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitalCards.map((card, index) => (
          <div key={index} className="cyber-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.color}`} />
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-100">
                  {card.value}
                </div>
                <div className="text-sm text-cyan-300/70">{card.unit}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 mb-1">{card.title}</h3>
              <p className="text-xs text-cyan-300/70">Normal: {card.normal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Readings */}
      <div className="cyber-border rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-100">Recent Readings</h2>
        </div>
        
        {patientVitals.length > 0 ? (
          <div className="space-y-4">
            {patientVitals.slice(-5).reverse().map((vital, index) => (
              <div key={vital.id} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-cyan-300/70">
                    {formatDate(vital.recorded_at)}
                  </div>
                  <div className="text-xs text-cyan-400 font-mono">
                    ID: {vital.id}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-cyan-300/70">HR:</span>
                    <span className="text-cyan-100 ml-2">{vital.heart_rate} BPM</span>
                  </div>
                  <div>
                    <span className="text-cyan-300/70">BP:</span>
                    <span className="text-cyan-100 ml-2">
                      {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                    </span>
                  </div>
                  <div>
                    <span className="text-cyan-300/70">Temp:</span>
                    <span className="text-cyan-100 ml-2">{vital.temperature.toFixed(1)}°F</span>
                  </div>
                  <div>
                    <span className="text-cyan-300/70">O2:</span>
                    <span className="text-cyan-100 ml-2">{vital.oxygen_saturation}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
            <p className="text-cyan-300/70">No vital signs recorded yet</p>
            <p className="text-sm text-cyan-300/50 mt-2">
              Your doctor will record your vitals during your next visit
            </p>
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="cyber-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-100 mb-4">Health Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
            <h3 className="font-semibold text-blue-100 mb-2">Stay Hydrated</h3>
            <p className="text-sm text-blue-300/70">
              Drink at least 8 glasses of water daily to maintain optimal health.
            </p>
          </div>
          <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
            <h3 className="font-semibold text-green-100 mb-2">Regular Exercise</h3>
            <p className="text-sm text-green-300/70">
              Aim for 30 minutes of moderate exercise most days of the week.
            </p>
          </div>
          <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
            <h3 className="font-semibold text-purple-100 mb-2">Quality Sleep</h3>
            <p className="text-sm text-purple-300/70">
              Get 7-9 hours of quality sleep each night for optimal recovery.
            </p>
          </div>
          <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
            <h3 className="font-semibold text-orange-100 mb-2">Balanced Diet</h3>
            <p className="text-sm text-orange-300/70">
              Eat a variety of fruits, vegetables, and whole grains daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}