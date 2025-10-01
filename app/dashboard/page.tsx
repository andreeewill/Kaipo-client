"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentActivity } from "@/components/RecentActivity";
import { AddMedicalRecordDemo } from "@/components/AddMedicalRecordDemo";
import { PatientSummary } from "@/components/PatientSummary";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Status, Patient } from "@/types/patient";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Patient Status System
const PATIENT_STATUSES: Status[] = [
  {
    id: "registered",
    label: "Registered",
    color: "bg-gray-500",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
  },
  {
    id: "approved",
    label: "Approved by Nurse",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    id: "examining",
    label: "In Examining Room",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  {
    id: "payment",
    label: "Pending Payment",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  {
    id: "done",
    label: "Done",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
];

// Generate dummy patient data for dashboard
const generateDashboardPatientData = (): Patient[] => {
  const data = [];
  const conditions = ["Hypertension", "Diabetes", "Asthma", "Arthritis", "Migraine"];
  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown"];

  for (let i = 1; i <= 30; i++) {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 7) - 3; // -3 to +3 days from today
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + randomDays);
    
    data.push({
      id: i,
      name: `Patient ${i}`,
      age: Math.floor(Math.random() * 60) + 20,
      gender: i % 2 === 0 ? "Male" : "Female",
      diagnosis: conditions[i % conditions.length],
      doctor: doctors[i % doctors.length],
      date: format(appointmentDate, "yyyy-MM-dd"),
      status: PATIENT_STATUSES[i % PATIENT_STATUSES.length].id,
      medicalRecord: {
        patientId: `P${String(i).padStart(4, "0")}`,
        bloodType: ["A+", "B+", "AB+", "O+"][i % 4],
        allergies: ["None", "Penicillin"][i % 2],
        emergencyContact: {
          name: `Contact ${i}`,
          relationship: "Family",
          phone: "+1-555-0100",
        },
        insurance: {
          provider: "Health Insurance",
          policyNumber: `POL${i}`,
        },
        currentMedications: [],
        vitals: {
          height: "170 cm",
          weight: "70 kg",
          bloodPressure: "120/80",
          heartRate: "72 bpm",
          temperature: "36.5°C",
        },
      },
      timeline: [],
    });
  }
  return data;
};

export default function DashboardPage() {
  const { isAuthenticated, userInfo, logout } = useAuthStore();
  console.log("🚀 ~ DashboardPage ~ isAuthenticated:", isAuthenticated)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRole, setSelectedRole] = useState<string>("doctor");
  const [patientData] = useState<Patient[]>(generateDashboardPatientData());
  const currentDateString = format(new Date(), "yyyy-MM-dd");

  // Development mode toggle for middleware
  const [devMode, setDevMode] = useState(() => {
    // Initialize from cookie if in browser
    if (typeof document !== 'undefined') {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('dev_mode='));
      return cookie ? cookie.split('=')[1] === 'true' : true; // Default to true if no cookie
    }
    return true; // Default to true
  });

  useEffect(() => {
    // In production mode, check authentication status
    if (!devMode && !isAuthenticated) {
      router.push('/login')
      return
    }
    setIsLoading(false);
  }, [isAuthenticated, router, devMode]);
  
  // Handle dev mode toggle
  const handleDevModeChange = (enabled: boolean) => {
    setDevMode(enabled);
    // Set cookie for middleware
    document.cookie = `dev_mode=${enabled}; path=/; max-age=${60*60*24*30}`; // 30 days
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear JWT cookie
      await fetch("https://api.kaipo.my.id/auth/logout", {
        method: "POST",
        // credentials: 'include',
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      logout();
      // router.push('/login')
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Development Toggle Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 -mx-4 md:-mx-6 lg:-mx-8 mb-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development Mode:</strong> Authentication is{" "}
                <span
                  className={
                    devMode
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {devMode ? "DISABLED (Dev Mode)" : "ENABLED (Production)"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={devMode}
                onChange={(e) => handleDevModeChange(e.target.checked)}
                className="sr-only"
              />
              <div className="relative">
                <div
                  className={`block w-14 h-8 rounded-full ${
                    devMode ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                    devMode ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm text-yellow-700">Development Mode</span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Serenity Health Clinic
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Login as:</span>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                {userInfo ? (
                  <div className="flex items-center space-x-2">
                    <span>Welcome, {userInfo.sub}!</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {userInfo.role.join(", ")}
                    </span>
                  </div>
                ) : (
                  <span>Welcome back!</span>
                )}
              </div>
              <Button onClick={handleLogout} variant="destructive">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Kaipo! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                {!devMode
                  ? "You have successfully logged in to your dashboard. This is a protected page that requires authentication."
                  : "You're viewing the dashboard in development mode. Authentication is currently disabled for easier testing."}
              </p>
              <div
                className={`border rounded-md p-4 ${
                  !devMode
                    ? "bg-green-50 border-green-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex">
                  <svg
                    className={`w-5 h-5 mr-2 mt-0.5 ${
                      !devMode ? "text-green-400" : "text-blue-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        !devMode ? "text-green-800" : "text-blue-800"
                      }`}
                    >
                      {!devMode
                        ? "Authentication Required"
                        : "Development Mode Active"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        !devMode ? "text-green-700" : "text-blue-700"
                      }`}
                    >
                      {!devMode
                        ? "Your JWT token has been set and you're now logged in."
                        : "Authentication is disabled. You can access this page without logging in."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          {userInfo && (
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userInfo.sub}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1">
                      {userInfo.role.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1"
                        >
                          {role}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Token Issued
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(userInfo.iat * 1000).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Token Expires
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(userInfo.exp * 1000).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Issuer
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userInfo.iss}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patient Summary Section */}
          <PatientSummary
            selectedDate={currentDateString}
            patientData={patientData}
            statuses={PATIENT_STATUSES}
          />

          {/* Dashboard Grid */}
          <DashboardStats />

          {/* Recent Activity */}
          <RecentActivity />

          {/* React Query Demo */}
          <AddMedicalRecordDemo />
        </div>
      </main>
    </Layout>
  );
}
