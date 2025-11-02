"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Edit, Save, X, Calendar } from "lucide-react";

interface ToothData {
  status: "healthy" | "filled" | "crown" | "missing" | "caries" | "root_canal";
  notes: string;
}

interface OdontogramData {
  teeth: Record<string, ToothData>;
  lastUpdate: string;
}

interface PatientOdontogramProps {
  odontogramData: OdontogramData;
  patientId: number;
}

export function PatientOdontogram({ odontogramData }: PatientOdontogramProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(odontogramData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "filled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "crown":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "missing":
        return "bg-red-100 text-red-800 border-red-200";
      case "caries":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "root_canal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy":
        return "Sehat";
      case "filled":
        return "Tambal";
      case "crown":
        return "Mahkota";
      case "missing":
        return "Hilang";
      case "caries":
        return "Karies";
      case "root_canal":
        return "Saluran Akar";
      default:
        return "Tidak diketahui";
    }
  };

  const handleSave = () => {
    // In a real application, this would save to the database
    console.log("Saving odontogram data:", editedData);
    setIsEditing(false);
    // Update the last update date
    setEditedData({
      ...editedData,
      lastUpdate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCancel = () => {
    setEditedData(odontogramData);
    setIsEditing(false);
  };

  const updateToothStatus = (toothNumber: string, status: ToothData['status']) => {
    setEditedData({
      ...editedData,
      teeth: {
        ...editedData.teeth,
        [toothNumber]: {
          ...editedData.teeth[toothNumber],
          status: status
        }
      }
    });
  };

  // Define tooth numbers for adult dentition
  const upperTeeth = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"];
  const lowerTeeth = ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"];

  const statusOptions = [
    { value: "healthy", label: "Sehat", color: "green" },
    { value: "filled", label: "Tambal", color: "blue" },
    { value: "crown", label: "Mahkota", color: "purple" },
    { value: "missing", label: "Hilang", color: "red" },
    { value: "caries", label: "Karies", color: "orange" },
    { value: "root_canal", label: "Saluran Akar", color: "yellow" },
  ];

  const renderTooth = (toothNumber: string) => {
    const tooth = editedData.teeth[toothNumber] || { status: "healthy", notes: "" };
    
    return (
      <div key={toothNumber} className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-110 ${
            isEditing ? "border-gray-400" : "border-gray-300"
          }`}
          style={{
            backgroundColor: statusOptions.find(s => s.value === tooth.status)?.color === "green" ? "#dcfce7" :
                            statusOptions.find(s => s.value === tooth.status)?.color === "blue" ? "#dbeafe" :
                            statusOptions.find(s => s.value === tooth.status)?.color === "purple" ? "#e9d5ff" :
                            statusOptions.find(s => s.value === tooth.status)?.color === "red" ? "#fee2e2" :
                            statusOptions.find(s => s.value === tooth.status)?.color === "orange" ? "#fed7aa" :
                            statusOptions.find(s => s.value === tooth.status)?.color === "yellow" ? "#fef3c7" : "#f3f4f6"
          }}
        >
          {tooth.status === "missing" ? "X" : toothNumber.slice(-1)}
        </div>
        <span className="text-xs mt-1">{toothNumber}</span>
        {isEditing && (
          <select
            value={tooth.status}
            onChange={(e) => updateToothStatus(toothNumber, e.target.value as ToothData['status'])}
            className="text-xs mt-1 border rounded px-1 py-0.5"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-blue-600" />
              Odontogram Pasien
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Update terakhir: {new Date(editedData.lastUpdate).toLocaleDateString('id-ID')}
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Keterangan Status Gigi</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {statusOptions.map(option => (
                <Badge key={option.value} variant="outline" className={getStatusColor(option.value)}>
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Odontogram Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            {/* Upper Teeth */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Gigi Atas</h4>
              <div className="flex justify-center gap-2">
                {upperTeeth.map(renderTooth)}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Lower Teeth */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Gigi Bawah</h4>
              <div className="flex justify-center gap-2">
                {lowerTeeth.map(renderTooth)}
              </div>
            </div>
          </div>

          {/* Detailed Status */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Detail Status Gigi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(editedData.teeth).map(([toothNumber, tooth]) => (
                tooth.status !== "healthy" && (
                  <div key={toothNumber} className="bg-white border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Gigi {toothNumber}</span>
                      <Badge variant="outline" className={getStatusColor(tooth.status)}>
                        {getStatusLabel(tooth.status)}
                      </Badge>
                    </div>
                    {tooth.notes && (
                      <p className="text-sm text-gray-600">{tooth.notes}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Mode Edit:</strong> Klik pada gigi dan pilih status dari dropdown yang muncul di bawah setiap gigi.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
