import type { ExtensionCard } from '../types/dashboard'

export const fallbackExtensions: ExtensionCard[] = [
  {
    id: 'appwrite-sync',
    name: 'Appwrite Sync',
    vendor: 'Appwrite',
    status: 'enabled',
    description:
      'Synchronise collections, teams, and permissions across all Phinix screens.',
    metricLabel: 'Synced Collections',
    metricValue: '24',
    metricHint: '2 updates in the last 24h',
    ctaLabel: 'Manage Sync Rules',
  },
  {
    id: 'livekit-realtime',
    name: 'LiveKit Channels',
    vendor: 'LiveKit',
    status: 'maintenance',
    description: 'Scale real-time calls powering live screen takeovers and broadcasts.',
    metricLabel: 'Active Rooms',
    metricValue: '8',
    metricHint: 'Capacity upgrade scheduled',
    ctaLabel: 'View Channel Health',
  },
  {
    id: 'appwrite-hooks',
    name: 'Appwrite Webhooks',
    vendor: 'Appwrite',
    status: 'disabled',
    description: 'Route Appwrite events to automate publishing workflows and alerts.',
    metricLabel: 'Recent Deliveries',
    metricValue: '0',
    metricHint: 'No activity in the last week',
    ctaLabel: 'Configure Events',
  },
]
