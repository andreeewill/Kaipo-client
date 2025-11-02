"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Phone, Mail, MapPin, CreditCard, Heart } from "lucide-react";

interface PatientData {
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string;
  personalInfo: {
    idNumber: string;
    nationality: string;
    religion: string;
    maritalStatus: string;
    occupation: string;
    insurance: {
      provider: string;
      number: string;
    };
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface PatientPersonalInfoProps {
  patient: PatientData;
}

export function PatientPersonalInfo({ patient }: PatientPersonalInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                <Input value={patient.name} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tanggal Lahir</label>
                <Input value={patient.dateOfBirth} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Jenis Kelamin</label>
                <Input value={patient.gender === "Male" ? "Laki-laki" : "Perempuan"} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">No. KTP</label>
                <Input value={patient.personalInfo.idNumber} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Kewarganegaraan</label>
                <Input value={patient.personalInfo.nationality} disabled className="mt-1" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  No. Telepon
                </label>
                <Input value={patient.phone} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input value={patient.email} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Agama</label>
                <Input value={patient.personalInfo.religion} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status Pernikahan</label>
                <Input value={patient.personalInfo.maritalStatus} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Pekerjaan</label>
                <Input value={patient.personalInfo.occupation} disabled className="mt-1" />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Alamat Lengkap
            </label>
            <Input value={patient.address} disabled className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Kontak Darurat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nama</label>
              <Input value={patient.emergencyContact.name} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Hubungan</label>
              <Input value={patient.emergencyContact.relationship} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">No. Telepon</label>
              <Input value={patient.emergencyContact.phone} disabled className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Informasi Asuransi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Penyedia Asuransi</label>
              <Input value={patient.personalInfo.insurance.provider} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Nomor Polis</label>
              <Input value={patient.personalInfo.insurance.number} disabled className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Medis Dasar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Golongan Darah</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {patient.bloodType}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Tinggi Badan</label>
              <Input value={patient.height} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Berat Badan</label>
              <Input value={patient.weight} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Alergi</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  {patient.allergies}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
