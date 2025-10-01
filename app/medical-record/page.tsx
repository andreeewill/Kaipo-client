"use client";
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isSameDay, parseISO } from "date-fns";
import { PatientTable } from "@/components/PatientTable";
import { StatusIndicator } from "@/components/StatusIndicator";
import { PatientSummary } from "@/components/PatientSummary";
import { Status, Patient } from "@/types/patient";

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

// Dummy data for the table
const generateDummyData = (): Patient[] => {
  const data = [];
  const conditions = [
    "Hypertension",
    "Diabetes",
    "Asthma",
    "Arthritis",
    "Migraine",
    "Depression",
    "Anxiety",
  ];
  const medications = [
    "Lisinopril",
    "Metformin",
    "Albuterol",
    "Ibuprofen",
    "Sumatriptan",
    "Sertraline",
    "Lorazepam",
  ];
  const doctors = [
    "Dr. Smith",
    "Dr. Johnson",
    "Dr. Williams",
    "Dr. Brown",
    "Dr. Davis",
  ];

  for (let i = 1; i <= 50; i++) {
    const day = i % 30 || 1; // Ensure day is between 1 and 30
    const condition = conditions[i % conditions.length];
    const medication = medications[i % medications.length];
    const doctor = doctors[i % doctors.length];

    data.push({
      id: i,
      name: `Patient ${i}`,
      age: Math.floor(Math.random() * 60) + 20,
      gender: i % 2 === 0 ? "Male" : "Female",
      diagnosis: condition,
      doctor: doctor,
      date: `2025-05-${String(day).padStart(2, "0")}`,
      status: PATIENT_STATUSES[i % PATIENT_STATUSES.length].id, // Add status
      // Enhanced detailed medical record
      medicalRecord: {
        patientId: `P${String(i).padStart(4, "0")}`,
        bloodType: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"][i % 8],
        allergies: ["None", "Penicillin", "Shellfish", "Peanuts", "Latex"][
          i % 5
        ],
        emergencyContact: {
          name: `Emergency Contact ${i}`,
          relationship: ["Spouse", "Parent", "Sibling", "Child"][i % 4],
          phone: `+1 (555) ${String(
            Math.floor(Math.random() * 900) + 100
          )}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        },
        insurance: {
          provider: ["Blue Cross", "Aetna", "Cigna", "UnitedHealth"][i % 4],
          policyNumber: `POL${String(Math.floor(Math.random() * 10000000))}`,
        },
        currentMedications: [
          { name: medication, dosage: "10mg", frequency: "Daily" },
          { name: "Vitamin D", dosage: "1000 IU", frequency: "Daily" },
        ],
        vitals: {
          height: `${Math.floor(Math.random() * 30) + 150} cm`,
          weight: `${Math.floor(Math.random() * 50) + 50} kg`,
          bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${
            Math.floor(Math.random() * 20) + 70
          }`,
          heartRate: `${Math.floor(Math.random() * 30) + 60} bpm`,
          temperature: `${(Math.random() * 2 + 36).toFixed(1)}°C`,
        },
      },
      timeline: [
        {
          date: `2025-05-${String(day).padStart(2, "0")}`,
          type: "consultation",
          description: `Initial consultation for ${condition}`,
          doctor: doctor,
          notes: `Patient presented with symptoms consistent with ${condition}. Prescribed ${medication} and advised follow-up in 2 weeks.`,
          vitals: {
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${
              Math.floor(Math.random() * 20) + 70
            }`,
            heartRate: `${Math.floor(Math.random() * 30) + 60} bpm`,
            temperature: `${(Math.random() * 2 + 36).toFixed(1)}°C`,
          },
        },
        {
          date: `2025-04-${String((day % 30) + 1).padStart(2, "0")}`,
          type: "follow-up",
          description: `Follow-up appointment for ${condition}`,
          doctor: doctor,
          notes: `Patient showing improvement. Continue current medication regimen.`,
          vitals: {
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${
              Math.floor(Math.random() * 20) + 70
            }`,
            heartRate: `${Math.floor(Math.random() * 30) + 60} bpm`,
            temperature: `${(Math.random() * 2 + 36).toFixed(1)}°C`,
          },
        },
        {
          date: `2025-03-${String((day % 30) + 5).padStart(2, "0")}`,
          type: "lab-results",
          description: "Laboratory test results",
          doctor: doctor,
          notes: "All lab values within normal range. Continue monitoring.",
          labResults: [
            {
              test: "Complete Blood Count",
              result: "Normal",
              reference: "Normal",
            },
            {
              test: "Blood Glucose",
              result: "95 mg/dL",
              reference: "70-100 mg/dL",
            },
            {
              test: "Cholesterol",
              result: "180 mg/dL",
              reference: "<200 mg/dL",
            },
          ],
        },
        {
          date: `2025-02-${String((day % 28) + 1).padStart(2, "0")}`,
          type: "prescription",
          description: `Prescription renewal for ${medication}`,
          doctor: doctor,
          notes: `Renewed prescription for ${medication}. Patient tolerating well.`,
        },
      ],
    });
  }
  return data;
};

const dummyData = generateDummyData();

export default function Schedule() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [selected] = useState("Jadwal Pasien");
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRow, setSelectedRow] = useState<Patient | null>(null);
  const [detailedView, setDetailedView] = useState<Patient | null>(null);
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [patientData, setPatientData] = useState<Patient[]>(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2025-05-01");
  const rowsPerPage = 10;

  useEffect(() => {
    // Redirect to login if not authenticated
    // if (!isAuthenticated) {
    //   router.push('/login')
    // }
  }, [isAuthenticated, router]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getStatusInfo = (statusId) => {
    return (
      PATIENT_STATUSES.find((status) => status.id === statusId) ||
      PATIENT_STATUSES[0]
    );
  };

  const toggleRowExpansion = (rowId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const updatePatientStatus = (patientId, newStatus) => {
    setPatientData((prevData) =>
      prevData.map((patient) =>
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      )
    );
  };

  const filteredData = patientData
    .filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Layout>
      <div className="flex h-full w-full relative overflow-hidden">
        {/* Main Content */}
        <div
          className={`transition-transform duration-300 ease-in-out ${
            detailedView ? "-translate-x-full" : "translate-x-0"
          } flex-1 p-6`}
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-900">{selected}</h1>

          {/* Patients amount info Section */}
          <PatientSummary
            selectedDate={selectedDate}
            patientData={patientData}
            statuses={PATIENT_STATUSES}
          />

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Patients
                </label>
                <Input
                  placeholder="Search by name, diagnosis, doctor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Filter by Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <PatientTable
            patients={paginatedData}
            statuses={PATIENT_STATUSES}
            expandedRows={expandedRows}
            onRowClick={setSelectedRow}
            onToggleExpansion={toggleRowExpansion}
            onStatusUpdate={updatePatientStatus}
            onDetailsClick={setDetailedView}
            onSort={handleSort}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 bg-white rounded-lg shadow-sm border p-4">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page{" "}
              <span className="font-bold text-blue-600">{currentPage}</span> of{" "}
              <span className="font-bold text-blue-600">{totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        {selectedRow && !detailedView && (
          <div className="w-80 border-l border-gray-300 p-6 bg-gray-50 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {selectedRow.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedRow.name}
              </p>
              <p>
                <strong>Age:</strong> {selectedRow.age}
              </p>
              <p>
                <strong>Gender:</strong> {selectedRow.gender}
              </p>
              <p>
                <strong>Diagnosis:</strong> {selectedRow.diagnosis}
              </p>
              <p>
                <strong>Doctor:</strong> {selectedRow.doctor}
              </p>
              <p>
                <strong>Date:</strong> {selectedRow.date}
              </p>
              <div className="flex items-center">
                <strong>Status:</strong>
                <StatusIndicator
                  status={getStatusInfo(selectedRow.status)}
                  className="ml-2"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Timeline</h3>
              <div className="space-y-4">
                {selectedRow.timeline.map((entry, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <p className="text-sm text-gray-600">
                      <strong>{entry.date}:</strong> {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              className="cursor-pointer mt-auto"
              onClick={() => setSelectedRow(null)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Detailed View Panel */}
        {detailedView && (
          <div
            className={`absolute inset-0 bg-white transition-transform duration-500 ease-in-out transform ${
              detailedView ? "translate-x-0" : "translate-x-full"
            } overflow-y-auto z-10`}
          >
            <div className="p-6">
              {/* Header with back button */}
              <div className="flex items-center mb-6 border-b pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer mr-4"
                  onClick={() => setDetailedView(null)}
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Medical Record - {detailedView.name}
                </h1>
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Basic Information */}
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Patient Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.patientId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{detailedView.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{detailedView.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{detailedView.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.bloodType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allergies:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.allergies}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Vitals */}
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Current Vitals
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.vitals.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.vitals.weight}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Pressure:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.vitals.bloodPressure}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heart Rate:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.vitals.heartRate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.vitals.temperature}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Emergency Contact
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.emergencyContact.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relationship:</span>
                      <span className="font-medium">
                        {
                          detailedView.medicalRecord.emergencyContact
                            .relationship
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Insurance
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.insurance.provider}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Number:</span>
                      <span className="font-medium">
                        {detailedView.medicalRecord.insurance.policyNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white border rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Current Medications
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medication
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dosage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frequency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailedView.medicalRecord.currentMedications.map(
                        (med, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {med.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {med.dosage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {med.frequency}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6 text-gray-800">
                  Medical History Timeline
                </h2>
                <div className="space-y-6">
                  {detailedView.timeline.map((entry, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-blue-500"
                    >
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-1"></div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {entry.description}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {entry.date}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {entry.type}
                          </span>
                          <strong>Doctor:</strong> {entry.doctor}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {entry.notes}
                        </p>

                        {entry.vitals && (
                          <div className="bg-white rounded p-3 mb-3">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">
                              Vitals:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                              <span>
                                <strong>BP:</strong>{" "}
                                {entry.vitals.bloodPressure}
                              </span>
                              <span>
                                <strong>HR:</strong> {entry.vitals.heartRate}
                              </span>
                              <span>
                                <strong>Temp:</strong>{" "}
                                {entry.vitals.temperature}
                              </span>
                            </div>
                          </div>
                        )}

                        {entry.labResults && (
                          <div className="bg-white rounded p-3">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">
                              Lab Results:
                            </h4>
                            <div className="space-y-1">
                              {entry.labResults.map((lab, labIndex) => (
                                <div
                                  key={labIndex}
                                  className="text-xs flex justify-between"
                                >
                                  <span>{lab.test}:</span>
                                  <span>
                                    <strong>{lab.result}</strong> (
                                    {lab.reference})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
