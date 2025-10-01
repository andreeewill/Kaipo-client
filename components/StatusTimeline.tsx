"use client";
import React from "react";
import { Status } from "@/types/patient";

interface StatusTimelineProps {
  statuses: Status[];
  currentStatus: string;
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  statuses,
  currentStatus,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-300"></div>
      
      {/* Status Points */}
      <div className="flex justify-between relative">
        {statuses.map((status, statusIndex) => {
          const currentStatusIndex = statuses.findIndex(s => s.id === currentStatus);
          const isCompleted = currentStatusIndex >= statusIndex;
          const isCurrent = status.id === currentStatus;
          
          return (
            <div key={status.id} className="flex flex-col items-center relative">
              {/* Status Dot */}
              <div
                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center relative z-10 ${
                  isCompleted ? status.color : 'bg-gray-300'
                }`}
              >
                {isCompleted && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              
              {/* Status Label */}
              <div className="text-center mt-2 max-w-20">
                <p className={`text-xs font-medium ${
                  isCurrent ? status.textColor : isCompleted ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {status.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-500 mt-1">Current</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
