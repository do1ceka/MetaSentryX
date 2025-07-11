export interface User {
  id: string;
  email: string;
  role: 'doctor' | 'patient' | 'it' | 'admin';
  name: string;
  created_at: string;
  department?: string;
  license_number?: string;
  phone?: string;
  specialization?: string;
  emergency_contact?: string;
  clearance_level?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medical_id: string;
  doctor_id: string;
  created_at: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  insurance?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  height?: number; // cm
  weight?: number; // kg
  bmi?: number;
}

export interface VitalSigns {
  id: string;
  patient_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  temperature: number;
  oxygen_saturation: number;
  recorded_by: string;
  recorded_at: string;
  notes?: string;
}

export interface RiskPrediction {
  id: string;
  patient_id: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
  recommendations: string[];
  predicted_at: string;
}

export interface SystemLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  ip_address: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'data_access' | 'system_breach' | 'anomaly_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source_ip: string;
  timestamp: string;
  resolved: boolean;
  affected_user?: string;
  action_taken?: string;
}

export interface MedicalDevice {
  id: string;
  name: string;
  type: 'cardiac_monitor' | 'ventilator' | 'infusion_pump' | 'pulse_oximeter' | 'bp_monitor';
  location: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  patient_id: string | null;
  last_reading: string;
  battery_level: number;
  firmware_version: string;
  manufacturer: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  duration: number; // minutes
  type: 'checkup' | 'follow_up' | 'consultation' | 'procedure' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication: string;
  dosage: string;
  quantity: number;
  refills: number;
  prescribed_date: string;
  status: 'active' | 'completed' | 'cancelled';
  instructions?: string;
}

export interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: string;
  user_id: string;
}

export interface DigitalTwin {
  patient_id: string;
  real_time_vitals: VitalSigns;
  predicted_vitals: VitalSigns;
  risk_score: number;
  anomalies: string[];
  last_updated: string;
}