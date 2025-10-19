// API Response types
export interface ApiResponse<T> {
  httpStatus: number;
  operationId: string;
  data: T;
  message?: string;
  error?: string;
}

// Patient API types
export interface CreatePatientRequest {
  NIK: string;
  name: string;
  dob: string;
  birthPlace: string;
  gender: "male" | "female";
  addressLine: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  districtName: string;
  districtCode: string;
  subDistrictCode: string;
  subDistrictName: string;
  rt: string;
  rw: string;
  postalCode: string;
  phone: string;
  email: string;
  citizenshipStatus: "WNI" | "WNA";
}

export interface PatientResponse {
  NIK: string;
  kkNumber?: string | null;
  name: string;
  dob: string;
  birthPlace: string;
  gender: string;
  maritalStatus: string;
  addressLine: string;
  addressUse: string;
  provinceName: string;
  cityName: string;
  disctrictName: string;
  subDistrictName: string;
  rt: string;
  rw: string;
  postalCode: string;
  phone: string;
  email: string;
  occupation: string;
}

// Reference data types
export interface Province {
  provinceCode: string;
  name: string;
}

export interface City {
  cityCode: string;
  name: string;
}

export interface District {
  districtCode: string;
  name: string;
}

export interface SubDistrict {
  subDistrictCode: string;
  name: string;
}

// Form validation types
export interface PatientFormErrors {
  NIK?: string;
  name?: string;
  dob?: string;
  birthPlace?: string;
  gender?: string;
  addressLine?: string;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  subDistrictCode?: string;
  rt?: string;
  rw?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  citizenshipStatus?: string;
}

// Clinic types
export interface Branch {
  id: string;
  name: string;
  address: string;
  doctors: Doctor[];
}

export interface Clinic {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  priceRangeMin: number;
  priceRangeMax: number;
  branches: Branch[];
  availableSlots: TimeSlot[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableDates: string[];
  branchIds: string[];
}

export interface TimeSlot {
  doctorId: string;
  branchId: string;
  date: string;
  times: string[];
}

export interface ClinicRegistrationRequest {
  name: string;
  whatsappNumber: string;
  branchId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  keluhan: string;
  clinicId: string;
}

export interface ClinicListResponse {
  clinics: Clinic[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// AI Diagnosis types
export interface DiagnosisRequest {
  anamnesis: string;
  examination: string;
}

export interface DiagnosisRecommendation {
  diagnosis: string;
  icd10: string;
  reasoning: string;
}

export interface DiagnosisResponse {
  httpStatus: number;
  operationId: string;
  data: {
    recommendations: DiagnosisRecommendation[];
    summary: string;
  };
}
