"use client";
import React from "react";

interface EmptyStepProps {
  title: string;
  description: string;
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function EmptyStep({ title, description }: EmptyStepProps) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="mb-6">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 max-w-md mx-auto">{description}</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <p className="text-blue-800 text-sm">
          <strong>Coming Soon:</strong> This step is currently under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
