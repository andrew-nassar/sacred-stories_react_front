/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Global Admin Module Configuration
 */
export const ADMIN_CONFIG = {
  // If true, forces the API layer to use local mock data.
  // Set to false to connect to real backend services.
  useMockOnly: (import.meta as any).env?.VITE_USE_MOCK_DATA === 'true',

  // Fallback automatically to mock data if the network request fails
  autoFallbackToMock: true,

  // Mock latency to simulate real network responses in dev
  mockLatencyMs: 300,
};
