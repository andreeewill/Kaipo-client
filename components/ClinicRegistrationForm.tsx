"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useBranches,
  useDoctors,
  useTimeslots,
  useCreateReservation,
} from "@/lib/queries";
import type { CreateReservationData } from "@/lib/queries/types";
import { MiniDoctorSchedule } from "./MiniDoctorSchedule";

interface ClinicRegistrationFormProps {
  clinicName: string;
  onClose: () => void;
  organizationId?: string;
}

export function ClinicRegistrationForm({
  clinicName,
  onClose,
  organizationId = "org_WdM3kHvuUApaQCEi",
}: ClinicRegistrationFormProps) {
  // Form State
  const [formData, setFormData] = useState<CreateReservationData>({
    name: "",
    phone: "",
    complaint: "",
    timeslotId: "",
    date: "",
  });

  // Selection State
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  // API Hooks
  const {
    data: branches,
    isLoading: branchesLoading,
    error: branchesError,
  } = useBranches(organizationId);

  const {
    data: doctors,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useDoctors(selectedBranch);

  const {
    data: timeslots,
    isLoading: timeslotsLoading,
    error: timeslotsError,
  } = useTimeslots(selectedBranch, selectedDoctor);

  const createReservationMutation = useCreateReservation();

  // Reset selections when branch changes
  useEffect(() => {
    setSelectedDoctor("");
    setFormData((prev) => ({ ...prev, timeslotId: "", date: "" }));
  }, [selectedBranch]);

  // Reset timeslot when doctor changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, timeslotId: "", date: "" }));
  }, [selectedDoctor]);

  // Helper Functions
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds from "HH:MM:SS"
  };

  const getDayName = (dayOfWeek: string) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[parseInt(dayOfWeek)];
  };

  // Event Handlers
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
  };

  const handleTimeslotChange = (timeslotId: string) => {
    setFormData({ ...formData, timeslotId });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.complaint ||
      !formData.timeslotId ||
      !formData.date
    ) {
      toast.error("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    try {
      await createReservationMutation.mutateAsync({
        ...formData,
        source: "WEBSITE",
      });
      toast.success("Pendaftaran berhasil! Kami akan menghubungi Anda segera.");
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4 border-b pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              placeholder="+628123456789"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pastikan nomor terhubung dengan WhatsApp untuk komunikasi
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Keluhan <span className="text-red-500">*</span>
          </label>
          <Textarea
            required
            value={formData.complaint}
            onChange={(e) =>
              setFormData({
                ...formData,
                complaint: e.target.value,
              })
            }
            placeholder="Jelaskan keluhan atau gejala yang Anda alami"
            rows={3}
          />
        </div>
      </div>

      {/* Appointment Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Informasi Kunjungan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Cabang <span className="text-red-500">*</span>
            </label>
            {branchesLoading ? (
              <div className="flex items-center space-x-2 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading branches...</span>
              </div>
            ) : branchesError ? (
              <Alert className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error loading branches. Please try again.
                </AlertDescription>
              </Alert>
            ) : (
              <Select onValueChange={handleBranchChange} value={selectedBranch}>
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
            )}
          </div>

          {/* Doctor Selection */}
          {selectedBranch && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Pilih Dokter <span className="text-red-500">*</span>
              </label>
              {doctorsLoading ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading doctors...</span>
                </div>
              ) : doctorsError ? (
                <Alert className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading doctors. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select
                  onValueChange={handleDoctorChange}
                  value={selectedDoctor}
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
              )}
            </div>
          )}

          {/* Timeslot Selection */}
          {selectedDoctor && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Pilih Waktu <span className="text-red-500">*</span>
              </label>
              {timeslotsLoading ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">
                    Loading available times...
                  </span>
                </div>
              ) : timeslotsError ? (
                <Alert className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading timeslots. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select
                  onValueChange={handleTimeslotChange}
                  value={formData.timeslotId}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Pilih waktu kunjungan" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeslots?.map((timeslot) => (
                      <SelectItem
                        key={timeslot.id}
                        value={timeslot.id}
                        className="cursor-pointer"
                      >
                        {getDayName(timeslot.dayOfWeek)} -{" "}
                        {formatTime(timeslot.startTime)} -{" "}
                        {formatTime(timeslot.endTime)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Date Selection */}
          {formData.timeslotId && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Kunjungan <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Mini Doctor Schedule - Show when doctor is selected */}
        {selectedDoctor && (
          <div className="mt-4">
            <MiniDoctorSchedule
              doctorId={selectedDoctor}
              organizationId={organizationId}
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {createReservationMutation.isError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {createReservationMutation.error?.message ||
              "Failed to create reservation. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 cursor-pointer"
          disabled={createReservationMutation.isPending}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1 cursor-pointer"
          disabled={
            createReservationMutation.isPending ||
            !formData.name ||
            !formData.phone ||
            !formData.complaint ||
            !formData.timeslotId ||
            !formData.date
          }
        >
          {createReservationMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </div>
    </form>
  );
}
