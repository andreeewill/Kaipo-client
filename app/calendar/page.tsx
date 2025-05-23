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
  isToday,
  parseISO,
} from "date-fns";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

// Generate dummy data for the calendar
const generateDummyData = () => {
  const data = [];
  for (let i = 1; i <= 100; i++) {
    const day = (i % 30) + 1; // Distribute patients across days in May
    data.push({
      id: i,
      title: `Patient ${i}`,
      start: new Date(`2025-05-${String(day).padStart(2, "0")}T09:00:00`),
      end: new Date(`2025-05-${String(day).padStart(2, "0")}T10:00:00`),
      description: `Routine check-up with Doctor ${Math.ceil(i / 10)}`,
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

export default function CalendarPage() {
  const [events, setEvents] = useState(dummyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ title: "", start, end, description: "" });
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const today = new Date();
  const todaysEvents = events.filter((event) => isSameDay(event.start, today));

  // Custom event rendering to show the number of appointments
  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: isToday(event.start) ? "#ffeb3b" : "#3174ad", // Highlight today's events
        color: "white",
        borderRadius: "5px",
        padding: "5px",
        textAlign: "center",
      },
    };
  };

  // Custom day rendering to show the number of appointments
  const dayPropGetter = (date) => {
    const eventsOnDay = events.filter((event) => isSameDay(event.start, date));
    return {
      className: isToday(date) ? "bg-lime-500" : "",
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Event Calendar</h1>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Summary Section */}
          <div className="flex-1 p-6 border rounded-lg shadow-md bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
            <p className="text-gray-700 mb-6">
              <strong>Date:</strong> {format(today, "MMMM dd, yyyy")}
            </p>
            <div>
              <h3 className="text-lg font-medium mb-3">Scheduled Patients:</h3>
              {todaysEvents.length > 0 ? (
                <div className="space-y-3">
                  {todaysEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => handleEventClick(event)}
                    >
                      <div>
                        <strong>{event.title}</strong>
                        <p className="text-sm text-gray-600">
                          {format(event.start, "hh:mm a")} -{" "}
                          {format(event.end, "hh:mm a")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No patients scheduled for today.
                </p>
              )}
            </div>
            <div className="mt-6 p-6 bg-blue-100 border border-blue-300 rounded-lg text-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Total Patients Today
              </p>
              <p className="text-6xl font-bold text-blue-600">
                {todaysEvents.length}
              </p>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="flex-1">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => handleEventClick(event)}
              eventPropGetter={eventPropGetter}
              dayPropGetter={dayPropGetter}
              className="border rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
              <p>
                <strong>Start:</strong>{" "}
                {format(new Date(selectedEvent.start), "MMMM dd, yyyy hh:mm a")}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {format(new Date(selectedEvent.end), "MMMM dd, yyyy hh:mm a")}
              </p>
              <p className="mt-4">
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Timeline</h3>
                <div className="space-y-4">
                  {selectedEvent.timeline
                    .reverse() // Show latest events first
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
              <div className="mt-6 text-right">
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
