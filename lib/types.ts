export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  tags: string[]
  createdAt: string
  updatedAt: string
  status: 'published' | 'draft'
  readTime: number
}

export interface BlogListResponse {
  posts: BlogPost[]
  total: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}