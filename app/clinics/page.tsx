'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Clinic, ClinicRegistrationRequest } from '@/types/api'

// Mock data for demonstration
const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Klinik Sehat Sentosa',
    description: 'Klinik umum dengan layanan kesehatan keluarga terlengkap. Melayani pemeriksaan umum, vaksinasi, dan konsultasi kesehatan.',
    image: '/kaipo.png',
    address: 'Jakarta',
    priceRangeMin: 50000,
    priceRangeMax: 200000,
    branches: [
      {
        id: 'b1',
        name: 'Cabang Sudirman',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        doctors: [
          { id: 'd1', name: 'Dr. Ahmad Wijaya', specialization: 'Dokter Umum', availableDates: ['2024-10-15', '2024-10-16', '2024-10-17'], branchIds: ['b1'] },
          { id: 'd2', name: 'Dr. Sari Indah', specialization: 'Dokter Gigi', availableDates: ['2024-10-15', '2024-10-18', '2024-10-19'], branchIds: ['b1'] }
        ]
      },
      {
        id: 'b2',
        name: 'Cabang Menteng',
        address: 'Jl. Menteng Raya No. 45, Jakarta Pusat',
        doctors: [
          { id: 'd7', name: 'Dr. Maya Putri', specialization: 'Dokter Umum', availableDates: ['2024-10-16', '2024-10-17', '2024-10-18'], branchIds: ['b2'] },
          { id: 'd8', name: 'Dr. Rudi Hermawan', specialization: 'Dokter Anak', availableDates: ['2024-10-15', '2024-10-17', '2024-10-19'], branchIds: ['b2'] }
        ]
      }
    ],
    availableSlots: [
      { doctorId: 'd1', branchId: 'b1', date: '2024-10-15', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { doctorId: 'd1', branchId: 'b1', date: '2024-10-16', times: ['09:00', '10:00', '14:00', '15:00'] },
      { doctorId: 'd2', branchId: 'b1', date: '2024-10-15', times: ['08:00', '09:00', '10:00'] },
      { doctorId: 'd7', branchId: 'b2', date: '2024-10-16', times: ['09:00', '10:00', '11:00', '14:00'] },
      { doctorId: 'd8', branchId: 'b2', date: '2024-10-15', times: ['08:00', '09:00', '13:00', '14:00'] }
    ]
  },
  {
    id: '2',
    name: 'Klinik Pratama Harapan',
    description: 'Klinik modern dengan fasilitas terkini dan tenaga medis berpengalaman. Spesialisasi dalam kesehatan anak dan dewasa.',
    image: '/kaipo.png',
    address: 'Jakarta Selatan',
    priceRangeMin: 75000,
    priceRangeMax: 300000,
    branches: [
      {
        id: 'b3',
        name: 'Cabang Gatot Subroto',
        address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
        doctors: [
          { id: 'd3', name: 'Dr. Budi Santoso', specialization: 'Dokter Anak', availableDates: ['2024-10-15', '2024-10-17', '2024-10-19'], branchIds: ['b3'] },
          { id: 'd4', name: 'Dr. Lisa Kartika', specialization: 'Dokter Umum', availableDates: ['2024-10-16', '2024-10-18', '2024-10-20'], branchIds: ['b3'] }
        ]
      }
    ],
    availableSlots: [
      { doctorId: 'd3', branchId: 'b3', date: '2024-10-15', times: ['08:00', '09:00', '10:00', '13:00', '14:00'] },
      { doctorId: 'd4', branchId: 'b3', date: '2024-10-16', times: ['09:00', '10:00', '11:00', '15:00', '16:00'] }
    ]
  },
  {
    id: '3',
    name: 'Klinik Mitra Keluarga',
    description: 'Klinik keluarga dengan pelayanan 24 jam. Menyediakan layanan emergency, konsultasi online, dan pemeriksaan kesehatan rutin.',
    image: '/kaipo.png',
    address: 'Jakarta Pusat',
    priceRangeMin: 60000,
    priceRangeMax: 250000,
    branches: [
      {
        id: 'b4',
        name: 'Cabang Thamrin',
        address: 'Jl. Thamrin No. 789, Jakarta Pusat',
        doctors: [
          { id: 'd5', name: 'Dr. Rina Sari', specialization: 'Dokter Umum', availableDates: ['2024-10-15', '2024-10-16', '2024-10-18'], branchIds: ['b4'] },
          { id: 'd6', name: 'Dr. Hendra Wijaya', specialization: 'Dokter Penyakit Dalam', availableDates: ['2024-10-17', '2024-10-19', '2024-10-20'], branchIds: ['b4'] }
        ]
      },
      {
        id: 'b5',
        name: 'Cabang Sarinah',
        address: 'Jl. MH Thamrin No. 11, Jakarta Pusat',
        doctors: [
          { id: 'd9', name: 'Dr. Indira Sari', specialization: 'Dokter Kandungan', availableDates: ['2024-10-15', '2024-10-17', '2024-10-19'], branchIds: ['b5'] }
        ]
      }
    ],
    availableSlots: [
      { doctorId: 'd5', branchId: 'b4', date: '2024-10-15', times: ['07:00', '08:00', '09:00', '13:00', '14:00', '15:00'] },
      { doctorId: 'd6', branchId: 'b4', date: '2024-10-17', times: ['09:00', '10:00', '11:00', '14:00'] },
      { doctorId: 'd9', branchId: 'b5', date: '2024-10-15', times: ['08:00', '09:00', '10:00', '13:00'] }
    ]
  }
]

const ITEMS_PER_PAGE = 6

export default function ClinicsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<ClinicRegistrationRequest>>({
    name: '',
    whatsappNumber: '',
    branchId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    keluhan: '',
  })
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')

  const totalPages = Math.ceil(mockClinics.length / ITEMS_PER_PAGE)
  const currentClinics = mockClinics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleRegister = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setFormData({ ...formData, clinicId: clinic.id })
    setIsModalOpen(true)
  }

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId)
    setFormData({ ...formData, branchId, doctorId: '', appointmentDate: '', appointmentTime: '' })
    setSelectedDoctor('')
    setSelectedDate('')
  }

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId)
    setFormData({ ...formData, doctorId })
    setSelectedDate('')
    setFormData({ ...formData, doctorId, appointmentDate: '', appointmentTime: '' })
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setFormData({ ...formData, appointmentDate: date, appointmentTime: '' })
  }

  const getAvailableDoctors = () => {
    if (!selectedClinic || !selectedBranch) return []
    const branch = selectedClinic.branches.find(branch => branch.id === selectedBranch)
    return branch?.doctors || []
  }

  const getAvailableTimes = () => {
    if (!selectedClinic || !selectedBranch || !selectedDoctor || !selectedDate) return []
    const slot = selectedClinic.availableSlots.find(
      slot => slot.doctorId === selectedDoctor && slot.branchId === selectedBranch && slot.date === selectedDate
    )
    return slot?.times || []
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Registration data:', formData)
    
    // Show success message and close modal
    alert('Pendaftaran berhasil! Kami akan menghubungi Anda segera.')
    setIsModalOpen(false)
    setFormData({
      name: '',
      whatsappNumber: '',
      branchId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      keluhan: '',
    })
    setSelectedBranch('')
    setSelectedDoctor('')
    setSelectedDate('')
  }

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
              Temukan klinik terdekat dengan layanan terbaik dan daftar sebagai pasien dengan mudah
            </p>
          </div>

          {/* Clinic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={clinic.image}
                    alt={clinic.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{clinic.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {clinic.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      {formatCurrency(clinic.priceRangeMin)} - {formatCurrency(clinic.priceRangeMax)}
                    </div>
                  </div>

                  <Dialog open={isModalOpen && selectedClinic?.id === clinic.id} onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) {
                      setSelectedClinic(null)
                      setSelectedBranch('')
                      setSelectedDoctor('')
                      setSelectedDate('')
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full cursor-pointer"
                        onClick={() => handleRegister(clinic)}
                      >
                        Daftar Sekarang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Daftar di {clinic.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4 border-b pb-4">
                          <h3 className="text-lg font-medium text-gray-900">Informasi Pribadi</h3>
                          <div>
                            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                            <Input
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                              value={formData.whatsappNumber}
                              onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                              placeholder="08xxxxxxxxxx"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Pastikan nomor terhubung dengan WhatsApp untuk komunikasi
                            </p>
                          </div>
                        </div>

                        {/* Appointment Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Informasi Kunjungan</h3>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Pilih Cabang</label>
                            <Select onValueChange={handleBranchChange} value={selectedBranch}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih cabang" />
                              </SelectTrigger>
                              <SelectContent>
                                {clinic.branches.map((branch) => (
                                  <SelectItem key={branch.id} value={branch.id}>
                                    {branch.name} - {branch.address}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedBranch && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Pilih Dokter</label>
                              <Select onValueChange={handleDoctorChange} value={selectedDoctor}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih dokter" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableDoctors().map((doctor) => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                      {doctor.name} - {doctor.specialization}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedDoctor && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Tanggal Kunjungan</label>
                              <Select onValueChange={handleDateChange} value={selectedDate}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih tanggal" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableDoctors()
                                    .find(d => d.id === selectedDoctor)
                                    ?.availableDates.map((date) => (
                                      <SelectItem key={date} value={date}>
                                        {new Date(date).toLocaleDateString('id-ID', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedDate && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Waktu Kunjungan</label>
                              <Select onValueChange={(time) => setFormData({...formData, appointmentTime: time})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableTimes().map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium mb-1">Keluhan</label>
                            <Textarea
                              required
                              value={formData.keluhan}
                              onChange={(e) => setFormData({...formData, keluhan: e.target.value})}
                              placeholder="Jelaskan keluhan atau gejala yang Anda alami"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 cursor-pointer"
                          >
                            Batal
                          </Button>
                          <Button type="submit" className="flex-1 cursor-pointer">
                            Daftar
                          </Button>
                        </div>
                      </form>
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10 cursor-pointer"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
  )
}
