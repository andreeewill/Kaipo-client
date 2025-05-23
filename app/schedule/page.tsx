"use client";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, isSameDay, parseISO } from "date-fns";

// Dummy data for the table
const generateDummyData = () => {
  const data = [];
  for (let i = 1; i <= 50; i++) {
    const day = i % 30 || 1; // Ensure day is between 1 and 30
    data.push({
      id: i,
      name: `Patient ${i}`,
      age: Math.floor(Math.random() * 60) + 20,
      gender: i % 2 === 0 ? "Male" : "Female",
      diagnosis: `Diagnosis ${i}`,
      doctor: `Doctor ${i}`,
      date: `2025-05-${String(day).padStart(2, "0")}`,
      timeline: [
        {
          date: `2025-04-${String((day % 30) + 1).padStart(2, "0")}`,
          description: `Visited for check-up with Doctor ${i}`,
        },
        {
          date: `2025-03-${String((day % 30) + 5).padStart(2, "0")}`,
          description: `Follow-up for Diagnosis ${i}`,
        },
      ],
    });
  }
  return data;
};

const dummyData = generateDummyData();

export default function Schedule() {
  const [selected] = useState("Jadwal Pasien");
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2025-05-01");
  const rowsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = dummyData
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

  const patientsOnSelectedDate = dummyData.filter((row) =>
    isSameDay(parseISO(row.date), parseISO(selectedDate))
  );

  return (
    <Layout>
      <div className="flex h-full w-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">{selected}</h1>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date:
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Patients on {format(parseISO(selectedDate), "MMMM dd, yyyy")}
            </h2>
            <p className="text-4xl font-bold text-blue-600">
              {patientsOnSelectedDate.length}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  Age
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("gender")}
                >
                  Gender
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("diagnosis")}
                >
                  Diagnosis
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("doctor")}
                >
                  Doctor
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelectedRow(row)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.diagnosis}</TableCell>
                  <TableCell>{row.doctor}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        {selectedRow && (
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
              onClick={() => setSelectedRow(null)}
              className="mt-auto"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
