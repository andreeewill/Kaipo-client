"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Stethoscope, Brain, FileText } from "lucide-react";
import { useDiagnosisMutation } from "@/lib/queries";
import type { DiagnosisRequest } from "@/types/api";

export default function AIDiagnosisPage() {
  const [formData, setFormData] = useState<DiagnosisRequest>({
    anamnesis: "",
    examination: "",
  });

  const diagnosisMutation = useDiagnosisMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    diagnosisMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({ anamnesis: "", examination: "" });
    diagnosisMutation.reset();
  };

  const fillExample = () => {
    setFormData({
      anamnesis:
        "pasien datang dengan gusi kanan bengkak besar, disertai demam. Gigi kanan bawah belakang berlubang besar, terasa nyeri bila tersentuh. Pasien minum obat anti nyeri tidak mempan",
      examination:
        "pembengkakan ekstra oral kanan, palpasi (+) meluas hingga area submandibula. Gigi 46 karies klas I D6, perkusi (+), palpasi (+), nyeri tekan (+), fluktuasi (+)",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Diagnosis Assistant
              </h1>
              <p className="text-gray-600">
                Dapatkan rekomendasi diagnosis berdasarkan anamnesis dan
                pemeriksaan
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Input Data Pasien
              </CardTitle>
              <CardDescription>
                Masukkan data anamnesis dan hasil pemeriksaan untuk mendapatkan
                rekomendasi diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Anamnesis <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    required
                    value={formData.anamnesis}
                    onChange={(e) =>
                      setFormData({ ...formData, anamnesis: e.target.value })
                    }
                    placeholder="Masukkan keluhan utama, riwayat penyakit sekarang, dan informasi anamnesis lainnya..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pemeriksaan <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    required
                    value={formData.examination}
                    onChange={(e) =>
                      setFormData({ ...formData, examination: e.target.value })
                    }
                    placeholder="Masukkan hasil pemeriksaan fisik, tanda vital, dan temuan klinis lainnya..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {diagnosisMutation.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      {diagnosisMutation.error.message ||
                        "Terjadi kesalahan saat memproses diagnosis"}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={
                      diagnosisMutation.isPending ||
                      !formData.anamnesis.trim() ||
                      !formData.examination.trim()
                    }
                    className="flex-1 cursor-pointer"
                  >
                    {diagnosisMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Analisis Diagnosis
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="cursor-pointer"
                  >
                    Reset
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={fillExample}
                  className="w-full text-sm cursor-pointer"
                >
                  Isi dengan contoh data
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Hasil Diagnosis
              </CardTitle>
              <CardDescription>
                Rekomendasi diagnosis berdasarkan AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!diagnosisMutation.data && !diagnosisMutation.isPending && (
                <div className="text-center py-12 text-gray-500">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Masukkan data anamnesis dan pemeriksaan untuk mendapatkan
                    hasil diagnosis
                  </p>
                </div>
              )}

              {diagnosisMutation.isPending && (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
                  <p className="text-gray-600">Sedang menganalisis data...</p>
                </div>
              )}

              {diagnosisMutation.data && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Ringkasan Diagnosis
                    </h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {diagnosisMutation.data.data.summary}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">
                      Rekomendasi Diagnosis
                    </h3>
                    {diagnosisMutation.data.data.recommendations.map(
                      (recommendation, index) => (
                        <Card
                          key={index}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {recommendation.diagnosis}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {recommendation.icd10}
                                </Badge>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {recommendation.reasoning}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>

                  {/* Operation ID */}
                  <div className="text-xs text-gray-500 pt-4 border-t">
                    Operation ID: {diagnosisMutation.data.operationId}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
