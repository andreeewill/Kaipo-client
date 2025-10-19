'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useBranches, useDoctors, useTimeslots, useCreateReservation } from '@/lib/queries'
import type { CreateReservationData } from '@/lib/queries/types'

// Types
interface Clinic {
  id: string
  name: string
  description: string
  image: string
  address: string
  priceRangeMin: number
  priceRangeMax: number
  organizationId: string
}

// Mock clinic data for UI demonstration
const mockClinics = [
  {
    id: '1',
    name: 'Klinik Sehat Sentosa',
    description: 'Klinik umum dengan layanan kesehatan keluarga terlengkap. Melayani pemeriksaan umum, vaksinasi, dan konsultasi kesehatan.',
    image: '/kaipo.png',
    address: 'Jakarta',
    priceRangeMin: 50000,
    priceRangeMax: 200000,
    organizationId: 'org_WdM3kHvuUApaQCEi'
  },
  {
    id: '2',
    name: 'Klinik Pratama Harapan',
    description: 'Klinik modern dengan fasilitas terkini dan tenaga medis berpengalaman. Spesialisasi dalam kesehatan anak dan dewasa.',
    image: '/kaipo.png',
    address: 'Jakarta Selatan',
    priceRangeMin: 75000,
    priceRangeMax: 300000,
    organizationId: 'org_WdM3kHvuUApaQCEi'
  },
  {
    id: '3',
    name: 'Klinik Mitra Keluarga',
    description: 'Klinik keluarga dengan pelayanan 24 jam. Menyediakan layanan emergency, konsultasi online, dan pemeriksaan kesehatan rutin.',
    image: '/kaipo.png',
    address: 'Jakarta Pusat',
    priceRangeMin: 60000,
    priceRangeMax: 250000,
    organizationId: 'org_WdM3kHvuUApaQCEi'
  }
]

const ITEMS_PER_PAGE = 6

export default function ClinicsPage() {
  // UI State
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState<CreateReservationData>({
    name: '',
    phone: '',
    complaint: '',
    timeslotId: '',
    date: ''
  })
  
  // Selection State
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')

  // API Hooks - using the organization ID from the first clinic
  const organizationId = 'org_WdM3kHvuUApaQCEi'
  
  const { 
    data: branches, 
    isLoading: branchesLoading, 
    error: branchesError 
  } = useBranches(organizationId)
  
  const { 
    data: doctors, 
    isLoading: doctorsLoading, 
    error: doctorsError 
  } = useDoctors(selectedBranch)
  
  const { 
    data: timeslots, 
    isLoading: timeslotsLoading, 
    error: timeslotsError 
  } = useTimeslots(selectedBranch, selectedDoctor)

  const createReservationMutation = useCreateReservation()

  // Pagination
  const totalPages = Math.ceil(mockClinics.length / ITEMS_PER_PAGE)
  const currentClinics = mockClinics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Helper Functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5) // Remove seconds from "HH:MM:SS"
  }

  const getDayName = (dayOfWeek: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[parseInt(dayOfWeek)]
  }

  // Event Handlers
  const handleRegister = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setIsModalOpen(true)
  }

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId)
    setSelectedDoctor('')
    setFormData({ ...formData, timeslotId: '', date: '' })
  }

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId)
    setFormData({ ...formData, timeslotId: '', date: '' })
  }

  const handleTimeslotChange = (timeslotId: string) => {
    setFormData({ ...formData, timeslotId })
  }

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.complaint || !formData.timeslotId || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createReservationMutation.mutateAsync(formData)
      toast.success('Pendaftaran berhasil! Kami akan menghubungi Anda segera.')
      handleCloseModal()
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClinic(null)
    setSelectedBranch('')
    setSelectedDoctor('')
    setFormData({
      name: '',
      phone: '',
      complaint: '',
      timeslotId: '',
      date: ''
    })
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
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662zm-.081 3.328a3.47 3.47 0 01-.567.267z" clipRule="evenodd" />
                      </svg>
                      {formatCurrency(clinic.priceRangeMin)} - {formatCurrency(clinic.priceRangeMax)}
                    </div>
                  </div>

                  <Dialog open={isModalOpen && selectedClinic?.id === clinic.id} onOpenChange={(open) => {
                    if (!open) handleCloseModal()
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full cursor-pointer"
                        onClick={() => handleRegister(clinic)}
                      >
                        Daftar Sekarang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Daftar di {clinic.name}</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4 border-b pb-4">
                          <h3 className="text-lg font-medium text-gray-900">Informasi Pribadi</h3>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Nama Lengkap <span className="text-red-500">*</span>
                            </label>
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
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+628123456789"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Pastikan nomor terhubung dengan WhatsApp untuk komunikasi
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Keluhan <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                              required
                              value={formData.complaint}
                              onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                              placeholder="Jelaskan keluhan atau gejala yang Anda alami"
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Appointment Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Informasi Kunjungan</h3>
                          
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
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih cabang" />
                                </SelectTrigger>
                                <SelectContent>
                                  {branches?.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.id}>
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
                                <Select onValueChange={handleDoctorChange} value={selectedDoctor}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih dokter" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {doctors?.map((doctor) => (
                                      <SelectItem key={doctor.id} value={doctor.id}>
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
                                  <span className="text-sm text-gray-500">Loading available times...</span>
                                </div>
                              ) : timeslotsError ? (
                                <Alert className="mb-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    Error loading timeslots. Please try again.
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <Select onValueChange={handleTimeslotChange} value={formData.timeslotId}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih waktu kunjungan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeslots?.map((timeslot) => (
                                      <SelectItem key={timeslot.id} value={timeslot.id}>
                                        {getDayName(timeslot.dayOfWeek)} - {formatTime(timeslot.startTime)} - {formatTime(timeslot.endTime)}
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
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          )}
                        </div>

                        {/* Error Display */}
                        {createReservationMutation.isError && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                              {createReservationMutation.error?.message || 'Failed to create reservation. Please try again.'}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCloseModal}
                            className="flex-1 cursor-pointer"
                            disabled={createReservationMutation.isPending}
                          >
                            Batal
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 cursor-pointer"
                            disabled={createReservationMutation.isPending || !formData.name || !formData.phone || !formData.complaint || !formData.timeslotId || !formData.date}
                          >
                            {createReservationMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creating...
                              </>
                            ) : (
                              'Daftar'
                            )}
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
