import apiClient from './client'

export interface LoginData {
  identify: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      username: string
    }
    token: string
  }
}

// Login API
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data)
  return response.data
}

// Register API
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

// Logout
export const logout = () => {
  localStorage.removeItem('token')
}