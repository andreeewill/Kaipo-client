"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, CheckCircle, AlertCircle, Search, Sparkles } from "lucide-react";

interface AIDiagnosisItem {
  date: string;
  symptoms: string[];
  aiSuggestion: string;
  confidence: number;
  recommendations: string[];
}

interface ExaminationEntry {
  id: string;
  selectedLocation: string;
  complaint: string;
  toothCondition: {
    location: string;
    condition: string;
    restoration: string;
  };
}

interface AIDiagnosisProps {
  aiHistory: AIDiagnosisItem[];
  examinationData?: {
    examinationEntries: ExaminationEntry[];
    intraoralData?: Record<string, unknown>;
    extraoralData?: Record<string, unknown>;
    radiographyData?: Record<string, unknown>;
  };
}

interface DiagnosisData {
  diagnosis: string;
  icd10Code: string;
  icd10Description: string;
}

// Mock ICD-10 data for autocomplete
const mockICD10Data = [
  { code: "K02.9", description: "Karies gigi, tidak spesifik" },
  { code: "K04.7", description: "Abses periapikal tanpa sinus" },
  { code: "K05.0", description: "Gingivitis akut" },
  { code: "K05.1", description: "Gingivitis kronis" },
  { code: "K08.1", description: "Kehilangan gigi karena kecelakaan, ekstraksi, atau penyakit periodontal lokal" },
  { code: "K10.2", description: "Kondisi inflamasi rahang" },
  { code: "K12.0", description: "Stomatitis aphthous berulang" },
  { code: "K13.0", description: "Penyakit bibir" },
  { code: "M79.1", description: "Mialgia" },
  { code: "R68.8", description: "Gejala dan tanda umum lainnya yang spesifik" }
];

export function AIDiagnosis({ aiHistory, examinationData }: AIDiagnosisProps) {
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [icd10Input, setICD10Input] = useState("");
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    diagnosis: "",
    icd10Code: "",
    icd10Description: ""
  });
  const [showICD10Suggestions, setShowICD10Suggestions] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50 border-green-200";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Filter ICD-10 suggestions based on input
  const filteredICD10 = mockICD10Data.filter(item => 
    item.code.toLowerCase().includes(icd10Input.toLowerCase()) ||
    item.description.toLowerCase().includes(icd10Input.toLowerCase()) ||
    item.description.toLowerCase().includes(diagnosisInput.toLowerCase())
  );

  // AI-powered search for matching ICD-10 codes
  const handleAISearch = async () => {
    if (!diagnosisInput.trim()) return;
    
    setIsAISearching(true);
    
    // Simulate AI search delay
    setTimeout(() => {
      const matchingICD = mockICD10Data.find(item => 
        item.description.toLowerCase().includes(diagnosisInput.toLowerCase())
      );
      
      if (matchingICD) {
        setDiagnosisData(prev => ({
          ...prev,
          diagnosis: diagnosisInput,
          icd10Code: matchingICD.code,
          icd10Description: matchingICD.description
        }));
        setICD10Input(matchingICD.code);
      }
      
      setIsAISearching(false);
    }, 1500);
  };

  const handleDiagnosisChange = (value: string) => {
    setDiagnosisInput(value);
  };

  const handleICD10Change = (value: string) => {
    setICD10Input(value);
    setShowICD10Suggestions(value.length > 0);
  };

  const selectICD10 = (item: typeof mockICD10Data[0]) => {
    setICD10Input(item.code);
    setDiagnosisData(prev => ({
      ...prev,
      icd10Code: item.code,
      icd10Description: item.description
    }));
    setShowICD10Suggestions(false);
  };

  const saveDiagnosis = () => {
    if (!diagnosisInput.trim() || !icd10Input.trim()) {
      alert("Mohon lengkapi diagnosis dan kode ICD-10");
      return;
    }

    const newDiagnosis = {
      ...diagnosisData,
      diagnosis: diagnosisInput,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    console.log("Saving diagnosis:", newDiagnosis);
    
    // Reset form
    setDiagnosisInput("");
    setICD10Input("");
    setDiagnosisData({
      diagnosis: "",
      icd10Code: "",
      icd10Description: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Diagnosis Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Input Diagnosa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Diagnosis Input - Full Width */}
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Diagnosa
              </label>
              <div className="relative">
                <Textarea
                  value={diagnosisInput}
                  onChange={(e) => handleDiagnosisChange(e.target.value)}
                  placeholder="Masukkan diagnosis..."
                  className="pr-12 min-h-[80px]"
                  rows={3}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                  onClick={handleAISearch}
                  disabled={isAISearching || !diagnosisInput.trim()}
                  title="Cari ICD-10 dengan AI"
                >
                  {isAISearching ? (
                    <div className="animate-spin">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  )}
                </Button>
              </div>
            </div>

            {/* ICD-10 Input Below */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Kode ICD-10
              </label>
              <div className="relative">
                <Input
                  value={icd10Input}
                  onChange={(e) => handleICD10Change(e.target.value)}
                  placeholder="Cari kode ICD-10..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* ICD-10 Suggestions Dropdown */}
              {showICD10Suggestions && filteredICD10.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredICD10.slice(0, 10).map((item) => (
                    <div
                      key={item.code}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectICD10(item)}
                    >
                      <div className="font-medium text-sm text-blue-600">{item.code}</div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected ICD-10 Display */}
          {diagnosisData.icd10Code && diagnosisData.icd10Description && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">
                    {diagnosisData.icd10Code} - {diagnosisData.icd10Description}
                  </div>
                  {diagnosisInput && (
                    <div className="text-sm text-blue-600 mt-1">
                      Diagnosis: {diagnosisInput}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveDiagnosis}>
              Simpan Diagnosa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Examination Summary */}
      {examinationData && 
       examinationData.examinationEntries && 
       examinationData.examinationEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Ringkasan Pemeriksaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examinationData.examinationEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Pemeriksaan {index + 1}
                    </Badge>
                    {entry.selectedLocation && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {entry.selectedLocation === "ALL" ? "Semua Gigi" :
                         entry.selectedLocation === "RA" ? "Rahang Atas (RA)" :
                         entry.selectedLocation === "RB" ? "Rahang Bawah (RB)" :
                         `Gigi ${entry.selectedLocation}`}
                      </Badge>
                    )}
                    {entry.toothCondition.condition && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {entry.toothCondition.condition}
                      </Badge>
                    )}
                  </div>
                  
                  {entry.complaint && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Keterangan / Keluhan:</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{entry.complaint}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Diagnosis Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Diagnosis Summary
          </CardTitle>
          <p className="text-sm text-gray-600">
            Ringkasan hasil analisis AI untuk diagnosa pasien
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiHistory.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {new Date(item.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(item.confidence)}>
                      {getConfidenceIcon(item.confidence)}
                      <span className="ml-1">
                        Confidence: {Math.round(item.confidence * 100)}%
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Symptoms */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Gejala yang Dianalisis</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.symptoms.map((symptom, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* AI Suggestion */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Saran AI</h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-800">{item.aiSuggestion}</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rekomendasi Tindakan</h4>
                    <div className="space-y-2">
                      {item.recommendations.map((recommendation, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-yellow-800">
                        <strong>Disclaimer:</strong> Hasil AI ini hanya sebagai bantuan diagnosis awal. 
                        Keputusan final tetap memerlukan evaluasi dan konfirmasi dari dokter yang kompeten.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {aiHistory.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data AI Diagnosis</h3>
              <p className="text-gray-600">
                Data AI diagnosis akan muncul setelah pasien melakukan konsultasi dengan fitur AI.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
