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
} from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  for (let i = 1; i <= 150; i++) {
    // Increase the number of events
    const month = Math.ceil(i / 50) + 4; // Distribute events across May (5), June (6), and July (7)
    const day = (i % 31) + 1; // Ensure the day is within the valid range for each month
    data.push({
      id: i,
      title: `Patient ${i}`,
      start: new Date(
        `2025-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}T09:00:00`
      ),
      end: new Date(
        `2025-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}T10:00:00`
      ),
      description: `Routine check-up with Doctor ${Math.ceil(i / 10)}`,
      timeline: [
        {
          date: `2025-${String(month - 1).padStart(2, "0")}-${String(
            (day % 30) + 1
          ).padStart(2, "0")}`,
          description: `Visited for check-up with Doctor ${Math.ceil(i / 10)}`,
        },
        {
          date: `2025-${String(month - 2).padStart(2, "0")}-${String(
            (day % 30) + 5
          ).padStart(2, "0")}`,
          description: `Follow-up for Diagnosis ${i}`,
        },
      ],
    });
  }
  return data;
};

const dummyData = generateDummyData();

export default function CalendarPage() {
  const [events] = useState(dummyData);
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

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Event Calendar</h1>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Summary Section */}
          <div className="flex-1 p-6 border rounded-lg shadow-md bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Reservasi Hari ini</h2>
            <p className="text-gray-700 mb-6">
              <strong>Tanggal:</strong> {format(today, "MMMM dd, yyyy")}
            </p>
            <div>
              <h3 className="text-lg font-medium mb-3">Pasien Hari Ini:</h3>
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
                  Tidak ada pasien yang dijadwalkan hari ini.
                </p>
              )}
            </div>
            <div className="mt-6 p-6 bg-blue-100 border border-blue-300 rounded-lg text-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Total Pasien Hari Ini :
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
              views={["month"]} // Restrict to "Month" view only
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => handleEventClick(event)}
              components={{
                event: ({ event }) => (
                  <span>
                    <strong>{event.title}</strong>
                    <br />
                  </span>
                ),
              }}
              // eventPropGetter={eventPropGetter}
              // dayPropGetter={dayPropGetter} // Use dayPropGetter for custom day cell rendering
              className="border rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && ( // Only render the Dialog if an event is selected
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Details of the scheduled appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Start:
                  </p>
                  <p className="col-span-3">
                    {format(
                      new Date(selectedEvent.start),
                      "MMMM dd, yyyy hh:mm a"
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    End:
                  </p>
                  <p className="col-span-3">
                    {format(
                      new Date(selectedEvent.end),
                      "MMMM dd, yyyy hh:mm a"
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description:
                  </p>
                  <p className="col-span-3">{selectedEvent.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Timeline</h3>
                <div className="space-y-4">
                  {selectedEvent?.timeline &&
                    selectedEvent.timeline
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
              <DialogFooter>
                <Button className="cursor-pointer" onClick={handleCloseModal}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
