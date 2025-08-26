export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}
