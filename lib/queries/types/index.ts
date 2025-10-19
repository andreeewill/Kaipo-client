// User types (from auth store)
export interface UserInfo {
  sub: string // email
  role: string[]
  iat: number
  exp: number
  iss: string
}

// Dashboard types
export interface DashboardStats {
  activeUsers: number
  revenue: number
  growth: number
}

export interface ActivityItem {
  id: number
  action: string
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
  userId?: string
  metadata?: Record<string, unknown>
}

// Medical Record types
export interface MedicalRecord {
  id: string
  patientName: string
  patientEmail: string
  diagnosis: string
  treatment: string
  date: string
  doctorId: string
  doctorName: string
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMedicalRecordData {
  patientName: string
  patientEmail: string
  diagnosis: string
  treatment: string
  notes?: string
}

export interface UpdateMedicalRecordData {
  patientName?: string
  patientEmail?: string
  diagnosis?: string
  treatment?: string
  status?: 'active' | 'completed' | 'cancelled'
  notes?: string
}

// Appointment types
export interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  duration: number // in minutes
  type: 'consultation' | 'follow-up' | 'emergency'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentData {
  patientName: string
  patientEmail: string
  date: string
  time: string
  duration: number
  type: 'consultation' | 'follow-up' | 'emergency'
  notes?: string
}

export interface UpdateAppointmentData {
  patientName?: string
  patientEmail?: string
  date?: string
  time?: string
  duration?: number
  type?: 'consultation' | 'follow-up' | 'emergency'
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

// Patient types
export interface Patient {
  NIK: string
  kkNumber?: string | null
  name: string
  dob: string
  birthPlace: string
  gender: 'male' | 'female'
  maritalStatus: string
  addressLine: string
  addressUse: string
  provinceName: string
  cityName: string
  disctrictName: string
  subDistrictName: string
  rt: string
  rw: string
  postalCode: string
  phone: string
  email: string
  occupation: string
}

export interface CreatePatientData {
  NIK: string
  name: string
  dob: string
  birthPlace: string
  gender: 'male' | 'female'
  addressLine: string
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtName: string
  districtCode: string
  subDistrictCode: string
  subDistrictName: string
  rt: string
  rw: string
  postalCode: string
  phone: string
  email: string
  citizenshipStatus: string
  notexist?: string
}

// API Response wrapper
export interface ApiResponse<T> {
  httpStatus: number
  operationId: string
  data: T
  message?: string
  error?: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Reservation types
export interface Branch {
  id: string
  name: string
}

export interface Doctor {
  id: string
  name: string
}

export interface Timeslot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface Reservation {
  name: string
  complaint: string
  doctorName: string
  phone: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
}

export interface CreateReservationData {
  name: string
  phone: string
  complaint: string
  timeslotId: string
  date: string
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}
