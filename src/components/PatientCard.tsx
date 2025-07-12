import { Patient, VitalSigns } from '../types';
import { predictHealthRisk } from '../lib/ai-prediction';
import { User, Heart, Activity, Thermometer, Droplets, Calendar, AlertTriangle } from 'lucide-react';

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

  const getAgeGroup = (age: number) => {
    if (age < 18) return 'Pediatric';
    if (age < 65) return 'Adult';
    return 'Senior';
  };

  return (
    <div
      onClick={onClick}
      className="cyber-border rounded-xl p-6 hover:border-cyan-300 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 bg-gradient-to-br from-gray-900/80 to-gray-800/80"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {riskPrediction && (
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 ${
                riskPrediction.riskLevel === 'high' ? 'bg-red-400' :
                riskPrediction.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              } animate-pulse`}></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-cyan-100 text-xl">{patient.name}</h3>
            <div className="flex items-center space-x-3 text-sm text-cyan-300/70">
              <span>ID: {patient.medical_id}</span>
              <span>•</span>
              <span>{patient.age} years ({getAgeGroup(patient.age)})</span>
              <span>•</span>
              <span className="capitalize">{patient.gender}</span>
            </div>
            {patient.blood_type && (
              <div className="text-xs text-cyan-400 mt-1">
                Blood Type: {patient.blood_type} | BMI: {patient.bmi}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {riskPrediction && (
            <div className={`px-3 py-1 rounded-lg border text-xs font-medium uppercase ${getRiskColor(riskPrediction.riskLevel)}`}>
              {riskPrediction.riskLevel} Risk
            </div>
          )}
          <button className="text-xs bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700 transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Medical Conditions & Allergies */}
      {(patient.chronic_conditions?.length || patient.allergies?.length) && (
        <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-cyan-400/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
              <div>
                <span className="text-yellow-400 font-medium">Conditions:</span>
                <div className="mt-1 space-y-1">
                  {patient.chronic_conditions.slice(0, 2).map((condition, index) => (
                    <div key={index} className="text-yellow-300/70">• {condition}</div>
                  ))}
                  {patient.chronic_conditions.length > 2 && (
                    <div className="text-yellow-300/50">+{patient.chronic_conditions.length - 2} more</div>
                  )}
                </div>
              </div>
            )}
            {patient.allergies && patient.allergies.length > 0 && (
              <div>
                <span className="text-red-400 font-medium">Allergies:</span>
                <div className="mt-1 space-y-1">
                  {patient.allergies.slice(0, 2).map((allergy, index) => (
                    <div key={index} className="text-red-300/70">• {allergy}</div>
                  ))}
                  {patient.allergies.length > 2 && (
                    <div className="text-red-300/50">+{patient.allergies.length - 2} more</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vital Signs */}
      {latestVitals ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-xs text-cyan-300/70">Heart Rate</div>
              <div className="font-semibold text-cyan-100">{latestVitals.heart_rate} BPM</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs text-cyan-300/70">Blood Pressure</div>
              <div className="font-semibold text-cyan-100">
                {latestVitals.blood_pressure_systolic}/{latestVitals.blood_pressure_diastolic}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-xs text-cyan-300/70">Temperature</div>
              <div className="font-semibold text-cyan-100">{latestVitals.temperature.toFixed(1)}°F</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs text-cyan-300/70">Oxygen Sat</div>
              <div className="font-semibold text-cyan-100">{latestVitals.oxygen_saturation}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-yellow-400/50 mx-auto mb-2" />
          <p className="text-cyan-300/70 text-sm">No vitals recorded yet</p>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 mt-1">
            Record First Reading
          </button>
        </div>
      )}

      {/* Risk Analysis */}
      {riskPrediction && (
        <div className="mt-4 pt-4 border-t border-cyan-400/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300/70">AI Risk Analysis:</span>
            <span className={`font-semibold ${getRiskColor(riskPrediction.riskLevel).split(' ')[0]}`}>
              {(riskPrediction.confidence * 100).toFixed(1)}% confidence
            </span>
          </div>
          {riskPrediction.factors.length > 0 && (
            <div className="mt-2 text-xs text-cyan-300/50">
              Key factors: {riskPrediction.factors.slice(0, 2).join(', ')}
              {riskPrediction.factors.length > 2 && '...'}
            </div>
          )}
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-3 pt-3 border-t border-cyan-400/10 flex items-center justify-between text-xs text-cyan-300/50">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Last updated: {latestVitals ? new Date(latestVitals.recorded_at).toLocaleDateString() : 'Never'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span>Dr. {latestVitals?.recorded_by || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}