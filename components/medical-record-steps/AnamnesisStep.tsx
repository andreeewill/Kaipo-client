"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface AnamnesisData {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems: string;
  physicalExamination: string;
  diagnosis: string;
  treatmentPlan: string;
  medications: Medication[];
}

interface AnamnesisStepProps {
  data: AnamnesisData;
  onUpdate: (data: AnamnesisData) => void;
}

export function AnamnesisStep({ data, onUpdate }: AnamnesisStepProps) {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const handleChange = (field: keyof AnamnesisData, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleMedicationChange = (field: keyof Medication, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addMedication = () => {
    if (newMedication.name.trim()) {
      onUpdate({
        ...data,
        medications: [...data.medications, newMedication],
      });
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      });
    }
  };

  const removeMedication = (index: number) => {
    onUpdate({
      ...data,
      medications: data.medications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Anamnesis & Diagnosis</h2>
        <p className="text-gray-600 mb-6">Enter information specific to this visit and current medical assessment.</p>
      </div>

      <div className="space-y-6">
        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint *
          </label>
          <Textarea
            value={data.chiefComplaint}
            onChange={(e) => handleChange("chiefComplaint", e.target.value)}
            placeholder="What is the main reason for the patient's visit?"
            rows={3}
            required
          />
        </div>

        {/* History of Present Illness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            History of Present Illness
          </label>
          <Textarea
            value={data.historyOfPresentIllness}
            onChange={(e) => handleChange("historyOfPresentIllness", e.target.value)}
            placeholder="Describe the progression and details of the current illness"
            rows={4}
          />
        </div>

        {/* Review of Systems */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review of Systems
          </label>
          <Textarea
            value={data.reviewOfSystems}
            onChange={(e) => handleChange("reviewOfSystems", e.target.value)}
            placeholder="Systematic review of body systems relevant to the chief complaint"
            rows={4}
          />
        </div>

        {/* Physical Examination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Physical Examination
          </label>
          <Textarea
            value={data.physicalExamination}
            onChange={(e) => handleChange("physicalExamination", e.target.value)}
            placeholder="Findings from physical examination"
            rows={4}
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis *
          </label>
          <Textarea
            value={data.diagnosis}
            onChange={(e) => handleChange("diagnosis", e.target.value)}
            placeholder="Primary and secondary diagnoses"
            rows={3}
            required
          />
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Plan
          </label>
          <Textarea
            value={data.treatmentPlan}
            onChange={(e) => handleChange("treatmentPlan", e.target.value)}
            placeholder="Overall treatment approach and recommendations"
            rows={4}
          />
        </div>

        {/* Medications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Prescribed Medications
          </label>
          
          {/* Add new medication form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Add New Medication</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input
                value={newMedication.name}
                onChange={(e) => handleMedicationChange("name", e.target.value)}
                placeholder="Medication name"
              />
              <Input
                value={newMedication.dosage}
                onChange={(e) => handleMedicationChange("dosage", e.target.value)}
                placeholder="Dosage (e.g., 10mg)"
              />
              <Input
                value={newMedication.frequency}
                onChange={(e) => handleMedicationChange("frequency", e.target.value)}
                placeholder="Frequency (e.g., twice daily)"
              />
              <Input
                value={newMedication.duration}
                onChange={(e) => handleMedicationChange("duration", e.target.value)}
                placeholder="Duration (e.g., 7 days)"
              />
            </div>
            <Button 
              type="button"
              variant="outline"
              onClick={addMedication}
              disabled={!newMedication.name.trim()}
            >
              Add Medication
            </Button>
          </div>

          {/* Current medications list */}
          <div className="space-y-3">
            {data.medications.map((medication, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <span className="text-xs text-gray-500">Medication</span>
                    <p className="font-medium">{medication.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Dosage</span>
                    <p>{medication.dosage || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Frequency</span>
                    <p>{medication.frequency || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Duration</span>
                    <p>{medication.duration || "Not specified"}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Remove
                </Button>
              </div>
            ))}
            {data.medications.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No medications prescribed yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
