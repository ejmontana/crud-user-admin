import { ApiResponse } from '../types';

const SIMULATED_DELAY = 500;

export async function mockApiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

  // Simulate API response
  return {
    data: data as T,
    status: 200,
    message: 'Success',
    timestamp: new Date().toISOString()
  };
}

export function handleApiError(error: any): ApiResponse<null> {
  return {
    data: null,
    status: error.status || 500,
    message: error.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };
}