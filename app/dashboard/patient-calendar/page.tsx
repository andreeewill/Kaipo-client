"use client";

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PatientCalendar } from "@/components/PatientCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReservations } from "@/lib/queries/hooks/useReservations";
import { useBranches } from "@/lib/queries/hooks/useBranches";
import { useDoctors } from "@/lib/queries/hooks/useDoctors";
import { RefreshCw, Calendar, Users, Filter } from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Generate dummy data for visualization
const generateDummyReservations = () => {
  const today = new Date();
  const dummyData = [];
  
  const doctors = [
    { id: "doc_1", name: "Dr. Budi Santoso" },
    { id: "doc_2", name: "Dr. Ani Wijaya" },
    { id: "doc_3", name: "Dr. Citra Dewi" },
    { id: "doc_4", name: "Dr. Dedi Kurniawan" },
  ];
  
  const patients = [
    "Ahmad Rizki", "Siti Nurhaliza", "Budi Prakoso", "Maya Indah",
    "Dedi Setiawan", "Rina Susanti", "Fajar Ramadhan", "Lina Marlina",
    "Hendra Wijaya", "Putri Ayu", "Agus Salim", "Dewi Sartika",
    "Rudi Hartono", "Sari Wulandari", "Irfan Hakim", "Nisa Amalia",
    "Yoga Pratama", "Mira Lestari", "Arif Budiman", "Ratih Permata"
  ];
  
  const complaints = [
    "Sakit gigi geraham kiri",
    "Pembersihan karang gigi",
    "Konsultasi behel gigi",
    "Gigi berlubang perlu tambal",
    "Sakit gigi depan patah",
    "Cabut gigi bungsu",
    "Perawatan akar gigi",
    "Pemutihan gigi",
    "Gigi sensitif",
    "Gusi berdarah",
    "Pemasangan crown gigi",
    "Kontrol rutin 6 bulan"
  ];
  
  const statuses = ["CREATED", "UNDER_REVIEW", "SCHEDULED", "ENCOUNTER_READY", "IN_ENCOUNTER"];
  const sources = ["WHATSAPP", "WALKIN", "WEBSITE"];
  
  // Generate appointments for the past 7 days, today, and next 14 days
  for (let dayOffset = -7; dayOffset <= 14; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    
    // Skip Sundays (day 0)
    if (currentDate.getDay() === 0) continue;
    
    // Different number of appointments per day (2-8 appointments)
    const appointmentsPerDay = Math.floor(Math.random() * 7) + 2;
    
    // Morning appointments (8:00 - 12:00)
    const morningSlots = [
      { hour: 8, minute: 0 },
      { hour: 8, minute: 30 },
      { hour: 9, minute: 0 },
      { hour: 9, minute: 30 },
      { hour: 10, minute: 0 },
      { hour: 10, minute: 30 },
      { hour: 11, minute: 0 },
      { hour: 11, minute: 30 },
    ];
    
    // Afternoon appointments (13:00 - 17:00)
    const afternoonSlots = [
      { hour: 13, minute: 0 },
      { hour: 13, minute: 30 },
      { hour: 14, minute: 0 },
      { hour: 14, minute: 30 },
      { hour: 15, minute: 0 },
      { hour: 15, minute: 30 },
      { hour: 16, minute: 0 },
      { hour: 16, minute: 30 },
    ];
    
    // Evening appointments (18:00 - 20:00)
    const eveningSlots = [
      { hour: 18, minute: 0 },
      { hour: 18, minute: 30 },
      { hour: 19, minute: 0 },
      { hour: 19, minute: 30 },
      { hour: 20, minute: 0 },
    ];
    
    // Combine all slots
    const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
    
    // Randomly select time slots for this day
    const selectedSlots = [];
    const usedSlotIndices = new Set();
    
    for (let i = 0; i < appointmentsPerDay && i < allSlots.length; i++) {
      let slotIndex;
      do {
        slotIndex = Math.floor(Math.random() * allSlots.length);
      } while (usedSlotIndices.has(slotIndex));
      
      usedSlotIndices.add(slotIndex);
      selectedSlots.push(allSlots[slotIndex]);
    }
    
    // Sort slots by time
    selectedSlots.sort((a, b) => {
      if (a.hour !== b.hour) return a.hour - b.hour;
      return a.minute - b.minute;
    });
    
    // Create appointments for selected slots
    selectedSlots.forEach((slot, index) => {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const complaint = complaints[Math.floor(Math.random() * complaints.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      // Determine status based on date
      let status;
      if (dayOffset < 0) {
        // Past appointments
        status = Math.random() > 0.3 ? "COMPLETED" : "CANCELLED";
      } else if (dayOffset === 0) {
        // Today's appointments
        const appointmentHour = slot.hour;
        const currentHour = today.getHours();
        if (appointmentHour < currentHour - 1) {
          status = "COMPLETED";
        } else if (appointmentHour < currentHour) {
          status = "IN_ENCOUNTER";
        } else {
          status = Math.random() > 0.5 ? "ENCOUNTER_READY" : "SCHEDULED";
        }
      } else {
        // Future appointments
        status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      const startTime = setMinutes(setHours(currentDate, slot.hour), slot.minute);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
      
      dummyData.push({
        id: `dummy_${dayOffset}_${index}`,
        name: patient,
        phone: `0812${Math.floor(Math.random() * 90000000) + 10000000}`,
        complaint: complaint,
        doctorName: doctor.name,
        doctorId: doctor.id,
        status: status,
        source: source,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        branchId: "branch_1",
        createdAt: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  }
  
  return dummyData;
};

export default function PatientCalendarPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [useDummyData, setUseDummyData] = useState<boolean>(true); // Toggle for demo

  const organizationId = "org_WdM3kHvuUApaQCEi";

  // Fetch data
  const { data: reservations, isLoading, refetch } = useReservations(organizationId);
  const { data: branches, isLoading: branchesLoading } = useBranches(organizationId);
  const { data: doctors, isLoading: doctorsLoading } = useDoctors(
    selectedBranch !== "all" ? selectedBranch : undefined
  );

  // Generate dummy data
  const dummyReservations = generateDummyReservations();
  
  // Combine real data with dummy data (use dummy if no real data or if toggle is on)
  const allReservations = useDummyData 
    ? [...(reservations || []), ...dummyReservations]
    : (reservations || []);

  // Filter reservations based on selected filters
  const filteredReservations = allReservations?.filter((reservation) => {
    if (selectedBranch !== "all" && reservation.branchId !== selectedBranch) {
      return false;
    }
    if (selectedDoctor !== "all" && reservation.doctorId !== selectedDoctor) {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    total: filteredReservations?.length || 0,
    today: filteredReservations?.filter((r) => {
      if (!r.startTime) return false;
      const reservationDate = new Date(r.startTime);
      const today = new Date();
      return (
        reservationDate.getDate() === today.getDate() &&
        reservationDate.getMonth() === today.getMonth() &&
        reservationDate.getFullYear() === today.getFullYear()
      );
    }).length || 0,
    scheduled: filteredReservations?.filter(
      (r) => r.status === "SCHEDULED" || r.status === "ENCOUNTER_READY"
    ).length || 0,
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Memuat kalender pasien...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kalender Pasien</h1>
            <p className="text-gray-600 mt-2">
              Lihat jadwal reservasi pasien dalam tampilan kalender
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setUseDummyData(!useDummyData)}
              variant={useDummyData ? "default" : "outline"}
              className="cursor-pointer"
            >
              {useDummyData ? "Mode Demo (ON)" : "Mode Demo (OFF)"}
            </Button>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Demo Mode Info */}
        {useDummyData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                DEMO
              </div>
              <p className="text-sm text-blue-800">
                Mode demo aktif - Menampilkan {dummyReservations.length} data dummy untuk visualisasi. 
                Klik &quot;Mode Demo (ON)&quot; untuk melihat data real.
              </p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reservasi
                  </p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                  {useDummyData && (
                    <p className="text-xs text-gray-500 mt-1">
                      ({dummyReservations.length} dummy data)
                    </p>
                  )}
                </div>
                <Users className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Reservasi Hari Ini
                  </p>
                  <p className="text-3xl font-bold mt-2">{stats.today}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Terjadwal
                  </p>
                  <p className="text-3xl font-bold mt-2">{stats.scheduled}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Kalender</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cabang Klinik
                </label>
                {branchesLoading ? (
                  <div className="flex items-center space-x-2 p-2 border rounded-lg">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">
                      Memuat cabang...
                    </span>
                  </div>
                ) : (
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Semua Cabang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        Semua Cabang
                      </SelectItem>
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
                )}
              </div>

              {/* Doctor Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Dokter</label>
                {doctorsLoading ? (
                  <div className="flex items-center space-x-2 p-2 border rounded-lg">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">
                      Memuat dokter...
                    </span>
                  </div>
                ) : (
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Semua Dokter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        Semua Dokter
                      </SelectItem>
                      {doctors?.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id}
                          className="cursor-pointer"
                        >
                          Dr. {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedBranch !== "all" || selectedDoctor !== "all") && (
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm font-medium text-gray-600">
                  Filter Aktif:
                </span>
                {selectedBranch !== "all" && (
                  <Badge variant="secondary">
                    {branches?.find((b) => b.id === selectedBranch)?.name}
                  </Badge>
                )}
                {selectedDoctor !== "all" && (
                  <Badge variant="secondary">
                    Dr. {doctors?.find((d) => d.id === selectedDoctor)?.name}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedBranch("all");
                    setSelectedDoctor("all");
                  }}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                >
                  Hapus Filter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Component */}
        <Card >
          <CardHeader>
            <div className="flex justify-between items-center p-4">
              <CardTitle>Kalender Reservasi Pasien</CardTitle>
              <div className="text-sm text-gray-600">
                Tanggal Dipilih:{" "}
                <span className="font-semibold">
                  {format(selectedDate, "dd MMMM yyyy", { locale: idLocale })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PatientCalendar
              reservations={filteredReservations || []}
              onDateSelect={handleDateSelect}
              height={700}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
