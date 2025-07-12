import { Patient, VitalSigns } from '../types';
import { predictHealthRisk } from '../lib/ai-prediction';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Activity, Users } from 'lucide-react';

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
      id: patient.id,
      name: patient.name,
      age: patient.age,
      risk: risk?.riskLevel || 'unknown',
      confidence: risk?.confidence || 0,
      factors: risk?.factors || [],
      vitalsCount: patientVitals.length,
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

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <Minus className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const total = riskData.length;
  const highRiskPatients = riskData.filter(p => p.risk === 'high');
  const averageConfidence = riskData.reduce((sum, p) => sum + p.confidence, 0) / total;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-100">Total Patients</span>
          </div>
          <div className="text-2xl font-bold text-cyan-100">{total}</div>
          <div className="text-xs text-cyan-300/70">Under monitoring</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-cyan-100">High Risk</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{highRiskPatients.length}</div>
          <div className="text-xs text-cyan-300/70">Require attention</div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-100 flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Risk Distribution</span>
        </h3>
        
        <div className="space-y-3">
          {Object.entries(riskCounts).map(([level, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={level} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={getRiskTextColor(level)}>
                      {getRiskIcon(level)}
                    </div>
                    <span className="text-cyan-100 capitalize font-medium">{level} Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-100 font-semibold">{count}</span>
                    <span className="text-cyan-300/70">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${getRiskColor(level)} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Confidence Meter */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-400/20">
        <h4 className="text-sm font-semibold text-cyan-100 mb-3">AI Prediction Confidence</h4>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${averageConfidence * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm font-semibold text-cyan-100">
            {(averageConfidence * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-xs text-cyan-300/70 mt-2">
          Average confidence across all predictions
        </div>
      </div>

      {/* Patient Risk Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-cyan-100">Patient Risk Levels</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {riskData
            .sort((a, b) => {
              const riskOrder = { high: 3, medium: 2, low: 1, unknown: 0 };
              return riskOrder[b.risk as keyof typeof riskOrder] - riskOrder[a.risk as keyof typeof riskOrder];
            })
            .map((item, index) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-800/20 rounded-lg border border-cyan-400/10 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(item.risk)}`}></div>
                <div>
                  <div className="text-cyan-100 font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-cyan-300/70">
                    Age: {item.age} • Readings: {item.vitalsCount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold capitalize ${getRiskTextColor(item.risk)}`}>
                  {item.risk}
                </div>
                {item.confidence > 0 && (
                  <div className="text-xs text-cyan-300/70">
                    {(item.confidence * 100).toFixed(0)}% conf.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Risk Alert */}
      {highRiskPatients.length > 0 && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <h4 className="text-sm font-semibold text-red-100">High Risk Patients</h4>
          </div>
          <div className="space-y-2">
            {highRiskPatients.map(patient => (
              <div key={patient.id} className="flex justify-between items-center text-sm">
                <span className="text-red-200">{patient.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-red-300">{(patient.confidence * 100).toFixed(0)}%</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">URGENT</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}