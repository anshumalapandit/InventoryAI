/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface ChatRequest {
  message: string;
  context: 'general' | 'inventory' | 'profit';
}

export interface ChatResponse {
  message: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
