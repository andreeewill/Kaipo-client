"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  RefreshCw,
  User,
  MessageSquare,
  AlertTriangle,
  CheckSquare,
  XSquare,
} from "lucide-react";
import { useReservations } from "@/lib/queries/hooks/useReservations";
import { useBranches } from "@/lib/queries/hooks/useBranches";
import { useDoctors } from "@/lib/queries/hooks/useDoctors";
import { useTimeslots } from "@/lib/queries/hooks/useTimeslots";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Status configuration
const CONFIRMATION_STATUS_CONFIG = {
  CREATED: {
    label: "Perlu Konfirmasi",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    needsAction: true,
  },
  UNDER_REVIEW: {
    label: "Sedang Ditinjau",
    color: "bg-blue-100 text-blue-800",
    icon: RefreshCw,
    needsAction: true,
  },
  SCHEDULED: {
    label: "Terjadwal",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    needsAction: false,
  },
  ENCOUNTER_READY: {
    label: "Siap Encounter",
    color: "bg-purple-100 text-purple-800",
    icon: CalendarCheck,
    needsAction: false,
  },
};

export default function SchedulingConfirmationPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeslot, setSelectedTimeslot] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [confirmationType, setConfirmationType] = useState("DIRECT_CONFIRM");

  // Organization ID
  const organizationId = "org_WdM3kHvuUApaQCEi";

  // Fetch data
  const {
    data: reservations,
    isLoading: reservationsLoading,
    refetch,
  } = useReservations();

  const { data: branches } = useBranches(organizationId);
  const { data: doctors } = useDoctors(selectedBranch);
  const { data: timeslots } = useTimeslots(selectedBranch, selectedDoctor);

  // Filter reservations that need confirmation
  const pendingConfirmations = reservations?.filter(r => 
    ['CREATED', 'UNDER_REVIEW'].includes(r.status)
  ) || [];

  const handleConfirmSchedule = (patient) => {
    setSelectedPatient(patient);
    setIsConfirmationModalOpen(true);
    // Reset form
    setSelectedBranch("");
    setSelectedDoctor("");
    setSelectedTimeslot("");
    setAdminNotes("");
    setConfirmationType("DIRECT_CONFIRM");
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedTimeslot) {
      alert("Mohon pilih waktu appointment");
      return;
    }

    // TODO: Implement API call to confirm scheduling
    console.log("Confirming schedule for:", {
      patient: selectedPatient,
      branch: selectedBranch,
      doctor: selectedDoctor,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeslot: selectedTimeslot,
      notes: adminNotes,
      type: confirmationType,
    });

    // Close modal and refresh
    setIsConfirmationModalOpen(false);
    setSelectedPatient(null);
    refetch();
  };

  const handleRejectAppointment = (patient) => {
    if (confirm(`Apakah Anda yakin ingin menolak appointment untuk ${patient.name}?`)) {
      // TODO: Implement API call to reject
      console.log("Rejecting appointment for:", patient);
      refetch();
    }
  };

  const handleWhatsAppNotification = (patient, isConfirmation = true) => {
    const message = isConfirmation
      ? encodeURIComponent(
          `Halo ${patient.name}, appointment Anda telah dikonfirmasi untuk keluhan ${patient.complaint}. Terima kasih.`
        )
      : encodeURIComponent(
          `Halo ${patient.name}, kami butuh konfirmasi lebih lanjut mengenai appointment Anda untuk keluhan ${patient.complaint}.`
        );
    
    const whatsappUrl = `https://wa.me/${patient.phone.replace(
      /[^\d]/g,
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: id });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (time) => {
    return time?.substring(0, 5) || time;
  };

  const getDayName = (dayOfWeek) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[parseInt(dayOfWeek)] || dayOfWeek;
  };

  if (reservationsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Memuat data konfirmasi...</p>
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
              Konfirmasi Jadwal
            </h1>
            <p className="text-gray-600 mt-2">
              Tinjau dan konfirmasi jadwal appointment pasien
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Perlu Konfirmasi
                  </p>
                  <p className="text-2xl font-bold">{pendingConfirmations.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Website</p>
                  <p className="text-2xl font-bold">
                    {pendingConfirmations.filter(r => r.source === 'WEBSITE').length}
                  </p>
                </div>
                <div className="text-2xl">🌐</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">WhatsApp/Walk-in</p>
                  <p className="text-2xl font-bold">
                    {pendingConfirmations.filter(r => ['WHATSAPP', 'WALKIN'].includes(r.source)).length}
                  </p>
                </div>
                <div className="text-2xl">💬</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Confirmations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Menunggu Konfirmasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Waktu Diajukan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingConfirmations.map((reservation, index) => {
                    const statusConfig = CONFIRMATION_STATUS_CONFIG[reservation.status];
                    const StatusIcon = statusConfig?.icon || AlertTriangle;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{reservation.name}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {reservation.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            reservation.source === 'WEBSITE' ? "bg-indigo-100 text-indigo-800" :
                            reservation.source === 'WHATSAPP' ? "bg-green-100 text-green-800" :
                            "bg-orange-100 text-orange-800"
                          }>
                            {reservation.source === 'WEBSITE' ? '🌐 Website' :
                             reservation.source === 'WHATSAPP' ? '💬 WhatsApp' :
                             '🚶 Walk-in'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={reservation.complaint}>
                            {reservation.complaint}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {reservation.createdAt ? formatDate(reservation.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig?.label || reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => handleConfirmSchedule(reservation)}
                            >
                              <CheckSquare className="h-4 w-4 mr-1" />
                              Konfirmasi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleWhatsAppNotification(reservation, false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                              onClick={() => handleRejectAppointment(reservation)}
                            >
                              <XSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {pendingConfirmations.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada appointment yang perlu dikonfirmasi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Konfirmasi Jadwal untuk {selectedPatient?.name}</DialogTitle>
              <DialogDescription>
                Atur jadwal final untuk pasien: {selectedPatient?.complaint}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Confirmation Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jenis Konfirmasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={confirmationType} onValueChange={setConfirmationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis konfirmasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIRECT_CONFIRM">Konfirmasi Langsung</SelectItem>
                      <SelectItem value="RESCHEDULE">Reschedule</SelectItem>
                      <SelectItem value="FIRST_TIME_SCHEDULE">Jadwal Pertama Kali</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Branch and Doctor Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pilih Cabang</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih cabang" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pilih Dokter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor} disabled={!selectedBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dokter" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pilih Tanggal</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pilih Waktu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedTimeslot} onValueChange={setSelectedTimeslot} disabled={!selectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeslots?.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {getDayName(slot.dayOfWeek)} ({formatTime(slot.startTime)} - {formatTime(slot.endTime)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Catatan Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Tambahkan catatan khusus untuk appointment ini..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmationModalOpen(false)}
                  className="cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitConfirmation}
                  disabled={!selectedTimeslot}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Konfirmasi Jadwal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
