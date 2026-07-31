export interface ApiResponse<T = void> {
  succeeded: boolean; 
  statusCode: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiValidationError {
  field: string;
  messages: string[];
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
