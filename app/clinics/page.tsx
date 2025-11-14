"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClinicRegistrationForm } from "@/components/ClinicRegistrationForm";

// Types
interface Clinic {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  priceRangeMin: number;
  priceRangeMax: number;
  organizationId: string;
}

// Mock clinic data for UI demonstration
const mockClinics = [
  {
    id: "1",
    name: "Klinik Sehat Sentosa",
    description:
      "Klinik umum dengan layanan kesehatan keluarga terlengkap. Melayani pemeriksaan umum, vaksinasi, dan konsultasi kesehatan.",
    image: "/kaipo.png",
    address: "Jakarta",
    priceRangeMin: 50000,
    priceRangeMax: 200000,
    organizationId: "org_WdM3kHvuUApaQCEi",
  },
  {
    id: "2",
    name: "Klinik Pratama Harapan",
    description:
      "Klinik modern dengan fasilitas terkini dan tenaga medis berpengalaman. Spesialisasi dalam kesehatan anak dan dewasa.",
    image: "/kaipo.png",
    address: "Jakarta Selatan",
    priceRangeMin: 75000,
    priceRangeMax: 300000,
    organizationId: "org_WdM3kHvuUApaQCEi",
  },
  {
    id: "3",
    name: "Klinik Mitra Keluarga",
    description:
      "Klinik keluarga dengan pelayanan 24 jam. Menyediakan layanan emergency, konsultasi online, dan pemeriksaan kesehatan rutin.",
    image: "/kaipo.png",
    address: "Jakarta Pusat",
    priceRangeMin: 60000,
    priceRangeMax: 250000,
    organizationId: "org_WdM3kHvuUApaQCEi",
  },
];

const ITEMS_PER_PAGE = 6;

export default function ClinicsPage() {
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const totalPages = Math.ceil(mockClinics.length / ITEMS_PER_PAGE);
  const currentClinics = mockClinics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper Functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Event Handlers
  const handleRegister = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClinic(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pilih Klinik Terbaik untuk Anda
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Temukan klinik terdekat dengan layanan terbaik dan daftar sebagai
              pasien dengan mudah
            </p>
          </div>

          {/* Clinic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={clinic.image}
                    alt={clinic.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {clinic.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {clinic.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {clinic.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662zm-.081 3.328a3.47 3.47 0 01-.567.267z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatCurrency(clinic.priceRangeMin)} -{" "}
                      {formatCurrency(clinic.priceRangeMax)}
                    </div>
                  </div>

                  <Dialog
                    open={isModalOpen && selectedClinic?.id === clinic.id}
                    onOpenChange={(open) => {
                      if (!open) handleCloseModal();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full cursor-pointer"
                        onClick={() => handleRegister(clinic)}
                      >
                        Daftar Sekarang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-1/2 max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Daftar di {clinic.name}</DialogTitle>
                      </DialogHeader>

                      <ClinicRegistrationForm
                        clinicName={clinic.name}
                        onClose={handleCloseModal}
                        organizationId={clinic.organizationId}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 cursor-pointer"
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
