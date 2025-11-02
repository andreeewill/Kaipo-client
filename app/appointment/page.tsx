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
            Pendaftaran Online
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kelola pendaftaran pasien secara online. Daftar sebagai pasien baru atau kelola appointment yang sudah ada.
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
              <CardTitle className="text-xl">Daftar Sebagai Pasien</CardTitle>
              <CardDescription>
                Pilih klinik dan daftar untuk mendapatkan layanan kesehatan terbaik
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full bg-[#132a13] hover:bg-[#31572c]"
                onClick={handleNavigateToRegistration}
              >
                <Users className="h-4 w-4 mr-2" />
                Mulai Pendaftaran
              </Button>
            </CardContent>
          </Card>

          {/* Appointment Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToManagement}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Manajemen Appointment</CardTitle>
              <CardDescription>
                Kelola jadwal appointment dan status reservasi pasien
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="outline" 
                className="w-full border-[#132a13] text-[#132a13] hover:bg-[#132a13] hover:text-white"
                onClick={handleNavigateToManagement}
              >
                <Clock className="h-4 w-4 mr-2" />
                Kelola Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Layanan Pendaftaran Online</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Pilih Klinik</h4>
                  <p>Temukan klinik terdekat dengan fasilitas dan layanan terbaik sesuai kebutuhan Anda.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Pilih Jadwal</h4>
                  <p>Tentukan waktu kunjungan yang sesuai dengan jadwal dokter dan ketersediaan slot.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Konfirmasi</h4>
                  <p>Dapatkan konfirmasi appointment melalui WhatsApp dan siap untuk kunjungan Anda.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
