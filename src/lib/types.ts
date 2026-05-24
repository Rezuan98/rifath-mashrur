export type CaseStudy = {
  id: string
  title: string
  slug: string
  category: string
  clientName: string
  heroImage: string
  summary: string
  metrics: unknown
  content: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export type Testimonial = {
  id: string
  author: string
  role: string
  avatarUrl: string | null
  quote: string
  companyLog: string | null
  createdAt: Date
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  isRead: boolean
  createdAt: Date
}

export type WorkExperience = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  order: number
  createdAt: Date
}

export type Achievement = {
  id: string
  type: string
  title: string
  description: string | null
  imageUrl: string
  order: number
  createdAt: Date
}
