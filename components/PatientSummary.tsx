"use client";
import React from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Patient, Status } from "@/types/patient";

interface PatientSummaryProps {
  selectedDate: string;
  patientData: Patient[];
  statuses: Status[];
}

export const PatientSummary: React.FC<PatientSummaryProps> = ({
  selectedDate,
  patientData,
  statuses,
}) => {
  const patientsOnSelectedDate = patientData.filter((row) =>
    isSameDay(parseISO(row.date), parseISO(selectedDate))
  );

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-sm font-semibold text-blue-800">
            {format(parseISO(selectedDate), "MMM dd, yyyy")}
          </h2>
        </div>
        
        {/* Today's total patients - highlighted but compact */}
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {patientsOnSelectedDate.length}
          </p>
          <p className="text-xs text-blue-600">
            total {patientsOnSelectedDate.length === 1 ? "patient" : "patients"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patient Status Summary - Compact */}
        <div>
          <h3 className="text-xs font-medium text-blue-800 mb-2">Status Summary</h3>
          <div className="grid grid-cols-5 gap-1">
            {statuses.map((status) => {
              const count = patientsOnSelectedDate.filter(
                (patient) => patient.status === status.id
              ).length;
              return (
                <div
                  key={status.id}
                  className={`${status.bgColor} border border-gray-200 rounded p-2 text-center`}
                >
                  <div className={`text-sm font-bold ${status.textColor}`}>
                    {count}
                  </div>
                  <div className={`text-xs ${status.textColor} truncate`} title={status.label}>
                    {status.label.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next 3 Days Preview - Compact */}
        <div>
          <h3 className="text-xs font-medium text-blue-800 mb-2">Next 3 Days</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((daysAhead) => {
              const futureDate = new Date(parseISO(selectedDate));
              futureDate.setDate(futureDate.getDate() + daysAhead);
              const futurePatients = patientData.filter((patient) =>
                isSameDay(parseISO(patient.date), futureDate)
              );
              
              return (
                <div
                  key={daysAhead}
                  className="bg-white bg-opacity-60 border border-blue-200 rounded p-2 text-center"
                >
                  <div className="text-sm font-semibold text-blue-700">
                    {futurePatients.length}
                  </div>
                  <div className="text-xs text-blue-600">
                    {format(futureDate, "MMM dd")}
                  </div>
                  <div className="text-xs text-blue-500">
                    {format(futureDate, "EEE")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
