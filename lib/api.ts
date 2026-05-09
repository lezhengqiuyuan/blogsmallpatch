import { BlogPost, ApiResponse, BlogListResponse } from './types'

const API_BASE = '/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    })
    const data = await res.json()
    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function login(password: string): Promise<ApiResponse<{ token: string }>> {
  return request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function initAdmin(password: string): Promise<ApiResponse> {
  return request('/auth/init', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function verifySession(): Promise<ApiResponse> {
  return request('/auth/verify')
}

export function saveToken(token: string) {
  localStorage.setItem('admin_token', token)
}

export function removeToken() {
  localStorage.removeItem('admin_token')
}

export const api = {
  getPosts: (page = 1, pageSize = 10) =>
    request<BlogListResponse>(`/posts?page=${page}&pageSize=${pageSize}`),

  getPost: (slug: string) =>
    request<BlogPost>(`/posts/${slug}`),

  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'readTime'>) =>
    request<BlogPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    }),

  updatePost: (slug: string, post: Partial<BlogPost>) =>
    request<BlogPost>(`/posts/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    }),

  deletePost: (slug: string) =>
    request<void>(`/posts/${slug}`, {
      method: 'DELETE',
    }),
}