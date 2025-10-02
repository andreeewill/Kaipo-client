"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatientPersonalDataStep } from "@/components/medical-record-steps/PatientPersonalDataStep";
import { PatientBaseMedicalDataStep } from "@/components/medical-record-steps/PatientBaseMedicalDataStep";
import { AnamnesisStep } from "@/components/medical-record-steps/AnamnesisStep";
import { EmptyStep } from "@/components/medical-record-steps/EmptyStep";

export interface StepData {
  personalData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
  };
  baseMedicalData: {
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
    previousSurgeries: string[];
    familyHistory: string;
    smokingStatus: string;
    alcoholConsumption: string;
  };
  anamnesis: {
    chiefComplaint: string;
    historyOfPresentIllness: string;
    reviewOfSystems: string;
    physicalExamination: string;
    diagnosis: string;
    treatmentPlan: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
  };
  step4: Record<string, unknown>;
  step5: Record<string, unknown>;
}

const initialStepData: StepData = {
  personalData: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  },
  baseMedicalData: {
    bloodType: "",
    allergies: [],
    chronicConditions: [],
    previousSurgeries: [],
    familyHistory: "",
    smokingStatus: "",
    alcoholConsumption: "",
  },
  anamnesis: {
    chiefComplaint: "",
    historyOfPresentIllness: "",
    reviewOfSystems: "",
    physicalExamination: "",
    diagnosis: "",
    treatmentPlan: "",
    medications: [],
  },
  step4: {},
  step5: {},
};

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Patient's personal and contact details",
  },
  {
    id: 2,
    title: "Base Medical Data",
    description: "Medical information that doesn't change often",
  },
  {
    id: 3,
    title: "Anamnesis & Diagnosis",
    description: "Current visit medical information",
  },
  {
    id: 4,
    title: "Additional Data",
    description: "Additional medical information (Coming Soon)",
  },
  {
    id: 5,
    title: "Final Review",
    description: "Review and submit medical record (Coming Soon)",
  },
];

export function AddMedicalRecordStepper() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>(initialStepData);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const updateStepData = useCallback((stepKey: keyof StepData, data: unknown) => {
    setStepData(prev => ({
      ...prev,
      [stepKey]: data,
    }));
  }, []);

  const handleStepChange = (newStep: number) => {
    if (newStep >= 1 && newStep <= steps.length) {
      setCurrentStep(newStep);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setStepData(initialStepData);
    router.push("/medical-record");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientPersonalDataStep
            data={stepData.personalData}
            onUpdate={(data) => updateStepData("personalData", data)}
          />
        );
      case 2:
        return (
          <PatientBaseMedicalDataStep
            data={stepData.baseMedicalData}
            onUpdate={(data) => updateStepData("baseMedicalData", data)}
          />
        );
      case 3:
        return (
          <AnamnesisStep
            data={stepData.anamnesis}
            onUpdate={(data) => updateStepData("anamnesis", data)}
          />
        );
      case 4:
        return (
          <EmptyStep
            title="Additional Medical Data"
            description="This step will contain additional medical information forms."
            data={stepData.step4}
            onUpdate={(data) => updateStepData("step4", data)}
          />
        );
      case 5:
        return (
          <EmptyStep
            title="Final Review & Submission"
            description="This step will allow you to review all entered data and submit the medical record."
            data={stepData.step5}
            onUpdate={(data) => updateStepData("step5", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Medical Record</h1>
          <p className="text-gray-600 mt-1">Fill out the patient information step by step</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExit}
          className="text-red-600 hover:text-red-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit
        </Button>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center cursor-pointer ${
                  step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => handleStepChange(step.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    step.id === currentStep
                      ? "bg-blue-600 text-white border-blue-600"
                      : step.id < currentStep
                      ? "bg-blue-100 text-blue-600 border-blue-600"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${step.id <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-20 ml-4 ${step.id < currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>
        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700">
              Submit Medical Record
            </Button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Exit</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit? All entered data will be lost and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmExit}>
              Exit & Lose Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
