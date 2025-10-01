"use client";
import React from "react";
import { Status } from "@/types/patient";

interface StatusIndicatorProps {
  status: Status;
  variant?: "dot" | "badge";
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  variant = "dot",
  className = "",
}) => {
  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} ${className}`}
      >
        <div className={`w-2 h-2 rounded-full ${status.color} mr-2`}></div>
        {status.label}
      </span>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-2 h-2 rounded-full ${status.color} mr-2`}></div>
      <span className="text-sm text-gray-700">{status.label}</span>
    </div>
  );
};
