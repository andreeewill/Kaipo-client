"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Plus, Calendar, FileText, AlertTriangle, Pill, Activity } from "lucide-react";

interface MedicalHistoryFormProps {
  patientId: number;
  onSave?: (historyData: Record<string, unknown>) => void;
}

interface MedicalHistoryData {
  condition: string;
  diagnosisDate: string;
  severity: string;
  status: string;
  treatment: string;
  medications: string;
  notes: string;
  doctor: string;
  hospital: string;
}

export function AddMedicalHistoryDialog({ onSave }: MedicalHistoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<MedicalHistoryData>({
    condition: "",
    diagnosisDate: "",
    severity: "",
    status: "",
    treatment: "",
    medications: "",
    notes: "",
    doctor: "",
    hospital: ""
  });

  const handleInputChange = (field: keyof MedicalHistoryData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.condition || !formData.diagnosisDate) {
      alert("Kondisi dan tanggal diagnosis wajib diisi!");
      return;
    }

    // Call onSave callback if provided
    if (onSave) {
      onSave({
        ...formData,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      });
    }

    // Reset form and close dialog
    setFormData({
      condition: "",
      diagnosisDate: "",
      severity: "",
      status: "",
      treatment: "",
      medications: "",
      notes: "",
      doctor: "",
      hospital: ""
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      condition: "",
      diagnosisDate: "",
      severity: "",
      status: "",
      treatment: "",
      medications: "",
      notes: "",
      doctor: "",
      hospital: ""
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="w-4 h-4 mr-1" />
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Tambah Riwayat Medis
          </DialogTitle>
          <DialogDescription>
            Masukkan informasi riwayat medis pasien untuk melengkapi rekam medis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Informasi Kondisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Kondisi/Penyakit <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.condition}
                    onChange={(e) => handleInputChange("condition", e.target.value)}
                    placeholder="Masukkan nama kondisi atau penyakit..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tanggal Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={(e) => handleInputChange("diagnosisDate", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tingkat Keparahan
                  </label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat keparahan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ringan">Ringan</SelectItem>
                      <SelectItem value="sedang">Sedang</SelectItem>
                      <SelectItem value="berat">Berat</SelectItem>
                      <SelectItem value="kritis">Kritis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Status Saat Ini
                  </label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="terkontrol">Terkontrol</SelectItem>
                      <SelectItem value="sembuh">Sembuh</SelectItem>
                      <SelectItem value="remisi">Remisi</SelectItem>
                      <SelectItem value="kronis">Kronis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Informasi Perawatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Perawatan/Terapi
                </label>
                <Textarea
                  value={formData.treatment}
                  onChange={(e) => handleInputChange("treatment", e.target.value)}
                  placeholder="Jelaskan perawatan atau terapi yang diberikan..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Obat-obatan
                </label>
                <Textarea
                  value={formData.medications}
                  onChange={(e) => handleInputChange("medications", e.target.value)}
                  placeholder="Daftar obat-obatan yang pernah/sedang dikonsumsi..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Dokter yang Menangani
                  </label>
                  <Input
                    value={formData.doctor}
                    onChange={(e) => handleInputChange("doctor", e.target.value)}
                    placeholder="Nama dokter..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Rumah Sakit/Klinik
                  </label>
                  <Input
                    value={formData.hospital}
                    onChange={(e) => handleInputChange("hospital", e.target.value)}
                    placeholder="Nama rumah sakit atau klinik..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Catatan Tambahan
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Catatan tambahan mengenai kondisi atau perawatan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Warning Note */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Pastikan informasi yang dimasukkan akurat dan sesuai dengan dokumentasi medis yang ada.
              Riwayat medis ini akan menjadi bagian penting dari rekam medis elektronik pasien.
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Batal
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>
            Simpan Riwayat Medis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
