"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  MessageCircle,
  Clock,
  User,
  RefreshCw,
  Archive,
  AlertTriangle,
  CalendarCheck,
} from "lucide-react";
import {
  useReservations,
  useReservationsByDate,
} from "@/lib/queries/hooks/useReservations";
import { useDoctors } from "@/lib/queries/hooks/useDoctors";
import { useBranches } from "@/lib/queries/hooks/useBranches";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ManualRegistrationForm } from "@/components/ManualRegistrationForm";

// Status colors and labels - Updated for scheduled appointments
const STATUS_CONFIG = {
  SCHEDULED: {
    label: "Terjadwal",
    color: "bg-green-100 text-green-800",
    icon: Calendar,
  },
  ENCOUNTER_READY: {
    label: "Siap Encounter",
    color: "bg-purple-100 text-purple-800",
    icon: CalendarCheck,
  },
  IN_ENCOUNTER: {
    label: "Sedang Encounter",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  COMPLETED: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-800",
    icon: RefreshCw,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-800",
    icon: Archive,
  },
};

const STATUS_TRANSITIONS = {
  SCHEDULED: ["ENCOUNTER_READY", "CANCELLED"],
  ENCOUNTER_READY: ["IN_ENCOUNTER", "CANCELLED"],
  IN_ENCOUNTER: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AppointmentManagementPage() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isManualRegisterOpen, setIsManualRegisterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);

  // Organization ID
  const organizationId = "org_WdM3kHvuUApaQCEi";

  // Fetch data
  const {
    data: reservations,
    isLoading: reservationsLoading,
    refetch,
  } = useReservations();
  const { data: branches } = useBranches(organizationId);
  const { data: doctors, isLoading: doctorsLoading } =
    useDoctors(selectedBranch);

  // Fetch reservations for selected date and doctor
  const { data: dateReservations, isLoading: dateReservationsLoading } =
    useReservationsByDate(
      selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
      selectedDoctor,
      selectedBranch
    );

  // Reset doctor when branch changes
  useEffect(() => {
    if (selectedBranch) {
      setSelectedDoctor("");
      setSelectedTimeslot(null);
    }
  }, [selectedBranch]);

  const handleSchedulePatient = (reservation) => {
    setSelectedReservation(reservation);
    setSelectedTimeslot(null); // Reset selected timeslot
    setSelectedBranch(""); // Reset selected branch
    setSelectedDoctor(""); // Reset selected doctor
    setIsScheduleModalOpen(true);
  };

  const handleWhatsAppContact = (reservation) => {
    const message = encodeURIComponent(
      `Halo ${reservation.name}, ini dari Klinik. Kami ingin mengkonfirmasi jadwal appointment Anda untuk keluhan ${reservation.complaint} dengan ${reservation.doctorName}. Mohon konfirmasi kehadiran Anda.`
    );
    const whatsappUrl = `https://wa.me/${reservation.phone.replace(
      /[^\d]/g,
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const confirmSchedule = () => {
    // TODO: Implement schedule confirmation logic
    console.log("Scheduling patient:", selectedReservation);
    console.log("Selected branch:", selectedBranch);
    console.log("Selected doctor:", selectedDoctor);
    console.log("Selected timeslot:", selectedTimeslot);
    setIsScheduleModalOpen(false);
    setSelectedReservation(null);
    setSelectedTimeslot(null);
    setSelectedBranch("");
    setSelectedDoctor("");
  };

  // Helper function to generate time slots for the day
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endMinute = minute + slotDuration;
        const endHour = endMinute >= 60 ? hour + 1 : hour;
        const adjustedEndMinute = endMinute >= 60 ? endMinute - 60 : endMinute;
        const endTime = `${endHour
          .toString()
          .padStart(2, "0")}:${adjustedEndMinute.toString().padStart(2, "0")}`;

        slots.push({
          startTime,
          endTime,
          isAvailable: true,
        });
      }
    }
    return slots;
  };

  // Check if a time slot conflicts with existing reservations
  const isTimeSlotOccupied = (startTime, endTime) => {
    if (!dateReservations) return false;

    return dateReservations.some((reservation) => {
      const reservationStart = reservation.startTime;
      const reservationEnd = reservation.endTime;

      // Check for time overlap
      return (
        (startTime >= reservationStart && startTime < reservationEnd) ||
        (endTime > reservationStart && endTime <= reservationEnd) ||
        (startTime <= reservationStart && endTime >= reservationEnd)
      );
    });
  };

  // Get patient name for occupied slots
  const getOccupiedSlotInfo = (startTime, endTime) => {
    if (!dateReservations) return null;

    const reservation = dateReservations.find((reservation) => {
      const reservationStart = reservation.startTime;
      const reservationEnd = reservation.endTime;

      return (
        (startTime >= reservationStart && startTime < reservationEnd) ||
        (endTime > reservationStart && endTime <= reservationEnd) ||
        (startTime <= reservationStart && endTime >= reservationEnd)
      );
    });

    return reservation
      ? {
          patientName: reservation.name,
          complaint: reservation.complaint,
          status: reservation.status,
        }
      : null;
  };

  const confirmStatusUpdate = (
    newStatus,
    reservation = selectedReservation
  ) => {
    // TODO: Implement status update logic
    console.log("Updating status:", reservation, "to", newStatus);
    setSelectedReservation(null);
    refetch();
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "Waktu tidak tersedia";

    try {
      // Handle time-only format (HH:mm:ss)
      return `${startTime} - ${endTime}`;
    } catch {
      return "Waktu tidak valid";
    }
  };

  if (reservationsLoading || doctorsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Memuat data reservasi...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Appointment Terjadwal
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola appointment yang sudah dikonfirmasi dan terjadwal
            </p>
          </div>
          {/* <Button
            onClick={() => setIsManualRegisterOpen(true)}
            className="bg-[#132a13] hover:bg-[#31572c] cursor-pointer"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Reservasi Manual
          </Button> */}
          {/* <div></div>  */}
        </div>
        <div>Untuk pasien yang ga bisa daftar lewat online</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count =
              reservations?.filter((r) => r.status === status).length || 0;
            const Icon = config.icon;

            return (
              <Card key={status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {config.label}
                      </p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Reservasi</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Jam</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations?.map((reservation, index) => {
                    const statusConfig = STATUS_CONFIG[reservation.status];
                    const StatusIcon = statusConfig?.icon || AlertTriangle;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{reservation.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.complaint}</TableCell>
                        <TableCell>{reservation.doctorName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-gray-500">
                              {formatTime(
                                reservation.startTime,
                                reservation.endTime
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusConfig?.color || "bg-gray-100 text-gray-800"
                            }
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig?.label || reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleSchedulePatient(reservation)}
                              disabled={
                                reservation.status === "COMPLETED" ||
                                reservation.status === "CANCELLED"
                              }
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleWhatsAppContact(reservation)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="cursor-pointer"
                                  disabled={
                                    STATUS_TRANSITIONS[reservation.status]
                                      ?.length === 0
                                  }
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                {STATUS_TRANSITIONS[reservation.status]?.map(
                                  (status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      className="cursor-pointer"
                                      onClick={() =>
                                        confirmStatusUpdate(status, reservation)
                                      }
                                    >
                                      <Badge
                                        className={`${STATUS_CONFIG[status]?.color} mr-2`}
                                      >
                                        {STATUS_CONFIG[status]?.label}
                                      </Badge>
                                      {status === "CONFIRMED" &&
                                        "Konfirmasi appointment"}
                                      {status === "COMPLETED" &&
                                        "Tandai sebagai selesai"}
                                      {status === "CANCELLED" &&
                                        "Batalkan appointment"}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Patient Modal */}
        <Dialog
          open={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
        >
          <DialogContent className="max-w-[50vw] w-1/3 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Jadwalkan Pasien</DialogTitle>
              <DialogDescription>
                Pilih jadwal yang tersedia untuk {selectedReservation?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Branch and Doctor Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pilih Cabang</label>
                  <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Pilih cabang" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id}
                          className="cursor-pointer"
                        >
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Pilih Dokter</label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                    disabled={!selectedBranch}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Pilih dokter" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id}
                          className="cursor-pointer"
                        >
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedBranch && (
                    <p className="text-sm text-gray-500 mt-1">
                      Pilih cabang terlebih dahulu
                    </p>
                  )}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Pilih Tanggal
                </label>
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/* Available Timeslots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Jadwal Waktu -{" "}
                    {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
                  </label>
                  {selectedDoctor && dateReservations && (
                    <div className="text-xs text-gray-500">
                      {dateReservations.length} appointment terjadwal
                    </div>
                  )}
                </div>

                {dateReservationsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Memuat jadwal...</span>
                  </div>
                ) : selectedDoctor ? (
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {generateTimeSlots().map((slot, index) => {
                        const isOccupied = isTimeSlotOccupied(
                          slot.startTime,
                          slot.endTime
                        );
                        const occupiedInfo = getOccupiedSlotInfo(
                          slot.startTime,
                          slot.endTime
                        );
                        const isSelected =
                          selectedTimeslot &&
                          selectedTimeslot.startTime === slot.startTime &&
                          selectedTimeslot.endTime === slot.endTime;

                        return (
                          <div
                            key={index}
                            className={`
                              p-3 rounded-lg border-2 transition-all cursor-pointer
                              ${
                                isSelected
                                  ? "border-green-500 bg-green-50"
                                  : isOccupied
                                  ? "border-red-200 bg-red-50 cursor-not-allowed"
                                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                              }
                            `}
                            onClick={() => {
                              if (!isOccupied) {
                                setSelectedTimeslot(slot);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`
                                  w-3 h-3 rounded-full 
                                  ${
                                    isSelected
                                      ? "bg-green-500"
                                      : isOccupied
                                      ? "bg-red-500"
                                      : "bg-green-400"
                                  }
                                `}
                                />
                                <div>
                                  <div className="font-medium text-sm">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                  {isOccupied && occupiedInfo && (
                                    <div className="text-xs text-red-600">
                                      {occupiedInfo.patientName} -{" "}
                                      {occupiedInfo.complaint}
                                    </div>
                                  )}
                                  {isSelected && (
                                    <div className="text-xs text-green-600">
                                      Slot terpilih untuk{" "}
                                      {selectedReservation?.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs">
                                {isOccupied ? (
                                  <Badge className="bg-red-100 text-red-800">
                                    {occupiedInfo?.status || "Terisi"}
                                  </Badge>
                                ) : isSelected ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    Dipilih
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800">
                                    Tersedia
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="border-t p-3 bg-gray-50">
                      <div className="text-xs font-medium mb-2">
                        Keterangan:
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Tersedia</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Dipilih</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span>Terisi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 text-center border rounded-lg">
                    Pilih dokter terlebih dahulu untuk melihat jadwal
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsScheduleModalOpen(false);
                    setSelectedTimeslot(null);
                    setSelectedBranch("");
                    setSelectedDoctor("");
                  }}
                  className="cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  onClick={confirmSchedule}
                  className="cursor-pointer"
                  disabled={!selectedTimeslot}
                >
                  Konfirmasi Jadwal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manual Registration Modal */}
        <Dialog
          open={isManualRegisterOpen}
          onOpenChange={setIsManualRegisterOpen}
        >
          <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Manual</DialogTitle>
              <DialogDescription>
                Daftarkan pasien yang datang langsung ke klinik
              </DialogDescription>
            </DialogHeader>

            <ManualRegistrationForm
              source="WALKIN"
              onClose={() => setIsManualRegisterOpen(false)}
              onSuccess={() => {
                setIsManualRegisterOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
