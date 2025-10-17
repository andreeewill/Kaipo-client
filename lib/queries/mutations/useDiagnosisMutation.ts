import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { DiagnosisRequest, DiagnosisResponse } from '@/types/api'

export const useDiagnosisMutation = () => {
  return useMutation<DiagnosisResponse, Error, DiagnosisRequest>({
    mutationFn: async (data: DiagnosisRequest) => {
      const response = await apiClient.post<DiagnosisResponse>(
        '/emr/recommendation/diagnosis',
        data
      )
      return response.data
    },
    onError: (error) => {
      console.error('Diagnosis mutation error:', error)
    }
  })
}
