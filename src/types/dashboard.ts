export type ExtensionStatus = 'enabled' | 'disabled' | 'maintenance'

export interface ExtensionCard {
  id: string
  name: string
  vendor: 'Appwrite' | 'LiveKit'
  status: ExtensionStatus
  description: string
  metricLabel: string
  metricValue: string
  metricHint: string
  ctaLabel: string
}

export type UserRole = 'admin' | 'guest'

export interface CommentThread {
  author: string
  role: string
  body: string
  timestamp: string
}

export interface NewsArticle {
  id: string
  title: string
  tag: string
  summary: string
  updatedAt: string
  comments: CommentThread[]
}

export type QuickLinkTone =
  | 'primary'
  | 'outline'
  | 'appwrite'
  | 'livekit'
  | 'twitch'
  | 'whatsapp'
  | 'x'
  | 'discord'
  | 'youtube'

export interface QuickLink {
  id: string
  label: string
  href: string
  icon: string
  tone?: QuickLinkTone
  external?: boolean
}

export interface DisplayUtilizationPoint {
  id: string
  date: string
  location: string
  totalSlots: number
  bookedSlots: number
  freeSlots: number
  utilizationPercent: number
}

export interface DisplaySlot {
  id: string
  location: string
  city: string
  mediaType: 'Indoor' | 'Outdoor' | 'Hybrid'
  previewImage: string
  durationSeconds: number
  ratePerSlot: number
  availability: number
  tags: string[]
}
