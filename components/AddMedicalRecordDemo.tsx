'use client'

import { useState } from 'react'
import { useCreateMedicalRecord, type CreateMedicalRecordData } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function AddMedicalRecordDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreateMedicalRecordData>({
    patientName: '',
    patientEmail: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  })

  const createRecordMutation = useCreateMedicalRecord()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createRecordMutation.mutateAsync(formData)
      // Reset form on success
      setFormData({
        patientName: '',
        patientEmail: '',
        diagnosis: '',
        treatment: '',
        notes: '',
      })
      setIsOpen(false)
      // Toast notification would show here automatically via React Query
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Failed to create record:', error)
    }
  }

  if (!isOpen) {
    return (
      <div className="bg-white shadow rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            React Query Demo
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This demonstrates React Query with optimistic updates, error handling, and automatic cache management.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            Add Medical Record (Demo)
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg mt-6">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Add Medical Record
          </h3>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={createRecordMutation.isPending}
          >
            Cancel
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <Input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                required
                disabled={createRecordMutation.isPending}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Email
              </label>
              <Input
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
                required
                disabled={createRecordMutation.isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <Input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              required
              disabled={createRecordMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment
            </label>
            <Input
              type="text"
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              required
              disabled={createRecordMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={createRecordMutation.isPending}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              type="submit" 
              disabled={createRecordMutation.isPending}
              className="flex items-center"
            >
              {createRecordMutation.isPending && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {createRecordMutation.isPending ? 'Creating...' : 'Create Record'}
            </Button>
            
            {createRecordMutation.isError && (
              <div className="text-sm text-red-600">
                Failed to create record. Please try again.
              </div>
            )}
            
            {createRecordMutation.isSuccess && (
              <div className="text-sm text-green-600">
                Record created successfully!
              </div>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">React Query Features Demonstrated:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Optimistic updates (UI updates immediately)</li>
            <li>• Automatic error rollback on failure</li>
            <li>• Loading states and error handling</li>
            <li>• Automatic cache invalidation</li>
            <li>• TypeScript integration</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
