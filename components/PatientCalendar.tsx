"use client";

import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User, Phone, FileText } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Date-fns localization setup with Indonesian locale
const locales = {
  "id-ID": idLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday as first day
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    patientName: string;
    phone: string;
    complaint: string;
    doctorName?: string;
    status: string;
    source?: string;
  };
}

interface PatientCalendarProps {
  reservations: any[]; // Array of reservations from API
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  defaultView?: View;
  height?: number | string;
  className?: string;
}

// Status configuration
const STATUS_CONFIG = {
  CREATED: { label: "Baru Dibuat", color: "bg-blue-500" },
  UNDER_REVIEW: { label: "Sedang Ditinjau", color: "bg-yellow-500" },
  SCHEDULED: { label: "Terjadwal", color: "bg-green-500" },
  ENCOUNTER_READY: { label: "Siap Encounter", color: "bg-purple-500" },
  IN_ENCOUNTER: { label: "Sedang Encounter", color: "bg-indigo-500" },
  COMPLETED: { label: "Selesai", color: "bg-gray-500" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-500" },
};

export function PatientCalendar({
  reservations = [],
  onEventClick,
  onDateSelect,
  defaultView = Views.MONTH,
  height = 600,
  className = "",
}: PatientCalendarProps) {
  const [view, setView] = useState<View>(defaultView);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert reservations to calendar events
  const events = useMemo(() => {
    return reservations
      .filter((reservation) => reservation.startTime && reservation.endTime)
      .map((reservation) => {
        const startDate = new Date(reservation.startTime);
        const endDate = new Date(reservation.endTime);

        return {
          id: reservation.id || `${reservation.name}-${reservation.startTime}`,
          title: reservation.name,
          start: startDate,
          end: endDate,
          resource: {
            patientName: reservation.name,
            phone: reservation.phone,
            complaint: reservation.complaint,
            doctorName: reservation.doctorName,
            status: reservation.status,
            source: reservation.source,
          },
        };
      });
  }, [reservations]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return events.filter((event) => isSameDay(event.start, selectedDate));
  }, [events, selectedDate]);

  // Count patients by date for month view
  const patientCountByDate = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((event) => {
      const dateKey = format(startOfDay(event.start), "yyyy-MM-dd");
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    });
    return counts;
  }, [events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    onEventClick?.(event);
  };

  const handleSelectSlot = ({ start }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    onDateSelect?.(start);
  };

  const handleNavigate = (date: Date) => {
    setSelectedDate(date);
  };

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource?.status || "CREATED";
    const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    
    return {
      style: {
        backgroundColor: statusConfig?.color.replace("bg-", "#").replace("-500", "") || "#3174ad",
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  // Custom month date header to show patient count
  const CustomMonthDateHeader = ({ date, label }: any) => {
    const dateKey = format(startOfDay(date), "yyyy-MM-dd");
    const count = patientCountByDate.get(dateKey) || 0;

    return (
      <div className="rbc-date-cell-container">
        <div className="rbc-date-cell-date">{label}</div>
        {count > 0 && (
          <div className="patient-count-display">
            <div className="text-3xl font-bold text-[#31572c]">
              {count}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              pasien
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom event component for better display
  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    // In month view, don't show individual event names (only show count in day cell)
    if (view === Views.MONTH) {
      return null;
    }
    
    return (
      <div className="text-xs p-1">
        <strong>{event.title}</strong>
        {event.resource?.doctorName && (
          <div className="text-[10px] opacity-90">
            Dr. {event.resource.doctorName}
          </div>
        )}
      </div>
    );
  };

  // Custom toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    const label = () => {
      const date = toolbar.date;
      return format(date, view === Views.MONTH ? "MMMM yyyy" : "dd MMMM yyyy", {
        locale: idLocale,
      });
    };

    return (
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4 p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToBack}
            className="cursor-pointer"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="cursor-pointer"
          >
            Hari Ini
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="cursor-pointer"
          >
            →
          </Button>
          <span className="font-semibold text-lg ml-4">{label()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={view === Views.MONTH ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setView(Views.MONTH);
              toolbar.onView(Views.MONTH);
            }}
            className="cursor-pointer"
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Tanggal
          </Button>
          <Button
            variant={view === Views.DAY ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setView(Views.DAY);
              toolbar.onView(Views.DAY);
            }}
            className="cursor-pointer"
          >
            <Clock className="h-4 w-4 mr-1" />
            Jam
          </Button>
          <Button
            variant={view === Views.WEEK ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setView(Views.WEEK);
              toolbar.onView(Views.WEEK);
            }}
            className="cursor-pointer"
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Minggu
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`patient-calendar-wrapper ${className}`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height }}
          view={view}
          onView={setView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleNavigate}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
            month: {
              dateHeader: CustomMonthDateHeader,
            },
          }}
          messages={{
            today: "Hari Ini",
            previous: "Sebelumnya",
            next: "Selanjutnya",
            month: "Bulan",
            week: "Minggu",
            day: "Hari",
            agenda: "Agenda",
            date: "Tanggal",
            time: "Waktu",
            event: "Acara",
            showMore: (total) => `+ ${total} lagi`,
          }}
          formats={{
            monthHeaderFormat: (date) => format(date, "MMMM yyyy", { locale: idLocale }),
            dayHeaderFormat: (date) => format(date, "EEEE, dd MMMM yyyy", { locale: idLocale }),
            dayRangeHeaderFormat: ({ start, end }) =>
              `${format(start, "dd MMM", { locale: idLocale })} - ${format(end, "dd MMM yyyy", { locale: idLocale })}`,
            timeGutterFormat: (date) => format(date, "HH:mm", { locale: idLocale }),
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, "HH:mm", { locale: idLocale })} - ${format(end, "HH:mm", { locale: idLocale })}`,
          }}
          step={30}
          timeslots={2}
          min={new Date(2025, 0, 1, 7, 0, 0)} // 7 AM
          max={new Date(2025, 0, 1, 21, 0, 0)} // 9 PM
          className="border rounded-lg shadow-md bg-white"
        />

        {/* Today's Summary - Show when in month view */}
        {view === Views.MONTH && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Pasien pada {format(selectedDate, "dd MMMM yyyy", { locale: idLocale })}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-full w-32 h-32 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-blue-600">
                          {selectedDateEvents.length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Pasien</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total reservasi pada tanggal ini
                    </p>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-gray-400">0</p>
                        <p className="text-sm text-gray-500 mt-1">Pasien</p>
                      </div>
                    </div>
                    <p className="text-gray-500">
                      Tidak ada pasien yang dijadwalkan pada tanggal ini.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{selectedEvent.title}</span>
              </DialogTitle>
              <DialogDescription>Detail Reservasi Pasien</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Tanggal & Waktu</p>
                  <p className="text-base">
                    {format(selectedEvent.start, "EEEE, dd MMMM yyyy", { locale: idLocale })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(selectedEvent.start, "HH:mm", { locale: idLocale })} -{" "}
                    {format(selectedEvent.end, "HH:mm", { locale: idLocale })}
                  </p>
                </div>
              </div>

              {selectedEvent.resource?.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                    <p className="text-base">{selectedEvent.resource.phone}</p>
                  </div>
                </div>
              )}

              {selectedEvent.resource?.complaint && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Keluhan</p>
                    <p className="text-base">{selectedEvent.resource.complaint}</p>
                  </div>
                </div>
              )}

              {selectedEvent.resource?.doctorName && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dokter</p>
                    <p className="text-base">Dr. {selectedEvent.resource.doctorName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    className={
                      STATUS_CONFIG[selectedEvent.resource?.status as keyof typeof STATUS_CONFIG]
                        ?.color || "bg-gray-500"
                    }
                  >
                    {STATUS_CONFIG[selectedEvent.resource?.status as keyof typeof STATUS_CONFIG]
                      ?.label || selectedEvent.resource?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  // Handle edit or other actions
                  setIsModalOpen(false);
                }}
                className="bg-[#31572c] hover:bg-[#4f772d] cursor-pointer"
              >
                Edit Reservasi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx global>{`
        .patient-calendar-wrapper .rbc-calendar {
          font-family: inherit;
        }
        
        .patient-calendar-wrapper .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          font-size: 14px;
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .patient-calendar-wrapper .rbc-today {
          background-color: #ecf39e20;
        }

        .patient-calendar-wrapper .rbc-off-range-bg {
          background-color: #f9fafb;
        }

        .patient-calendar-wrapper .rbc-date-cell {
          padding: 8px;
          text-align: left;
        }

        /* Hide events in month view - show only count */
        .patient-calendar-wrapper .rbc-month-view .rbc-event,
        .patient-calendar-wrapper .rbc-month-view .rbc-row-segment,
        .patient-calendar-wrapper .rbc-month-view .rbc-event-content {
          display: none !important;
        }

        .patient-calendar-wrapper .rbc-month-row {
          min-height: 100px;
        }

        .patient-calendar-wrapper .rbc-date-cell-container {
          height: 100%;
          position: relative;
        }

        .patient-calendar-wrapper .rbc-date-cell-date {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .patient-calendar-wrapper .patient-count-display {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 40%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .patient-calendar-wrapper .rbc-event {
          padding: 2px 5px;
          font-size: 12px;
        }

        .patient-calendar-wrapper .rbc-time-slot {
          min-height: 40px;
        }

        .patient-calendar-wrapper .rbc-time-content {
          border-top: 2px solid #e5e7eb;
        }

        .patient-calendar-wrapper .rbc-current-time-indicator {
          background-color: #31572c;
          height: 2px;
        }

        .patient-calendar-wrapper .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #f3f4f6;
        }

        .patient-calendar-wrapper .rbc-timeslot-group {
          min-height: 80px;
          border-left: 1px solid #e5e7eb;
        }
      `}</style>
    </>
  );
}
