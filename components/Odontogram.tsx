"use client";

import React, { useState } from "react";

// FDI Tooth numbering system
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]; // Quadrant 1
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]; // Quadrant 2
const LOWER_LEFT = [38, 37, 36, 35, 34, 33, 32, 31]; // Quadrant 3
const LOWER_RIGHT = [41, 42, 43, 44, 45, 46, 47, 48]; // Quadrant 4

const ALL_TEETH = [
  ...UPPER_RIGHT,
  ...UPPER_LEFT,
  ...LOWER_LEFT,
  ...LOWER_RIGHT,
];

type ToothStatus =
  | "healthy"
  | "caries"
  | "filled"
  | "crown"
  | "extracted"
  | "root_canal";

interface ToothData {
  number: number;
  status: ToothStatus;
  surfaces: string[];
}

export default function Odontogram() {
  const [teethData, setTeethData] = useState<ToothData[]>(
    ALL_TEETH.map((num) => ({
      number: num,
      status: "healthy" as ToothStatus,
      surfaces: [],
    }))
  );

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const updateToothStatus = (toothNumber: number, status: ToothStatus) => {
    setTeethData((prev) =>
      prev.map((tooth) =>
        tooth.number === toothNumber ? { ...tooth, status } : tooth
      )
    );
  };

  const getToothData = (toothNumber: number) => {
    return teethData.find((tooth) => tooth.number === toothNumber);
  };

  const getToothType = (toothNumber: number) => {
    const lastDigit = toothNumber % 10;
    if (lastDigit === 1 || lastDigit === 2) return "incisor";
    if (lastDigit === 3) return "canine";
    if (lastDigit === 4 || lastDigit === 5) return "premolar";
    return "molar";
  };

  const getToothColor = (status: ToothStatus) => {
    switch (status) {
      case "healthy":
        return "bg-gray-50 border-gray-300 text-gray-700";
      case "caries":
        return "bg-red-100 border-red-400 text-red-700";
      case "filled":
        return "bg-blue-100 border-blue-400 text-blue-700";
      case "crown":
        return "bg-purple-100 border-purple-400 text-purple-700";
      case "extracted":
        return "bg-gray-300 border-gray-500 text-gray-500 line-through";
      case "root_canal":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      default:
        return "bg-gray-50 border-gray-300 text-gray-700";
    }
  };

  const ToothComponent = ({
    toothNumber,
    isUpper,
  }: {
    toothNumber: number;
    isUpper: boolean;
  }) => {
    const toothData = getToothData(toothNumber);
    const toothType = getToothType(toothNumber);
    const isSelected = selectedTooth === toothNumber;

    return (
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          isSelected ? "scale-110 z-10" : ""
        }`}
        onClick={() => setSelectedTooth(toothNumber)}
      >
        <div
          className={`w-8 h-10 flex items-center justify-center text-[10px] font-medium select-none transition-all duration-200 border-2 ${getToothColor(
            toothData?.status || "healthy"
          )} ${
            isSelected
              ? "ring-2 ring-blue-400 ring-offset-1"
              : "hover:ring-1 hover:ring-blue-300"
          }`}
          style={{
            borderRadius:
              toothType === "incisor"
                ? isUpper
                  ? "30% 30% 20% 20%"
                  : "20% 20% 30% 30%"
                : toothType === "canine"
                ? isUpper
                  ? "40% 40% 30% 30%"
                  : "30% 30% 40% 40%"
                : toothType === "premolar"
                ? isUpper
                  ? "25% 25% 35% 35%"
                  : "35% 35% 25% 25%"
                : isUpper
                ? "20% 20% 40% 40%"
                : "40% 40% 20% 20%",
            width:
              toothType === "incisor"
                ? "24px"
                : toothType === "canine"
                ? "28px"
                : toothType === "premolar"
                ? "32px"
                : "36px",
            height: toothType === "molar" ? "44px" : "40px",
          }}
        >
          {toothNumber}
        </div>

        {/* Tooth status indicator */}
        {toothData?.status === "extracted" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
            <div className="w-6 h-0.5 bg-red-500 -rotate-45 absolute"></div>
          </div>
        )}

        {toothData?.status === "root_canal" && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-0.5 h-3 bg-yellow-600"></div>
          </div>
        )}
      </div>
    );
  };

  const StatusButton = ({
    status,
    label,
    color,
  }: {
    status: ToothStatus;
    label: string;
    color: string;
  }) => (
    <button
      onClick={() => selectedTooth && updateToothStatus(selectedTooth, status)}
      disabled={!selectedTooth}
      className={`px-3 py-1 text-xs rounded-md transition-colors ${color} ${
        !selectedTooth ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Odontogram (FDI Numbering)
      </h2>

      <div className="flex flex-col items-center space-y-12 mb-8">
        {/* Upper Jaw - Maxillary */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Maxillary (Upper)
          </h3>
          <div className="flex items-end justify-center space-x-1">
            {/* Upper Right (18-11) - Patient's right, our left */}
            <div className="flex items-end space-x-1">
              {UPPER_RIGHT.map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  toothNumber={toothNumber}
                  isUpper={true}
                />
              ))}
            </div>

            {/* Midline */}
            <div className="w-0.5 h-12 bg-red-400 mx-2" title="Midline"></div>

            {/* Upper Left (21-28) - Patient's left, our right */}
            <div className="flex items-end space-x-1">
              {UPPER_LEFT.map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  toothNumber={toothNumber}
                  isUpper={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Jaw Separation */}
        <div className="w-full max-w-2xl h-8 flex items-center justify-center relative">
          <div className="w-full h-0.5 bg-gray-400"></div>
          <div className="absolute bg-white px-2 text-xs text-gray-500">
            Bite Line
          </div>
        </div>

        {/* Lower Jaw - Mandibular */}
        <div className="flex flex-col items-center">
          <div className="flex items-start justify-center space-x-1 mb-6">
            {/* Lower Left (38-31) - Patient's left, our right */}
            <div className="flex items-start space-x-1">
              {LOWER_LEFT.map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  toothNumber={toothNumber}
                  isUpper={false}
                />
              ))}
            </div>

            {/* Midline */}
            <div className="w-0.5 h-12 bg-red-400 mx-2" title="Midline"></div>

            {/* Lower Right (41-48) - Patient's right, our left */}
            <div className="flex items-start space-x-1">
              {LOWER_RIGHT.map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  toothNumber={toothNumber}
                  isUpper={false}
                />
              ))}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            Mandibular (Lower)
          </h3>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedTooth
                ? `Tooth ${selectedTooth} Selected`
                : "Click a tooth to modify"}
            </h3>
            {selectedTooth && (
              <p className="text-sm text-gray-600">
                Type: {getToothType(selectedTooth)} | Current status:{" "}
                {getToothData(selectedTooth)?.status || "healthy"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <StatusButton
              status="healthy"
              label="Healthy"
              color="bg-gray-100 text-gray-700 border border-gray-300"
            />
            <StatusButton
              status="caries"
              label="Caries"
              color="bg-red-100 text-red-700 border border-red-300"
            />
            <StatusButton
              status="filled"
              label="Filled"
              color="bg-blue-100 text-blue-700 border border-blue-300"
            />
            <StatusButton
              status="crown"
              label="Crown"
              color="bg-purple-100 text-purple-700 border border-purple-300"
            />
            <StatusButton
              status="root_canal"
              label="Root Canal"
              color="bg-yellow-100 text-yellow-700 border border-yellow-300"
            />
            <StatusButton
              status="extracted"
              label="Extracted"
              color="bg-gray-200 text-gray-600 border border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          FDI Numbering System
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <strong>Quadrant 1 (Upper Right):</strong>
            <br />
            11-18 (Central Incisor to Wisdom)
          </div>
          <div>
            <strong>Quadrant 2 (Upper Left):</strong>
            <br />
            21-28 (Central Incisor to Wisdom)
          </div>
          <div>
            <strong>Quadrant 3 (Lower Left):</strong>
            <br />
            31-38 (Central Incisor to Wisdom)
          </div>
          <div>
            <strong>Quadrant 4 (Lower Right):</strong>
            <br />
            41-48 (Central Incisor to Wisdom)
          </div>
        </div>
      </div>
    </div>
  );
}
