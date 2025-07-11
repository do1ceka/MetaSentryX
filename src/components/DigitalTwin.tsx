import { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Droplets, TrendingUp, AlertTriangle } from 'lucide-react';
import { Patient, VitalSigns } from '../types';
import { predictHealthRisk } from '../lib/ai-prediction';

interface DigitalTwinProps {
  patient: Patient;
  vitals: VitalSigns[];
}

export function DigitalTwin({ patient, vitals }: DigitalTwinProps) {
  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (vitals.length > 0) {
      setCurrentVitals(vitals[vitals.length - 1]);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [vitals]);

  if (!currentVitals) {
    return (
      <div className="cyber-border rounded-xl p-6 text-center">
        <div className="text-cyan-300/70">No vital signs data available</div>
      </div>
    );
  }

  const riskPrediction = predictHealthRisk(currentVitals);
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const vitalMetrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: currentVitals.heart_rate,
      unit: 'BPM',
      normal: [60, 100],
      color: 'text-red-400'
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: `${currentVitals.blood_pressure_systolic}/${currentVitals.blood_pressure_diastolic}`,
      unit: 'mmHg',
      normal: [120, 80],
      color: 'text-blue-400'
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: currentVitals.temperature.toFixed(1),
      unit: '°F',
      normal: [97, 99],
      color: 'text-orange-400'
    },
    {
      icon: Droplets,
      label: 'Oxygen Sat',
      value: currentVitals.oxygen_saturation,
      unit: '%',
      normal: [95, 100],
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Patient Avatar and Status */}
      <div className="cyber-border rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 ${
              riskPrediction.riskLevel === 'high' ? 'bg-red-400' :
              riskPrediction.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
            } ${isAnimating ? 'animate-pulse' : ''}`}></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-cyan-100">{patient.name}</h3>
            <p className="text-cyan-300/70">ID: {patient.medical_id}</p>
            <p className="text-sm text-cyan-300/70">{patient.age} years • {patient.gender}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${getRiskColor(riskPrediction.riskLevel)}`}>
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold uppercase">{riskPrediction.riskLevel} Risk</span>
          </div>
          <div className="text-sm text-cyan-300/70">
            Confidence: {(riskPrediction.confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 3D Vital Signs Visualization */}
      <div className="cyber-border rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Real-time Vitals</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          {vitalMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-cyan-400/20">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                <div className={`text-2xl font-bold text-cyan-100 ${isAnimating ? 'animate-pulse' : ''}`}>
                  {metric.value}
                </div>
              </div>
              <div className="text-sm text-cyan-300/70 mb-1">{metric.label}</div>
              <div className="text-xs text-cyan-300/50">{metric.unit}</div>
              
              {/* Visual indicator bar */}
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')} transition-all duration-1000`}
                  style={{ 
                    width: `${Math.min(100, Math.max(10, 
                      typeof metric.value === 'number' ? 
                        (metric.value / (Array.isArray(metric.normal) ? metric.normal[1] : 100)) * 100 : 50
                    ))}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="cyber-border rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>AI Analysis</span>
        </h4>
        
        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-cyan-200 mb-2">Risk Factors:</h5>
            <div className="space-y-1">
              {riskPrediction.factors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-cyan-300/70">{factor}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-cyan-200 mb-2">Recommendations:</h5>
            <div className="space-y-1">
              {riskPrediction.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-cyan-300/70">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vital Signs History Chart */}
      <div className="cyber-border rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-100 mb-4">Trends (Last 24h)</h4>
        <div className="space-y-4">
          {vitals.slice(-5).map((vital, index) => (
            <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="text-sm text-cyan-300/70">
                {new Date(vital.recorded_at).toLocaleTimeString()}
              </div>
              <div className="flex space-x-4 text-sm">
                <span className="text-red-400">{vital.heart_rate} BPM</span>
                <span className="text-blue-400">{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</span>
                <span className="text-orange-400">{vital.temperature.toFixed(1)}°F</span>
                <span className="text-cyan-400">{vital.oxygen_saturation}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}