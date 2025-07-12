import { useState } from 'react';
import { Patient, VitalSigns } from '../types';
import { X } from 'lucide-react';

interface VitalsFormProps {
  patients: Patient[];
  onSubmit: (vitals: Omit<VitalSigns, 'id' | 'recorded_at'>) => void;
  onCancel: () => void;
}

export function VitalsForm({ patients, onSubmit, onCancel }: VitalsFormProps) {
  const [formData, setFormData] = useState({
    patient_id: '',
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature: '',
    oxygen_saturation: '',
    recorded_by: '1', // Current doctor ID
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      patient_id: formData.patient_id,
      heart_rate: parseInt(formData.heart_rate),
      blood_pressure_systolic: parseInt(formData.blood_pressure_systolic),
      blood_pressure_diastolic: parseInt(formData.blood_pressure_diastolic),
      temperature: parseFloat(formData.temperature),
      oxygen_saturation: parseInt(formData.oxygen_saturation),
      recorded_by: formData.recorded_by,
      notes: formData.notes,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-cyan-100">Record Vital Signs</h2>
        <button
          onClick={onCancel}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Patient
          </label>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            className="cyber-input w-full"
            required
          >
            <option value="">Select a patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.medical_id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Heart Rate (BPM)
            </label>
            <input
              type="number"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              className="cyber-input w-full"
              placeholder="e.g., 72"
              min="30"
              max="200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="cyber-input w-full"
              placeholder="e.g., 98.6"
              min="90"
              max="110"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Systolic BP (mmHg)
            </label>
            <input
              type="number"
              name="blood_pressure_systolic"
              value={formData.blood_pressure_systolic}
              onChange={handleChange}
              className="cyber-input w-full"
              placeholder="e.g., 120"
              min="70"
              max="250"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Diastolic BP (mmHg)
            </label>
            <input
              type="number"
              name="blood_pressure_diastolic"
              value={formData.blood_pressure_diastolic}
              onChange={handleChange}
              className="cyber-input w-full"
              placeholder="e.g., 80"
              min="40"
              max="150"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Oxygen Saturation (%)
          </label>
          <input
            type="number"
            name="oxygen_saturation"
            value={formData.oxygen_saturation}
            onChange={handleChange}
            className="cyber-input w-full"
            placeholder="e.g., 98"
            min="70"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="cyber-input w-full h-20 resize-none"
            placeholder="Additional observations or notes..."
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="cyber-button flex-1"
          >
            Record Vitals
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}