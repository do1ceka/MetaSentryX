import React from 'react';
import { Patient, VitalSigns } from '../types';
import { predictHealthRisk } from '../lib/ai-prediction';
import { User, Heart, Activity, Thermometer, Droplets } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  vitals: VitalSigns[];
  onClick: () => void;
}

export function PatientCard({ patient, vitals, onClick }: PatientCardProps) {
  const latestVitals = vitals[vitals.length - 1];
  const riskPrediction = latestVitals ? predictHealthRisk(latestVitals) : null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-400/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/50';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-400/50';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/50';
    }
  };

  return (
    <div
      onClick={onClick}
      className="cyber-border rounded-xl p-4 hover:border-cyan-300 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-cyan-100 text-lg">{patient.name}</h3>
            <p className="text-cyan-300/70 text-sm">
              ID: {patient.medical_id} • Age: {patient.age} • {patient.gender}
            </p>
          </div>
        </div>
        
        {riskPrediction && (
          <div className={`px-3 py-1 rounded-lg border text-xs font-medium uppercase ${getRiskColor(riskPrediction.riskLevel)}`}>
            {riskPrediction.riskLevel} Risk
          </div>
        )}
      </div>

      {latestVitals ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-400" />
            <div>
              <div className="text-sm text-cyan-300/70">HR</div>
              <div className="font-semibold text-cyan-100">{latestVitals.heart_rate}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-sm text-cyan-300/70">BP</div>
              <div className="font-semibold text-cyan-100">
                {latestVitals.blood_pressure_systolic}/{latestVitals.blood_pressure_diastolic}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-sm text-cyan-300/70">Temp</div>
              <div className="font-semibold text-cyan-100">{latestVitals.temperature.toFixed(1)}°F</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-sm text-cyan-300/70">O2</div>
              <div className="font-semibold text-cyan-100">{latestVitals.oxygen_saturation}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-cyan-300/70 text-sm">No vitals recorded yet</p>
        </div>
      )}
    </div>
  );
}