"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusTimeline } from "./StatusTimeline";
import { StatusIndicator } from "./StatusIndicator";
import { Status, Patient } from "@/types/patient";

interface PatientTableProps {
  patients: Patient[];
  statuses: Status[];
  expandedRows: Set<number>;
  onRowClick: (patient: Patient) => void;
  onToggleExpansion: (patientId: number) => void;
  onStatusUpdate: (patientId: number, newStatus: string) => void;
  onDetailsClick: (patient: Patient) => void;
  onSort: (column: string) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  statuses,
  expandedRows,
  onRowClick,
  onToggleExpansion,
  onStatusUpdate,
  onDetailsClick,
  onSort,
}) => {
  const getStatusInfo = (statusId: string) => {
    return statuses.find(status => status.id === statusId) || statuses[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("id")}
            >
              ID
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("name")}
            >
              Name
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("age")}
            >
              Age
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("gender")}
            >
              Gender
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("diagnosis")}
            >
              Diagnosis
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("doctor")}
            >
              Doctor
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("date")}
            >
              Date
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 py-4"
              onClick={() => onSort("status")}
            >
              Status
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient, index) => {
            const statusInfo = getStatusInfo(patient.status);
            const isExpanded = expandedRows.has(patient.id);
            return (
              <React.Fragment key={patient.id}>
                <TableRow
                  onClick={() => onRowClick(patient)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="py-3">{patient.id}</TableCell>
                  <TableCell className="py-3 font-medium">
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleExpansion(patient.id);
                        }}
                        className="mr-2 p-1 hover:bg-gray-200 rounded cursor-pointer"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
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
                      </button>
                      {patient.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{patient.age}</TableCell>
                  <TableCell className="py-3">{patient.gender}</TableCell>
                  <TableCell className="py-3">{patient.diagnosis}</TableCell>
                  <TableCell className="py-3">{patient.doctor}</TableCell>
                  <TableCell className="py-3">{patient.date}</TableCell>
                  <TableCell className="py-3">
                    <StatusIndicator status={statusInfo} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        View
                      </Button>
                      <Select onValueChange={(newStatus) => onStatusUpdate(patient.id, newStatus)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${status.color} mr-2`}></div>
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDetailsClick(patient);
                        }}
                      >
                        Details
                        <svg
                          className="w-3 h-3 ml-1"
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
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-0">
                      <div className="bg-gray-50 p-6 border-t">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Patient Status Timeline
                        </h3>
                        <StatusTimeline
                          statuses={statuses}
                          currentStatus={patient.status}
                          className="px-8"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
