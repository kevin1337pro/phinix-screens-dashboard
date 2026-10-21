import type { DisplayUtilizationPoint } from '../types/dashboard'

export const fallbackUtilization: DisplayUtilizationPoint[] = [
  {
    id: '2025-03-01-central',
    date: '2025-03-01',
    location: 'Central Hub',
    totalSlots: 120,
    bookedSlots: 96,
    freeSlots: 24,
    utilizationPercent: 80,
  },
  {
    id: '2025-03-08-central',
    date: '2025-03-08',
    location: 'Central Hub',
    totalSlots: 120,
    bookedSlots: 102,
    freeSlots: 18,
    utilizationPercent: 85,
  },
  {
    id: '2025-03-15-central',
    date: '2025-03-15',
    location: 'Central Hub',
    totalSlots: 120,
    bookedSlots: 88,
    freeSlots: 32,
    utilizationPercent: 73,
  },
  {
    id: '2025-03-22-central',
    date: '2025-03-22',
    location: 'Central Hub',
    totalSlots: 120,
    bookedSlots: 110,
    freeSlots: 10,
    utilizationPercent: 92,
  },
  {
    id: '2025-03-29-central',
    date: '2025-03-29',
    location: 'Central Hub',
    totalSlots: 120,
    bookedSlots: 114,
    freeSlots: 6,
    utilizationPercent: 95,
  },
]
