"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";

export default function AddRecordModalContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    patientName: "",
    dob: null,
    gender: "",
    preDiagnosis: "",
    doctor: "",
    adminNotes: "",
    appointmentDate: null,
    appointmentTime: "",
  });

  const doctors = [
    "Dr. John Doe",
    "Dr. Jane Smith",
    "Dr. Emily Davis",
    "Dr. Michael Brown",
    "Dr. Sarah Wilson",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onClose(); // Close the modal after submission
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour < 23; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00`);
      times.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return times;
  };

  return (
    <div className="w-full p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Nama Pasien */}
            <div>
              <label
                htmlFor="patientName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Pasien
              </label>
              <Input
                id="patientName"
                name="patientName"
                type="text"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Masukkan nama pasien"
                required
              />
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Lahir
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {formData.dob
                      ? format(formData.dob, "dd-MMM-yyyy")
                      : "Pilih tanggal lahir"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto p-0"
                  onInteractOutside={(e) => e.preventDefault()} // Prevent closing on interaction
                >
                  <div className="p-4">
                    <Calendar
                      mode="single"
                      selected={formData.dob}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, dob: date }))
                      }
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Jenis Kelamin
              </label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Laki-laki</SelectItem>
                  <SelectItem value="Female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Dokter */}
            <div>
              <label
                htmlFor="doctor"
                className="block text-sm font-medium text-gray-700"
              >
                Dokter
              </label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, doctor: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih dokter" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor, index) => (
                    <SelectItem key={index} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Pertemuan */}
            <div>
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Pertemuan
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {formData.appointmentDate
                      ? format(formData.appointmentDate, "dd-MMM-yyyy")
                      : "Pilih tanggal pertemuan"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="p-4">
                    <Calendar
                      mode="single"
                      selected={formData.appointmentDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          appointmentDate: date,
                        }))
                      }
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Jam Pertemuan */}
            <div>
              <label
                htmlFor="appointmentTime"
                className="block text-sm font-medium text-gray-700"
              >
                Jam Pertemuan
              </label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, appointmentTime: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jam pertemuan" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time, index) => (
                    <SelectItem key={index} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Full-Width Section */}
        <div className="space-y-6">
          {/* Pre-diagnosis */}
          <div>
            <label
              htmlFor="preDiagnosis"
              className="block text-sm font-medium text-gray-700"
            >
              Pre-diagnosis
            </label>
            <Textarea
              id="preDiagnosis"
              name="preDiagnosis"
              value={formData.preDiagnosis}
              onChange={handleChange}
              placeholder="Masukkan pre-diagnosis"
              required
            />
          </div>

          {/* Catatan Admin */}
          <div>
            <label
              htmlFor="adminNotes"
              className="block text-sm font-medium text-gray-700"
            >
              Catatan Admin
            </label>
            <Textarea
              id="adminNotes"
              name="adminNotes"
              value={formData.adminNotes}
              onChange={handleChange}
              placeholder="Masukkan catatan admin"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Simpan Rekam Medik
          </Button>
        </div>
      </form>
    </div>
  );
}
