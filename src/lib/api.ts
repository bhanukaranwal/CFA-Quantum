import { getSession } from 'next-auth/react'

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// API client class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (session?.user) {
      // Add authorization header if needed
      // headers.Authorization = `Bearer ${session.accessToken}`
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`
    const headers = await this.getHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// Create API client instance
export const api = new ApiClient()

// API service functions
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    name: string
    email: string
    password: string
    cfaLevel: string
    experienceLevel: string
    studyHoursPerWeek: number
  }) => api.post('/auth/register', userData),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  deleteAccount: () => api.delete('/user/profile'),
}

export const questionsApi = {
  getQuestions: (params?: any) => api.get(`/questions?${new URLSearchParams(params)}`),
  createQuestion: (data: any) => api.post('/questions', data),
  updateQuestion: (id: string, data: any) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),
  getQuestion: (id: string) => api.get(`/questions/${id}`),
}

export const examSessionsApi = {
  getSessions: () => api.get('/exam-sessions'),
  createSession: (data: any) => api.post('/exam-sessions', data),
  getSession: (id: string) => api.get(`/exam-sessions/${id}`),
  startSession: (id: string) => api.post(`/exam-sessions/${id}/start`),
  submitAnswer: (sessionId: string, data: any) =>
    api.post(`/exam-sessions/${sessionId}/answers`, data),
  completeSession: (id: string) => api.post(`/exam-sessions/${id}/complete`),
}

export const battlesApi = {
  getBattles: () => api.get('/battles'),
  createBattle: (data: any) => api.post('/battles', data),
  joinBattle: (id: string) => api.post(`/battles/${id}/join`),
  leaveBattle: (id: string) => api.post(`/battles/${id}/leave`),
  getBattle: (id: string) => api.get(`/battles/${id}`),
}

export const forumApi = {
  getCategories: () => api.get('/forum/categories'),
  getPosts: (categoryId?: string) => 
    api.get(`/forum/posts${categoryId ? `?categoryId=${categoryId}` : ''}`),
  createPost: (data: any) => api.post('/forum/posts', data),
  getPost: (id: string) => api.get(`/forum/posts/${id}`),
  updatePost: (id: string, data: any) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/forum/posts/${id}`),
  createComment: (postId: string, data: any) =>
    api.post(`/forum/posts/${postId}/comments`, data),
}

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getProgress: (timeframe?: string) =>
    api.get(`/analytics/progress${timeframe ? `?timeframe=${timeframe}` : ''}`),
  getWeaknesses: () => api.get('/analytics/weaknesses'),
  getStudyTime: () => api.get('/analytics/study-time'),
}

export const achievementsApi = {
  getAchievements: (includeProgress?: boolean) =>
    api.get(`/achievements${includeProgress ? '?includeProgress=true' : ''}`),
  unlockAchievement: (id: string) => api.post(`/achievements/${id}/unlock`),
}

export const leaderboardApi = {
  getLeaderboard: (type?: string, cfaLevel?: string) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (cfaLevel) params.append('cfaLevel', cfaLevel)
    return api.get(`/leaderboard?${params}`)
  },
}

export const healthApi = {
  check: () => api.get('/health'),
  test: (testType?: string) =>
    api.get(`/test${testType ? `?test=${testType}` : ''}`),
}

// Error handling utilities
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError
}

// Response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  errors?: any[]
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request/Response interceptors
export function setupApiInterceptors() {
  // This could be extended to add global error handling,
  // request/response logging, etc.
}