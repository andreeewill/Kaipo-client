"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            Sistem manajemen pendaftaran pasien dengan 3 jalur entry: Website,
            WhatsApp, dan Walk-in. Semua data akan melalui proses konfirmasi
            admin sebelum menjadi appointment terjadwal.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Patient Registration */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleNavigateToRegistration}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">
                Pendaftaran Website (Entry Point 1)
              </CardTitle>
              <CardDescription>
                Pasien mendaftar sendiri melalui website - akan masuk ke Data
                BASIC
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
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleNavigateToManagement}
          >
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
      </div>
    </Layout>
  );
}
