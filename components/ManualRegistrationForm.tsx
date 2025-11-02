"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, User, Phone, FileText, Stethoscope, Loader2 } from "lucide-react";
import { useDoctors } from "@/lib/queries/hooks/useDoctors";
import { useBranches } from "@/lib/queries/hooks/useBranches";
import { useTimeslots } from "@/lib/queries/hooks/useTimeslots";
import { useCreateReservation } from "@/lib/queries/mutations/useCreateReservation";

interface ManualRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  source: 'WHATSAPP' | 'WALKIN';
  title?: string;
}

export function ManualRegistrationForm({ onClose, onSuccess, source, title }: ManualRegistrationFormProps) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeslot, setSelectedTimeslot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    complaint: "",
  });

  // Organization ID
  const organizationId = "org_WdM3kHvuUApaQCEi";

  // Fetch data
  const { data: branches, isLoading: branchesLoading } = useBranches(organizationId);
  const { data: doctors, isLoading: doctorsLoading } = useDoctors(selectedBranch);
  const { data: timeslots, isLoading: timeslotsLoading } = useTimeslots(selectedBranch, selectedDoctor);
  const createReservationMutation = useCreateReservation();

  // Reset doctor when branch changes
  useEffect(() => {
    setSelectedDoctor("");
    setSelectedTimeslot("");
  }, [selectedBranch]);

  // Reset timeslot when doctor changes
  useEffect(() => {
    setSelectedTimeslot("");
  }, [selectedDoctor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to get day name
  const getDayName = (dayOfWeek: string) => {
    const days = [
      "Minggu", "Senin", "Selasa", "Rabu", 
      "Kamis", "Jumat", "Sabtu"
    ];
    return days[parseInt(dayOfWeek)] || dayOfWeek;
  };

  // Helper function to format time
  const formatTime = (time: string) => {
    return time?.substring(0, 5) || time; // Remove seconds from "HH:MM:SS"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeslot) {
      alert("Mohon pilih tanggal dan waktu appointment");
      return;
    }

    try {
      await createReservationMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        complaint: formData.complaint,
        timeslotId: selectedTimeslot,
        date: format(selectedDate, "yyyy-MM-dd"),
        source: source,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Gagal membuat reservasi. Silakan coba lagi.");
    }
  };

  const isFormValid = formData.name && formData.phone && formData.complaint && 
                     selectedBranch && selectedDoctor && selectedDate && selectedTimeslot;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{title || `Registrasi ${source === 'WHATSAPP' ? 'WhatsApp' : 'Walk-in'}`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nama Lengkap *
              </label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nomor Telepon *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="08XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Keluhan *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  placeholder="Jelaskan keluhan Anda..."
                  value={formData.complaint}
                  onChange={(e) => handleInputChange("complaint", e.target.value)}
                  className="pl-10 min-h-[100px]"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Pengaturan Appointment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Branch Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Cabang Klinik *
              </label>
              {branchesLoading ? (
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Memuat cabang...</span>
                </div>
              ) : (
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Pilih cabang klinik" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id} className="cursor-pointer">
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Dokter *
              </label>
              {!selectedBranch ? (
                <div className="p-2 border rounded-lg">
                  <p className="text-sm text-gray-500 text-center">
                    Pilih cabang terlebih dahulu
                  </p>
                </div>
              ) : doctorsLoading ? (
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Memuat dokter...</span>
                </div>
              ) : (
                <Select 
                  value={selectedDoctor} 
                  onValueChange={setSelectedDoctor}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Pilih dokter" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id} className="cursor-pointer">
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tanggal Appointment *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={!selectedDoctor}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!selectedDoctor && (
                <p className="text-sm text-gray-500 mt-1">
                  Pilih dokter terlebih dahulu
                </p>
              )}
            </div>

            {/* Timeslot Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Waktu Appointment *
              </label>
              {!selectedDoctor ? (
                <div className="p-2 border rounded-lg">
                  <p className="text-sm text-gray-500 text-center">
                    Pilih dokter terlebih dahulu
                  </p>
                </div>
              ) : timeslotsLoading ? (
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Memuat jadwal...</span>
                </div>
              ) : timeslots && timeslots.length > 0 ? (
                <Select value={selectedTimeslot} onValueChange={setSelectedTimeslot}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeslots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id} className="cursor-pointer">
                        {getDayName(slot.dayOfWeek)} ({formatTime(slot.startTime)} - {formatTime(slot.endTime)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 border rounded-lg">
                  <p className="text-sm text-gray-500 text-center">
                    Tidak ada slot waktu tersedia untuk dokter ini
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={!isFormValid || createReservationMutation.isPending}
          className="bg-[#132a13] hover:bg-[#31572c] cursor-pointer"
        >
          {createReservationMutation.isPending ? "Memproses..." : "Daftar Sekarang"}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {createReservationMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Terjadi kesalahan saat mendaftar. Silakan coba lagi.
          </p>
        </div>
      )}
    </form>
  );
}
