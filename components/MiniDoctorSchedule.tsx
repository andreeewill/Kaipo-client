"use client";

import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useReservations } from "@/lib/queries";

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
    status: string;
  };
}

interface MiniDoctorScheduleProps {
  doctorId?: string;
  organizationId?: string;
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

export function MiniDoctorSchedule({
  doctorId,
  organizationId = "org_WdM3kHvuUApaQCEi",
  className = "",
}: MiniDoctorScheduleProps) {
  // Fetch all reservations
  const { data: reservations = [], isLoading } = useReservations(organizationId);

  // Filter and convert reservations to calendar events for the selected doctor
  const events = useMemo(() => {
    if (!doctorId) return [];

    return reservations
      .filter((reservation) => {
        // Filter by doctor if provided
        if (doctorId && reservation.doctorId !== doctorId) return false;
        
        // Only show scheduled reservations (not completed or cancelled)
        if (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') return false;
        
        // Must have start and end time
        return reservation.startTime && reservation.endTime;
      })
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
            status: reservation.status,
          },
        };
      });
  }, [reservations, doctorId]);

  // Count patients in the week
  const patientCount = events.length;

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource?.status || "CREATED";
    const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    
    return {
      style: {
        backgroundColor: statusConfig?.color.replace("bg-", "#").replace("-500", "") || "#3174ad",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "11px",
        padding: "2px 4px",
      },
    };
  };

  // Custom event component
  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    return (
      <div className="text-[10px] leading-tight">
        <strong>{event.title}</strong>
      </div>
    );
  };

  if (!doctorId) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>Jadwal Dokter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-sm text-gray-500">
            Pilih dokter untuk melihat jadwal
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>Jadwal Dokter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-sm text-gray-500">
            Memuat jadwal...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Jadwal Dokter Minggu Ini</span>
          </div>
          <div className="text-xs font-normal text-gray-500">
            {patientCount} pasien terjadwal
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="mini-doctor-schedule-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            view={Views.WEEK}
            views={[Views.WEEK]}
            toolbar={false}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent,
            }}
            formats={{
              dayHeaderFormat: (date) => format(date, "EEE dd", { locale: idLocale }),
              timeGutterFormat: (date) => format(date, "HH:mm", { locale: idLocale }),
              eventTimeRangeFormat: ({ start, end }) =>
                `${format(start, "HH:mm", { locale: idLocale })} - ${format(end, "HH:mm", { locale: idLocale })}`,
            }}
            step={30}
            timeslots={2}
            min={new Date(2025, 0, 1, 7, 0, 0)} // 7 AM
            max={new Date(2025, 0, 1, 21, 0, 0)} // 9 PM
          />
        </div>
      </CardContent>

      <style jsx global>{`
        .mini-doctor-schedule-wrapper .rbc-calendar {
          font-family: inherit;
          font-size: 11px;
        }
        
        .mini-doctor-schedule-wrapper .rbc-header {
          padding: 6px 2px;
          font-weight: 600;
          font-size: 11px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .mini-doctor-schedule-wrapper .rbc-today {
          background-color: #ecf39e20;
        }

        .mini-doctor-schedule-wrapper .rbc-time-slot {
          min-height: 30px;
        }

        .mini-doctor-schedule-wrapper .rbc-time-content {
          border-top: 1px solid #e5e7eb;
        }

        .mini-doctor-schedule-wrapper .rbc-current-time-indicator {
          background-color: #31572c;
          height: 2px;
        }

        .mini-doctor-schedule-wrapper .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #f3f4f6;
        }

        .mini-doctor-schedule-wrapper .rbc-timeslot-group {
          min-height: 60px;
          border-left: 1px solid #e5e7eb;
        }

        .mini-doctor-schedule-wrapper .rbc-time-header-content {
          border-left: 1px solid #e5e7eb;
        }

        .mini-doctor-schedule-wrapper .rbc-time-gutter {
          font-size: 10px;
          width: 50px;
        }

        .mini-doctor-schedule-wrapper .rbc-event {
          padding: 1px 3px;
        }

        .mini-doctor-schedule-wrapper .rbc-event-label {
          font-size: 9px;
        }
      `}</style>
    </Card>
  );
}
