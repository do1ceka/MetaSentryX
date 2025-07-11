import React from 'react';
import { Patient, VitalSigns } from '../types';
import { predictHealthRisk } from '../lib/ai-prediction';

interface RiskChartProps {
  patients: Patient[];
  vitals: VitalSigns[];
}

export function RiskChart({ patients, vitals }: RiskChartProps) {
  const riskData = patients.map(patient => {
    const patientVitals = vitals.filter(v => v.patient_id === patient.id);
    const latestVitals = patientVitals[patientVitals.length - 1];
    const risk = latestVitals ? predictHealthRisk(latestVitals) : null;
    
    return {
      name: patient.name,
      risk: risk?.riskLevel || 'unknown',
      confidence: risk?.confidence || 0,
    };
  });

  const riskCounts = riskData.reduce((acc, item) => {
    acc[item.risk] = (acc[item.risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const total = riskData.length;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(riskCounts).map(([level, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={level} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-100 capitalize">{level} Risk</span>
                <span className="text-cyan-300/70">{count} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getRiskColor(level)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-cyan-100 mb-3">Patient Risk Levels</h3>
        <div className="space-y-2">
          {riskData.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-cyan-300/70">{item.name}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(item.risk)}`}></div>
                <span className="text-cyan-100 capitalize">{item.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}