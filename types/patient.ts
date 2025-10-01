export interface Status {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface MedicalRecord {
  patientId: string;
  bloodType: string;
  allergies: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
  };
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  vitals: {
    height: string;
    weight: string;
    bloodPressure: string;
    heartRate: string;
    temperature: string;
  };
}

export interface TimelineEntry {
  date: string;
  type: string;
  description: string;
  doctor: string;
  notes: string;
  vitals?: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
  };
  labResults?: Array<{
    test: string;
    result: string;
    reference: string;
  }>;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  doctor: string;
  date: string;
  status: string;
  medicalRecord: MedicalRecord;
  timeline: TimelineEntry[];
}
