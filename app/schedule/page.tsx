"use client";

import { Layout } from "@/components/layout/Layout";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import default styles
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  parseISO,
} from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Date-fns localization setup
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

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
      doctor: `Doctor ${Math.ceil(i / 10)}`,
      date: `2025-05-${String(day).padStart(2, "0")}`,
      timeline: [
        {
          date: `2025-04-${String((day % 30) + 1).padStart(2, "0")}`,
          description: `Visited for check-up with Doctor ${Math.ceil(i / 10)}`,
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
  const [selectedDate, setSelectedDate] = useState("2025-05-01");
  const [selectedRow, setSelectedRow] = useState(null);

  const patientsOnSelectedDate = dummyData.filter((row) =>
    isSameDay(parseISO(row.date), parseISO(selectedDate))
  );

  const handleEventClick = (event) => {
    const patient = dummyData.find((row) => row.id === event.id);
    setSelectedRow(patient);
  };

  const dayPropGetter = (date) => {
    const eventsOnDay = dummyData.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );
    return {
      className: isSameDay(date, new Date()) ? "bg-yellow-200" : "",
      children: (
        <div className="relative">
          <span>{format(date, "d")}</span>
          {eventsOnDay.length > 0 && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {eventsOnDay.length}
            </div>
          )}
        </div>
      ),
    };
  };

  return (
    <Layout>
      <div className="flex h-full w-full">
        {/* Calendar Section */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
          <Calendar
            localizer={localizer}
            events={dummyData.map((row) => ({
              id: row.id,
              title: row.name,
              start: parseISO(row.date),
              end: parseISO(row.date),
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleEventClick}
            dayPropGetter={dayPropGetter}
            views={["month"]} // Remove "Agenda" view
            className="border rounded-lg shadow-md"
          />
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
                {selectedRow.timeline
                  .slice()
                  .reverse() // Reverse to show latest data on top
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-4"
                    >
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
