import type { ApiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  career?: string;
  semester?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthApi {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.client.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async googleAuth(idToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get<User>(API_ENDPOINTS.AUTH.ME);
  }
}
