"use client";
import React, { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientPersonalInfo } from "@/components/medical-record/PatientPersonalInfo";
import { PatientHistory } from "@/components/medical-record/PatientHistory";
import { PatientExamination } from "@/components/medical-record/PatientExamination";
import { AIDiagnosis } from "@/components/medical-record/AIDiagnosis";
import { PatientOdontogram } from "@/components/medical-record/PatientOdontogram";
import { PatientPayment } from "@/components/medical-record/PatientPayment";
import { AddMedicalHistoryDialog } from "@/components/medical-record/AddMedicalHistoryDialog";
import { ArrowLeft, Calendar, User, FileText, Brain, Smile, CreditCard, Activity } from "lucide-react";

// Mock data - in a real app, this would come from an API
const generatePatientDetail = (id: string) => {
  return {
    id: parseInt(id),
    rmeNumber: `RME-${String(id).padStart(6, "0")}`,
    name: `Patient ${id}`,
    age: Math.floor(Math.random() * 60) + 20,
    gender: parseInt(id) % 2 === 0 ? "Male" : "Female",
    dateOfBirth: "1990-05-15",
    address: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta",
    phone: "+62 812-3456-7890",
    email: `patient${id}@email.com`,
    emergencyContact: {
      name: `Emergency Contact ${id}`,
      relationship: "Spouse",
      phone: "+62 813-9876-5432",
    },
    firstVisitDate: "2023-01-15",
    allergies: "Penicillin",
    medicalHistoryShort: "Hypertension, Type 2 Diabetes",
    bloodType: "A+",
    weight: "70 kg",
    height: "170 cm",
    personalInfo: {
      idNumber: "3172051234567890",
      nationality: "Indonesian",
      religion: "Islam",
      maritalStatus: "Married",
      occupation: "Software Engineer",
      insurance: {
        provider: "BPJS Kesehatan",
        number: "0001234567890",
      },
    },
    encounters: [
      {
        id: 1,
        date: "2024-11-01",
        type: "Consultation",
        doctor: "Dr. Ahmad Wijaya",
        chiefComplaint: "Nyeri gigi geraham kanan",
        diagnosis: "Karies gigi M1 kanan atas",
        treatment: "Penambalan komposit",
        notes: "Pasien datang dengan keluhan nyeri pada gigi geraham kanan atas sejak 3 hari. Pemeriksaan menunjukkan karies pada gigi 16.",
        vitals: {
          bloodPressure: "120/80",
          heartRate: "72 bpm",
          temperature: "36.5°C",
        },
      },
      {
        id: 2,
        date: "2024-10-15",
        type: "Follow-up",
        doctor: "Dr. Ahmad Wijaya",
        chiefComplaint: "Kontrol pasca penambalan",
        diagnosis: "Post filling composite tooth 16",
        treatment: "Evaluasi dan pembersihan karang gigi",
        notes: "Kondisi tambalan baik, tidak ada keluhan. Dilakukan scaling untuk pembersihan karang gigi.",
        vitals: {
          bloodPressure: "118/78",
          heartRate: "70 bpm",
          temperature: "36.3°C",
        },
      },
    ],
    aiDiagnosisHistory: [
      {
        date: "2024-11-01",
        symptoms: ["Nyeri gigi", "Sensitif terhadap dingin", "Nyeri saat mengunyah"],
        aiSuggestion: "Kemungkinan karies gigi dengan tingkat keparahan sedang. Disarankan pemeriksaan radiologi dan perawatan konservatif berupa penambalan.",
        confidence: 0.87,
        recommendations: [
          "Pemeriksaan radiologi panoramik",
          "Penambalan dengan bahan komposit",
          "Kontrol 2 minggu kemudian",
          "Edukasi oral hygiene",
        ],
      },
    ],
    odontogramData: {
      teeth: {
        "11": { status: "healthy", notes: "" },
        "12": { status: "healthy", notes: "" },
        "13": { status: "healthy", notes: "" },
        "14": { status: "healthy", notes: "" },
        "15": { status: "healthy", notes: "" },
        "16": { status: "filled", notes: "Composite filling" },
        "17": { status: "healthy", notes: "" },
        "18": { status: "missing", notes: "Extracted" },
        "21": { status: "healthy", notes: "" },
        "22": { status: "healthy", notes: "" },
        "23": { status: "healthy", notes: "" },
        "24": { status: "healthy", notes: "" },
        "25": { status: "healthy", notes: "" },
        "26": { status: "healthy", notes: "" },
        "27": { status: "healthy", notes: "" },
        "28": { status: "healthy", notes: "" },
      },
      lastUpdate: "2024-11-01",
    },
    payments: [
      {
        id: 1,
        date: "2024-11-01",
        treatmentDate: "2024-11-01",
        services: [
          { name: "Konsultasi Dokter Gigi", price: 150000, quantity: 1 },
          { name: "Penambalan Komposit", price: 350000, quantity: 1 },
          { name: "Foto Rontgen", price: 100000, quantity: 1 },
        ],
        medicines: [
          { name: "Asam Mefenamat 500mg", price: 15000, quantity: 10 },
          { name: "Chlorhexidine Mouthwash", price: 25000, quantity: 1 },
        ],
        totalAmount: 640000,
        paymentStatus: "Paid",
        paymentMethod: "BPJS + Cash",
        notes: "Covered by BPJS: 70%, Patient payment: 30%",
      },
      {
        id: 2,
        date: "2024-10-15",
        treatmentDate: "2024-10-15",
        services: [
          { name: "Scaling", price: 200000, quantity: 1 },
          { name: "Konsultasi", price: 150000, quantity: 1 },
        ],
        medicines: [],
        totalAmount: 350000,
        paymentStatus: "Paid",
        paymentMethod: "Cash",
        notes: "Full payment by patient",
      },
    ],
  };
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [examinationData, setExaminationData] = useState<Record<string, unknown>>({
    selectedLocation: "",
    complaint: "",
    toothCondition: null
  });
  
  const patientId = params.id as string;
  const patient = generatePatientDetail(patientId);

  const isNewPatient = patient.encounters.length === 0;

  const handleExaminationUpdate = useCallback((data: Record<string, unknown>) => {
    setExaminationData(data);
  }, []);

  return (
    <Layout>
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Detail Rekam Medik Elektronik (RME)
          </h1>
        </div>

        {/* Patient Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Ringkasan Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Patient Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informasi Dasar
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. RME:</span>
                    <span className="font-medium text-blue-600">{patient.rmeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Umur:</span>
                    <span className="font-medium">{patient.age} tahun</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jenis Kelamin:</span>
                    <span className="font-medium">{patient.gender === "Male" ? "Laki-laki" : "Perempuan"}</span>
                  </div>
                </div>
              </div>

              {/* Medical Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Ringkasan Medis
                  </div>
                  <AddMedicalHistoryDialog 
                    patientId={patient.id} 
                    onSave={(historyData) => {
                      console.log("New medical history:", historyData);
                      // Here you would typically update the patient data or call an API
                    }}
                  />
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kunjungan Pertama:</span>
                    <span className="font-medium">{new Date(patient.firstVisitDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alergi:</span>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {patient.allergies}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Riwayat Medis:</span>
                    <p className="font-medium text-sm mt-1">{patient.medicalHistoryShort}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Info Personal
            </TabsTrigger>
            {!isNewPatient && (
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Riwayat
              </TabsTrigger>
            )}
            <TabsTrigger value="examination" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Pemeriksaan
            </TabsTrigger>
            <TabsTrigger value="ai-diagnosis" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Diagnosa
            </TabsTrigger>
            <TabsTrigger value="odontogram" className="flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Odontogram
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pembayaran
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="personal">
              <PatientPersonalInfo patient={patient} />
            </TabsContent>
            
            {!isNewPatient && (
              <TabsContent value="history">
                <PatientHistory encounters={patient.encounters} />
              </TabsContent>
            )}
            
            <TabsContent value="examination">
              <PatientExamination 
                patientId={patient.id} 
                onDataChange={handleExaminationUpdate}
              />
            </TabsContent>
            
            <TabsContent value="ai-diagnosis">
              <AIDiagnosis 
                aiHistory={patient.aiDiagnosisHistory} 
                examinationData={examinationData}
              />
            </TabsContent>
            
            <TabsContent value="odontogram">
              <PatientOdontogram odontogramData={patient.odontogramData} patientId={patient.id} />
            </TabsContent>
            
            <TabsContent value="payment">
              <PatientPayment payments={patient.payments} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
