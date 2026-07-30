/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ADMIN_CONFIG } from '../config';

/**
 * Executes an API call with automatic fallback and latency simulation
 */
export async function executeApiCall<T>(
  apiCallFn: () => Promise<T>,
  mockData: T,
  endpointName: string
): Promise<T> {
  // If forced to use mocks
  if (ADMIN_CONFIG.useMockOnly) {
    if (ADMIN_CONFIG.mockLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, ADMIN_CONFIG.mockLatencyMs));
    }
    console.log(`[Admin API] Mock data returned for: ${endpointName}`);
    return mockData;
  }

  try {
    // Attempt real backend call
    return await apiCallFn();
  } catch (error) {
    console.error(`[Admin API] Error in real API call for ${endpointName}:`, error);

    if (ADMIN_CONFIG.autoFallbackToMock) {
      console.warn(`[Admin API] Falling back to mock data for: ${endpointName}`);
      if (ADMIN_CONFIG.mockLatencyMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, ADMIN_CONFIG.mockLatencyMs));
      }
      return mockData;
    }

    throw error;
  }
}
