"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Activity, Eye } from "lucide-react";

interface Encounter {
  id: number;
  date: string;
  type: string;
  doctor: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
  };
}

interface PatientHistoryProps {
  encounters: Encounter[];
}

export function PatientHistory({ encounters }: PatientHistoryProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "consultation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "follow-up":
        return "bg-green-100 text-green-800 border-green-200";
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Riwayat Kunjungan Pasien
          </CardTitle>
          <p className="text-sm text-gray-600">
            Total {encounters.length} kunjungan dalam rekam medis
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {encounters.map((encounter, index) => (
              <div key={encounter.id} className="relative">
                {/* Timeline connector */}
                {index < encounters.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Encounter content */}
                  <div className="flex-1">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getTypeColor(encounter.type)}>
                              {encounter.type}
                            </Badge>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(encounter.date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Detail
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{encounter.doctor}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Keluhan Utama</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {encounter.chiefComplaint}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {encounter.diagnosis}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Perawatan</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {encounter.treatment}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Catatan Dokter</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {encounter.notes}
                          </p>
                        </div>
                        
                        {/* Vitals */}
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Tanda Vital
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                              <div className="text-red-600 font-medium">Tekanan Darah</div>
                              <div className="text-red-800 font-semibold">{encounter.vitals.bloodPressure}</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                              <div className="text-blue-600 font-medium">Detak Jantung</div>
                              <div className="text-blue-800 font-semibold">{encounter.vitals.heartRate}</div>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                              <div className="text-orange-600 font-medium">Suhu Tubuh</div>
                              <div className="text-orange-800 font-semibold">{encounter.vitals.temperature}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
