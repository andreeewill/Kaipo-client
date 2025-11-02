"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Building2 } from "lucide-react";

export default function AppointmentPage() {
  const router = useRouter();

  const handleNavigateToRegistration = () => {
    router.push("/clinics");
  };

  const handleNavigateToManagement = () => {
    router.push("/dashboard/appointment-management");
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sistem Pendaftaran Kaipo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistem manajemen pendaftaran pasien dengan 3 jalur entry: Website, WhatsApp, dan Walk-in. 
            Semua data akan melalui proses konfirmasi admin sebelum menjadi appointment terjadwal.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Patient Registration */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToRegistration}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Pendaftaran Website (Entry Point 1)</CardTitle>
              <CardDescription>
                Pasien mendaftar sendiri melalui website - akan masuk ke Data BASIC
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full bg-[#132a13] hover:bg-[#31572c]"
                onClick={handleNavigateToRegistration}
              >
                <Users className="h-4 w-4 mr-2" />
                Daftar via Website
              </Button>
            </CardContent>
          </Card>

          {/* Admin Tools */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToManagement}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Admin Tools</CardTitle>
              <CardDescription>
                Kelola data BASIC, konfirmasi jadwal, dan manajemen appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="outline" 
                className="w-full border-[#132a13] text-[#132a13] hover:bg-[#132a13] hover:text-white"
                onClick={handleNavigateToManagement}
              >
                <Clock className="h-4 w-4 mr-2" />
                Akses Admin Tools
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-center">Alur Pendaftaran Pasien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Entry Points</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🌐 Website (5%)</li>
                    <li>💬 WhatsApp (70%)</li>
                    <li>🚶 Walk-in (25%)</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Admin Konfirmasi</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📋 Review Data BASIC</li>
                    <li>✅ Konfirmasi Jadwal</li>
                    <li>🔄 Reschedule jika perlu</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Encounter</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📅 Appointment Terjadwal</li>
                    <li>🏥 Pasien Siap Encounter</li>
                    <li>👨‍⚕️ Bertemu Dokter</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Status Tracking:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">CREATED</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">UNDER_REVIEW</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">SCHEDULED</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ENCOUNTER_READY</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">COMPLETED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-center">Alur Pendaftaran Pasien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Entry Points</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🌐 Website (5%)</li>
                    <li>💬 WhatsApp (70%)</li>
                    <li>🚶 Walk-in (25%)</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Admin Konfirmasi</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📋 Review Data BASIC</li>
                    <li>✅ Konfirmasi Jadwal</li>
                    <li>🔄 Reschedule jika perlu</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Encounter</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📅 Appointment Terjadwal</li>
                    <li>🏥 Pasien Siap Encounter</li>
                    <li>👨‍⚕️ Bertemu Dokter</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Status Tracking:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">CREATED</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">UNDER_REVIEW</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">SCHEDULED</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ENCOUNTER_READY</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">COMPLETED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
