"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Plus, 
  Minus, 
  Camera, 
  Upload,
  Eye,
  Smile,
  MapPin,
  Activity
} from "lucide-react";

interface ExaminationProps {
  patientId: number;
  onDataChange?: (data: Record<string, unknown>) => void;
}

interface ToothCondition {
  location: string;
  condition: string;
  restoration: string;
}

interface ExaminationEntry {
  id: string;
  selectedLocation: string;
  complaint: string;
  toothCondition: ToothCondition;
}

interface IntraoralExam {
  oralHygiene: string;
  periodontalTissue: string;
  salivaryGlands: string;
  buccalMucosa: string;
  labialMucosa: string;
  tongue: string;
  floorOfMouth: string;
  hardPalate: string;
  softPalate: string;
  uvulaAndTonsilPillars: string;
  others: string;
}

interface LymphNode {
  palpation: string;
  pain: string;
}

interface ExtraoralExam {
  lymphNodes: {
    cervical: {
      right: LymphNode;
      left: LymphNode;
    };
    submandibular: {
      right: LymphNode;
      left: LymphNode;
    };
    submental: {
      right: LymphNode;
      left: LymphNode;
    };
  };
  tmj: string;
  face: {
    symmetry: string;
    notes: string;
  };
  lips: string;
}

interface RadiographyExam {
  type: string;
  customType: string;
  uploadedImage: File | null;
  imagePreview: string | null;
  description: string;
}

export function PatientExamination({ onDataChange }: ExaminationProps) {
  const [examinationEntries, setExaminationEntries] = useState<ExaminationEntry[]>([
    {
      id: '1',
      selectedLocation: "",
      complaint: "Pasien datang dengan keluhan...",
      toothCondition: {
        location: "",
        condition: "",
        restoration: ""
      }
    }
  ]);
  
  // Form states for additional examinations
  const [showIntraoral, setShowIntraoral] = useState(false);
  const [showExtraoral, setShowExtraoral] = useState(false);
  const [showRadiography, setShowRadiography] = useState(false);
  
  const [intraoralData, setIntraoralData] = useState<IntraoralExam>({
    oralHygiene: "",
    periodontalTissue: "",
    salivaryGlands: "",
    buccalMucosa: "",
    labialMucosa: "",
    tongue: "",
    floorOfMouth: "",
    hardPalate: "",
    softPalate: "",
    uvulaAndTonsilPillars: "",
    others: ""
  });

  const [extraoralData, setExtraoralData] = useState<ExtraoralExam>({
    lymphNodes: {
      cervical: {
        right: { palpation: "", pain: "" },
        left: { palpation: "", pain: "" }
      },
      submandibular: {
        right: { palpation: "", pain: "" },
        left: { palpation: "", pain: "" }
      },
      submental: {
        right: { palpation: "", pain: "" },
        left: { palpation: "", pain: "" }
      }
    },
    tmj: "",
    face: { symmetry: "", notes: "" },
    lips: ""
  });

  const [radiographyData, setRadiographyData] = useState<RadiographyExam>({
    type: "",
    customType: "",
    uploadedImage: null,
    imagePreview: null,
    description: ""
  });

  const prevDataRef = useRef<string>('');

  // Add new examination entry
  const addExaminationEntry = () => {
    const newEntry: ExaminationEntry = {
      id: Date.now().toString(),
      selectedLocation: "",
      complaint: "",
      toothCondition: {
        location: "",
        condition: "",
        restoration: ""
      }
    };
    setExaminationEntries(prev => [...prev, newEntry]);
  };

  // Remove examination entry
  const removeExaminationEntry = (id: string) => {
    if (examinationEntries.length > 1) {
      setExaminationEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Update examination entry
  const updateExaminationEntry = (id: string, field: keyof ExaminationEntry, value: string | ToothCondition) => {
    setExaminationEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  // Update tooth condition for specific entry
  const updateToothCondition = (entryId: string, field: keyof ToothCondition, value: string) => {
    setExaminationEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, toothCondition: { ...entry.toothCondition, [field]: value } }
        : entry
    ));
  };

  // Notify parent component when examination data changes
  useEffect(() => {
    if (onDataChange) {
      const currentData = {
        examinationEntries,
        intraoralData,
        extraoralData,
        radiographyData
      };
      
      const currentDataString = JSON.stringify(currentData);
      
      // Only call onDataChange if the data has actually changed
      if (currentDataString !== prevDataRef.current) {
        prevDataRef.current = currentDataString;
        onDataChange(currentData);
      }
    }
  }, [examinationEntries, intraoralData, extraoralData, radiographyData, onDataChange]);

  // Location options
  const locationOptions = [
    { value: "ALL", label: "Semua Gigi" },
    { value: "RA", label: "Rahang Atas (RA)" },
    { value: "RB", label: "Rahang Bawah (RB)" },
    ...Array.from({ length: 32 }, (_, i) => {
      const toothNumber = i < 16 ? (18 - i).toString() : (i + 17).toString();
      const toothName = getToothName(toothNumber);
      return {
        value: toothNumber,
        label: `${toothNumber} - ${toothName}`
      };
    })
  ];

  // Tooth conditions
  const conditionOptions = [
    { value: "healthy", label: "Sehat" },
    { value: "caries", label: "Karies" },
    { value: "filled", label: "Tumpatan" },
    { value: "crown", label: "Mahkota" },
    { value: "missing", label: "Hilang" },
    { value: "root_canal", label: "Perawatan Saluran Akar" },
    { value: "impacted", label: "Impaksi" },
    { value: "fractured", label: "Fraktur" }
  ];

  const restorationOptions = [
    { value: "none", label: "Tidak Ada" },
    { value: "composite", label: "Komposit" },
    { value: "amalgam", label: "Amalgam" },
    { value: "glass_ionomer", label: "Glass Ionomer" },
    { value: "inlay", label: "Inlay" },
    { value: "onlay", label: "Onlay" },
    { value: "crown", label: "Mahkota" },
    { value: "veneer", label: "Veneer" },
    { value: "bridge", label: "Bridge" }
  ];

  function getToothName(toothNumber: string): string {
    const toothNames: Record<string, string> = {
      "18": "M3 Kanan Atas", "17": "M2 Kanan Atas", "16": "M1 Kanan Atas",
      "15": "PM2 Kanan Atas", "14": "PM1 Kanan Atas", "13": "C Kanan Atas",
      "12": "I2 Kanan Atas", "11": "I1 Kanan Atas", "21": "I1 Kiri Atas",
      "22": "I2 Kiri Atas", "23": "C Kiri Atas", "24": "PM1 Kiri Atas",
      "25": "PM2 Kiri Atas", "26": "M1 Kiri Atas", "27": "M2 Kiri Atas",
      "28": "M3 Kiri Atas", "38": "M3 Kiri Bawah", "37": "M2 Kiri Bawah",
      "36": "M1 Kiri Bawah", "35": "PM2 Kiri Bawah", "34": "PM1 Kiri Bawah",
      "33": "C Kiri Bawah", "32": "I2 Kiri Bawah", "31": "I1 Kiri Bawah",
      "41": "I1 Kanan Bawah", "42": "I2 Kanan Bawah", "43": "C Kanan Bawah",
      "44": "PM1 Kanan Bawah", "45": "PM2 Kanan Bawah", "46": "M1 Kanan Bawah",
      "47": "M2 Kanan Bawah", "48": "M3 Kanan Bawah"
    };
    return toothNames[toothNumber] || "Gigi";
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRadiographyData(prev => ({
          ...prev,
          uploadedImage: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRadiographyData(prev => ({
          ...prev,
          uploadedImage: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Pemeriksaan Klinis
            </div>
            <Button
              onClick={addExaminationEntry}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Tambah Pemeriksaan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {examinationEntries.map((entry, index) => {
            const isSpecificTooth = entry.selectedLocation && !["ALL", "RA", "RB"].includes(entry.selectedLocation);
            
            return (
              <div key={entry.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Pemeriksaan {index + 1}</h4>
                  {examinationEntries.length > 1 && (
                    <Button
                      onClick={() => removeExaminationEntry(entry.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                
                {/* Location Selection */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pilih Lokasi Pemeriksaan
                  </label>
                  <Select 
                    value={entry.selectedLocation} 
                    onValueChange={(value) => updateExaminationEntry(entry.id, 'selectedLocation', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih lokasi pemeriksaan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tooth Condition (only for specific teeth) */}
                {isSpecificTooth && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Keadaan Gigi
                      </label>
                      <Select 
                        value={entry.toothCondition.condition} 
                        onValueChange={(value) => updateToothCondition(entry.id, 'condition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih keadaan gigi..." />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Jenis Restorasi
                      </label>
                      <Select 
                        value={entry.toothCondition.restoration} 
                        onValueChange={(value) => updateToothCondition(entry.id, 'restoration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis restorasi..." />
                        </SelectTrigger>
                        <SelectContent>
                          {restorationOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Odontogram Preview */}
                    {entry.toothCondition.condition && (
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Smile className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Preview Odontogram
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Gigi {entry.selectedLocation}: {conditionOptions.find(c => c.value === entry.toothCondition.condition)?.label}
                            {entry.toothCondition.restoration !== "none" && 
                              ` - ${restorationOptions.find(r => r.value === entry.toothCondition.restoration)?.label}`
                            }
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Complaints/Notes */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Keterangan / Keluhan
                  </label>
                  <Textarea
                    value={entry.complaint}
                    onChange={(e) => updateExaminationEntry(entry.id, 'complaint', e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Masukkan keterangan atau keluhan pasien..."
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optional Examination Forms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Pemeriksaan Tambahan (Opsional)
        </h3>

        {/* Intraoral Examination */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pemeriksaan Intraoral</CardTitle>
              <Button
                variant={showIntraoral ? "outline" : "default"}
                size="sm"
                onClick={() => setShowIntraoral(!showIntraoral)}
              >
                {showIntraoral ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {showIntraoral ? "Sembunyikan" : "Tambahkan"}
              </Button>
            </div>
          </CardHeader>
          {showIntraoral && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Kebersihan Mulut
                  </label>
                  <Select 
                    value={intraoralData.oralHygiene} 
                    onValueChange={(value) => setIntraoralData(prev => ({...prev, oralHygiene: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baik">Baik</SelectItem>
                      <SelectItem value="sedang">Sedang</SelectItem>
                      <SelectItem value="buruk">Buruk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Jaringan Periodontal
                  </label>
                  <Input 
                    value={intraoralData.periodontalTissue}
                    onChange={(e) => setIntraoralData(prev => ({...prev, periodontalTissue: e.target.value}))}
                    placeholder="Kondisi jaringan periodontal..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Kelenjar Saliva
                  </label>
                  <Input 
                    value={intraoralData.salivaryGlands}
                    onChange={(e) => setIntraoralData(prev => ({...prev, salivaryGlands: e.target.value}))}
                    placeholder="Kondisi kelenjar saliva..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Mukosa Bukal
                  </label>
                  <Input 
                    value={intraoralData.buccalMucosa}
                    onChange={(e) => setIntraoralData(prev => ({...prev, buccalMucosa: e.target.value}))}
                    placeholder="Kondisi mukosa bukal..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Mukosa Labial
                  </label>
                  <Input 
                    value={intraoralData.labialMucosa}
                    onChange={(e) => setIntraoralData(prev => ({...prev, labialMucosa: e.target.value}))}
                    placeholder="Kondisi mukosa labial..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Lidah
                  </label>
                  <Input 
                    value={intraoralData.tongue}
                    onChange={(e) => setIntraoralData(prev => ({...prev, tongue: e.target.value}))}
                    placeholder="Kondisi lidah..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Dasar Mulut
                  </label>
                  <Input 
                    value={intraoralData.floorOfMouth}
                    onChange={(e) => setIntraoralData(prev => ({...prev, floorOfMouth: e.target.value}))}
                    placeholder="Kondisi dasar mulut..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Palatum Durum
                  </label>
                  <Input 
                    value={intraoralData.hardPalate}
                    onChange={(e) => setIntraoralData(prev => ({...prev, hardPalate: e.target.value}))}
                    placeholder="Kondisi palatum durum..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Palatum Molle
                  </label>
                  <Input 
                    value={intraoralData.softPalate}
                    onChange={(e) => setIntraoralData(prev => ({...prev, softPalate: e.target.value}))}
                    placeholder="Kondisi palatum molle..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Uvula dan Pilar Tonsil
                  </label>
                  <Input 
                    value={intraoralData.uvulaAndTonsilPillars}
                    onChange={(e) => setIntraoralData(prev => ({...prev, uvulaAndTonsilPillars: e.target.value}))}
                    placeholder="Kondisi uvula dan pilar tonsil..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Lain-lain
                  </label>
                  <Input 
                    value={intraoralData.others}
                    onChange={(e) => setIntraoralData(prev => ({...prev, others: e.target.value}))}
                    placeholder="Temuan lain-lain..."
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Extraoral Examination */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pemeriksaan Ekstraoral</CardTitle>
              <Button
                variant={showExtraoral ? "outline" : "default"}
                size="sm"
                onClick={() => setShowExtraoral(!showExtraoral)}
              >
                {showExtraoral ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {showExtraoral ? "Sembunyikan" : "Tambahkan"}
              </Button>
            </div>
          </CardHeader>
          {showExtraoral && (
            <CardContent className="space-y-6">
              {/* Lymph Nodes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Kelenjar Limfe</h4>
                
                {/* Cervical */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Servikal</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kanan</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.cervical.right.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              cervical: {
                                ...prev.lymphNodes.cervical,
                                right: { ...prev.lymphNodes.cervical.right, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.cervical.right.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              cervical: {
                                ...prev.lymphNodes.cervical,
                                right: { ...prev.lymphNodes.cervical.right, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kiri</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.cervical.left.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              cervical: {
                                ...prev.lymphNodes.cervical,
                                left: { ...prev.lymphNodes.cervical.left, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.cervical.left.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              cervical: {
                                ...prev.lymphNodes.cervical,
                                left: { ...prev.lymphNodes.cervical.left, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submandibular */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Submandibular</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kanan</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.submandibular.right.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submandibular: {
                                ...prev.lymphNodes.submandibular,
                                right: { ...prev.lymphNodes.submandibular.right, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.submandibular.right.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submandibular: {
                                ...prev.lymphNodes.submandibular,
                                right: { ...prev.lymphNodes.submandibular.right, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kiri</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.submandibular.left.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submandibular: {
                                ...prev.lymphNodes.submandibular,
                                left: { ...prev.lymphNodes.submandibular.left, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.submandibular.left.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submandibular: {
                                ...prev.lymphNodes.submandibular,
                                left: { ...prev.lymphNodes.submandibular.left, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submental */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Submental</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kanan</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.submental.right.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submental: {
                                ...prev.lymphNodes.submental,
                                right: { ...prev.lymphNodes.submental.right, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.submental.right.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submental: {
                                ...prev.lymphNodes.submental,
                                right: { ...prev.lymphNodes.submental.right, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Kiri</label>
                      <div className="flex gap-2">
                        <Select 
                          value={extraoralData.lymphNodes.submental.left.palpation}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submental: {
                                ...prev.lymphNodes.submental,
                                left: { ...prev.lymphNodes.submental.left, palpation: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Palpasi..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tidak_teraba">Tidak Teraba</SelectItem>
                            <SelectItem value="lunak">Lunak</SelectItem>
                            <SelectItem value="keras">Keras</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={extraoralData.lymphNodes.submental.left.pain}
                          onValueChange={(value) => setExtraoralData(prev => ({
                            ...prev,
                            lymphNodes: {
                              ...prev.lymphNodes,
                              submental: {
                                ...prev.lymphNodes.submental,
                                left: { ...prev.lymphNodes.submental.left, pain: value }
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Nyeri..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="tidak_sakit">Tidak Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Other Extraoral Examinations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    TMJ
                  </label>
                  <Input 
                    value={extraoralData.tmj}
                    onChange={(e) => setExtraoralData(prev => ({...prev, tmj: e.target.value}))}
                    placeholder="Kondisi TMJ..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Bibir
                  </label>
                  <Input 
                    value={extraoralData.lips}
                    onChange={(e) => setExtraoralData(prev => ({...prev, lips: e.target.value}))}
                    placeholder="Kondisi bibir..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Wajah
                  </label>
                  <div className="flex gap-2">
                    <Select 
                      value={extraoralData.face.symmetry}
                      onValueChange={(value) => setExtraoralData(prev => ({
                        ...prev,
                        face: { ...prev.face, symmetry: value }
                      }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Simetri..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simetri">Simetri</SelectItem>
                        <SelectItem value="asimetri">Asimetri</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={extraoralData.face.notes}
                      onChange={(e) => setExtraoralData(prev => ({
                        ...prev,
                        face: { ...prev.face, notes: e.target.value }
                      }))}
                      placeholder="Keterangan tambahan wajah..."
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Radiography Examination */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pemeriksaan Radiografi</CardTitle>
              <Button
                variant={showRadiography ? "outline" : "default"}
                size="sm"
                onClick={() => setShowRadiography(!showRadiography)}
              >
                {showRadiography ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {showRadiography ? "Sembunyikan" : "Tambahkan"}
              </Button>
            </div>
          </CardHeader>
          {showRadiography && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Jenis Foto
                  </label>
                  <Select 
                    value={radiographyData.type} 
                    onValueChange={(value) => setRadiographyData(prev => ({...prev, type: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis foto..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="periapikal">Periapikal</SelectItem>
                      <SelectItem value="panoramik">Panoramik</SelectItem>
                      <SelectItem value="sefalometri">Sefalometri</SelectItem>
                      <SelectItem value="lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {radiographyData.type === "lain-lain" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Jenis Radiografi Lainnya
                    </label>
                    <Input 
                      value={radiographyData.customType}
                      onChange={(e) => setRadiographyData(prev => ({...prev, customType: e.target.value}))}
                      placeholder="Sebutkan jenis radiografi..."
                    />
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Foto Radiografi
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {radiographyData.imagePreview ? (
                    <div className="space-y-4">
                        <Image
                          src={radiographyData.imagePreview}
                          alt="Preview"
                          width={400}
                          height={256}
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm object-contain"
                        />
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setRadiographyData(prev => ({...prev, imagePreview: null, uploadedImage: null}))}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 mb-2">
                          Drag & drop foto di sini, atau klik untuk memilih
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="radiography-upload"
                        />
                        <label htmlFor="radiography-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Pilih File
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Keterangan Bacaan Röntgen
                </label>
                <Textarea
                  value={radiographyData.description}
                  onChange={(e) => setRadiographyData(prev => ({...prev, description: e.target.value}))}
                  rows={4}
                  placeholder="Masukkan interpretasi hasil radiografi..."
                />
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button size="lg" className="px-8">
          Simpan Pemeriksaan
        </Button>
      </div>
    </div>
  );
}
