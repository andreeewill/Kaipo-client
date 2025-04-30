"use client";

import { Layout } from "@/components/layout/Layout";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import default styles
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      title: "Initial Event",
      start: new Date(),
      end: new Date(),
      description: "This is an initial event.",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end, description: "" });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = () => {
    setEvents((prev) => [
      ...prev,
      {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      },
    ]);
    setNewEvent({ title: "", start: "", end: "", description: "" });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) =>
            alert(`Event: ${event.title}\nDescription: ${event.description}`)
          }
          className="border rounded-lg shadow-md"
        />

        {/* Modal for Adding Events */}
        {isModalOpen && (
          <Dialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add Event</h2>
              <Input
                name="title"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                name="start"
                type="datetime-local"
                placeholder="Start Time"
                value={newEvent.start}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                name="end"
                type="datetime-local"
                placeholder="End Time"
                value={newEvent.end}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Textarea
                name="description"
                placeholder="Event Description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEvent}>Save</Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
