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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  UserPlus,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Users,
  PhoneCall,
  Calendar,
  User,
} from "lucide-react";
import { ManualRegistrationForm } from "@/components/ManualRegistrationForm";
import { WhatsAppRegistrationForm } from "@/components/WhatsAppRegistrationForm";
import { useReservations } from "@/lib/queries/hooks/useReservations";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Status configuration for Basic Data
const BASIC_STATUS_CONFIG = {
  CREATED: {
    label: "Baru Dibuat",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Sedang Ditinjau",
    color: "bg-yellow-100 text-yellow-800", 
    icon: RefreshCw,
  },
  SCHEDULED: {
    label: "Terjadwal",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  ENCOUNTER_READY: {
    label: "Siap Encounter",
    color: "bg-purple-100 text-purple-800",
    icon: Calendar,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
};

// Source configuration
const SOURCE_CONFIG = {
  WEBSITE: {
    label: "Website",
    color: "bg-indigo-100 text-indigo-800",
    icon: "🌐",
  },
  WHATSAPP: {
    label: "WhatsApp",
    color: "bg-green-100 text-green-800", 
    icon: "💬",
  },
  WALKIN: {
    label: "Walk-in",
    color: "bg-orange-100 text-orange-800",
    icon: "🚶",
  },
};

export default function BasicPatientsPage() {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Dummy data for WhatsApp and Walk-in sources
  const dummyData = [
    {
      id: "dummy-1",
      name: "Ahmad Santoso",
      phone: "08123456789",
      complaint: "Sakit gigi geraham kiri",
      source: "WHATSAPP",
      status: "CREATED",
      createdAt: "2025-11-03T08:30:00Z",
    },
    {
      id: "dummy-2", 
      name: "Siti Rahayu",
      phone: "08987654321",
      complaint: "Pembersihan karang gigi",
      source: "WALKIN",
      status: "UNDER_REVIEW",
      createdAt: "2025-11-03T09:15:00Z",
    },
    {
      id: "dummy-3",
      name: "Budi Prakoso",
      phone: "08555123456",
      complaint: "Konsultasi behel gigi",
      source: "WHATSAPP",
      status: "SCHEDULED",
      createdAt: "2025-11-03T10:00:00Z",
    },
    {
      id: "dummy-4",
      name: "Maya Indah",
      phone: "08777888999",
      complaint: "Gigi berlubang perlu tambal",
      source: "WALKIN",
      status: "CREATED",
      createdAt: "2025-11-03T11:20:00Z",
    },
    {
      id: "dummy-5",
      name: "Dedi Kurniawan",
      phone: "08333222111",
      complaint: "Sakit gigi depan patah",
      source: "WHATSAPP",
      status: "ENCOUNTER_READY",
      createdAt: "2025-11-03T12:45:00Z",
    },
  ];

  // Fetch data
  const {
    data: reservations,
    isLoading: reservationsLoading,
    refetch,
  } = useReservations();

  // Combine real data with dummy data
  const allReservations = [...(reservations || []), ...dummyData];

  // Calculate statistics
  const stats = {
    total: allReservations?.length || 0,
    website: allReservations?.filter(r => r.source === 'WEBSITE')?.length || 0,
    whatsapp: allReservations?.filter(r => r.source === 'WHATSAPP')?.length || 0,
    walkin: allReservations?.filter(r => r.source === 'WALKIN')?.length || 0,
    pending: allReservations?.filter(r => ['CREATED', 'UNDER_REVIEW'].includes(r.status))?.length || 0,
  };

  const handleSchedulingAction = (reservation) => {
    // This will navigate to scheduling confirmation
    console.log("Navigate to scheduling confirmation for:", reservation);
  };

  const handleWhatsAppContact = (reservation) => {
    const message = encodeURIComponent(
      `Halo ${reservation.name}, terima kasih telah mendaftar di klinik kami. Kami akan segera mengkonfirmasi jadwal appointment Anda untuk keluhan ${reservation.complaint}.`
    );
    const whatsappUrl = `https://wa.me/${reservation.phone.replace(
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

  if (reservationsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Memuat data pasien...</p>
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
              Daftar Reservasi
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola data reservasi pasien dari berbagai sumber pendaftaran
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Daftar via WhatsApp
            </Button>
            <Button
              onClick={() => setIsWalkInModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Daftar Walk-in
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Data</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Website</p>
                  <p className="text-2xl font-bold">{stats.website}</p>
                </div>
                <div className="text-2xl">🌐</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">WhatsApp</p>
                  <p className="text-2xl font-bold">{stats.whatsapp}</p>
                </div>
                <div className="text-2xl">💬</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Walk-in</p>
                  <p className="text-2xl font-bold">{stats.walkin}</p>
                </div>
                <div className="text-2xl">🚶</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Perlu Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Reservasi Pasien</CardTitle>
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
                    <TableHead>Telepon</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allReservations?.map((reservation, index) => {
                    const statusConfig = BASIC_STATUS_CONFIG[reservation.status];
                    const sourceConfig = SOURCE_CONFIG[reservation.source || 'WEBSITE'];
                    const StatusIcon = statusConfig?.icon || AlertTriangle;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{reservation.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <PhoneCall className="h-4 w-4 text-gray-400" />
                            <span>{reservation.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={reservation.complaint}>
                            {reservation.complaint}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={sourceConfig?.color || "bg-gray-100 text-gray-800"}>
                            <span className="mr-1">{sourceConfig?.icon}</span>
                            {sourceConfig?.label || reservation.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig?.label || reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {reservation.createdAt ? formatDate(reservation.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleSchedulingAction(reservation)}
                              disabled={reservation.status === "SCHEDULED" || reservation.status === "CANCELLED"}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleWhatsAppContact(reservation)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="cursor-pointer"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuItem
                                  onClick={() => setSelectedPatient(reservation)}
                                  className="cursor-pointer"
                                >
                                  Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => console.log("Edit", reservation)}
                                  className="cursor-pointer"
                                >
                                  Edit Data
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => console.log("Check duplicates", reservation)}
                                  className="cursor-pointer"
                                >
                                  Cek Duplikasi
                                </DropdownMenuItem>
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

        {/* WhatsApp Registration Modal */}
        <Dialog open={isWhatsAppModalOpen} onOpenChange={setIsWhatsAppModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrasi Pasien via WhatsApp</DialogTitle>
              <DialogDescription>
                Daftarkan pasien yang menghubungi melalui WhatsApp
              </DialogDescription>
            </DialogHeader>
            <WhatsAppRegistrationForm
              source="WHATSAPP"
              onClose={() => setIsWhatsAppModalOpen(false)}
              onSuccess={() => {
                setIsWhatsAppModalOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Walk-in Registration Modal */}
        <Dialog open={isWalkInModalOpen} onOpenChange={setIsWalkInModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrasi Pasien Walk-in</DialogTitle>
              <DialogDescription>
                Daftarkan pasien yang datang langsung ke klinik
              </DialogDescription>
            </DialogHeader>
            <WhatsAppRegistrationForm
              source="WALKIN"
              onClose={() => setIsWalkInModalOpen(false)}
              onSuccess={() => {
                setIsWalkInModalOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detail Reservasi Pasien</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama</label>
                    <p className="text-lg">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telepon</label>
                    <p className="text-lg">{selectedPatient.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Keluhan</label>
                    <p className="text-lg">{selectedPatient.complaint}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sumber</label>
                    <p className="text-lg">{SOURCE_CONFIG[selectedPatient.source]?.label}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-lg">{BASIC_STATUS_CONFIG[selectedPatient.status]?.label}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
