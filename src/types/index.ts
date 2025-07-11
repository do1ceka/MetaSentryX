export interface User {
  id: string;
  email: string;
  role: 'doctor' | 'patient' | 'it' | 'admin';
  name: string;
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medical_id: string;
  doctor_id: string;
  created_at: string;
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
}

export interface RiskPrediction {
  id: string;
  patient_id: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
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
}