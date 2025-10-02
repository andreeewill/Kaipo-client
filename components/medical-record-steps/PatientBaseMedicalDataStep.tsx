"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface BaseMedicalData {
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  previousSurgeries: string[];
  familyHistory: string;
  smokingStatus: string;
  alcoholConsumption: string;
}

interface PatientBaseMedicalDataStepProps {
  data: BaseMedicalData;
  onUpdate: (data: BaseMedicalData) => void;
}

export function PatientBaseMedicalDataStep({ data, onUpdate }: PatientBaseMedicalDataStepProps) {
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newSurgery, setNewSurgery] = useState("");

  const handleChange = (field: keyof BaseMedicalData, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const addToArray = (field: 'allergies' | 'chronicConditions' | 'previousSurgeries', value: string) => {
    if (value.trim()) {
      onUpdate({
        ...data,
        [field]: [...data[field], value.trim()],
      });
      
      // Clear the input
      if (field === 'allergies') setNewAllergy("");
      if (field === 'chronicConditions') setNewCondition("");
      if (field === 'previousSurgeries') setNewSurgery("");
    }
  };

  const removeFromArray = (field: 'allergies' | 'chronicConditions' | 'previousSurgeries', index: number) => {
    onUpdate({
      ...data,
      [field]: data[field].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Base Medical Data</h2>
        <p className="text-gray-600 mb-6">Enter medical information that typically doesn&apos;t change frequently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Type *
          </label>
          <Select value={data.bloodType} onValueChange={(value) => handleChange("bloodType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Smoking Status
          </label>
          <Select value={data.smokingStatus} onValueChange={(value) => handleChange("smokingStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select smoking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never smoked</SelectItem>
              <SelectItem value="former">Former smoker</SelectItem>
              <SelectItem value="current">Current smoker</SelectItem>
              <SelectItem value="occasional">Occasional smoker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alcohol Consumption
          </label>
          <Select value={data.alcoholConsumption} onValueChange={(value) => handleChange("alcoholConsumption", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select alcohol consumption" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergies
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Enter allergy"
            onKeyPress={(e) => e.key === 'Enter' && addToArray('allergies', newAllergy)}
          />
          <Button 
            type="button"
            variant="outline"
            onClick={() => addToArray('allergies', newAllergy)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.allergies.map((allergy, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeFromArray('allergies', index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
          {data.allergies.length === 0 && (
            <span className="text-gray-500 text-sm">No allergies added</span>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chronic Conditions
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Enter chronic condition"
            onKeyPress={(e) => e.key === 'Enter' && addToArray('chronicConditions', newCondition)}
          />
          <Button 
            type="button"
            variant="outline"
            onClick={() => addToArray('chronicConditions', newCondition)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.chronicConditions.map((condition, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
            >
              {condition}
              <button
                type="button"
                onClick={() => removeFromArray('chronicConditions', index)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          ))}
          {data.chronicConditions.length === 0 && (
            <span className="text-gray-500 text-sm">No chronic conditions added</span>
          )}
        </div>
      </div>

      {/* Previous Surgeries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Previous Surgeries
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newSurgery}
            onChange={(e) => setNewSurgery(e.target.value)}
            placeholder="Enter previous surgery"
            onKeyPress={(e) => e.key === 'Enter' && addToArray('previousSurgeries', newSurgery)}
          />
          <Button 
            type="button"
            variant="outline"
            onClick={() => addToArray('previousSurgeries', newSurgery)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.previousSurgeries.map((surgery, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {surgery}
              <button
                type="button"
                onClick={() => removeFromArray('previousSurgeries', index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
          {data.previousSurgeries.length === 0 && (
            <span className="text-gray-500 text-sm">No previous surgeries added</span>
          )}
        </div>
      </div>

      {/* Family History */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Family Medical History
        </label>
        <Textarea
          value={data.familyHistory}
          onChange={(e) => handleChange("familyHistory", e.target.value)}
          placeholder="Enter family medical history (e.g., diabetes in father, heart disease in mother)"
          rows={4}
        />
      </div>
    </div>
  );
}
