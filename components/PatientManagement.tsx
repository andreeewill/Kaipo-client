"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PatientForm } from '@/components/PatientForm';
import { PatientList } from '@/components/PatientList';

export const PatientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage patient records and information</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Patient List
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'add'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === 'list' && (
          <div>
            <div className="max-w-7xl mx-auto px-6 mb-6">
              <Button
                onClick={() => setActiveTab('add')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Patient
              </Button>
            </div>
            <PatientList />
          </div>
        )}
        
        {activeTab === 'add' && (
          <PatientForm 
            onSuccess={() => {
              // Switch back to list view after successful creation
              setActiveTab('list');
            }}
          />
        )}
      </div>
    </div>
  );
};
