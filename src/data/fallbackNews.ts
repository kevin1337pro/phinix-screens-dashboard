import type { NewsArticle } from '../types/dashboard'

export const fallbackNews: NewsArticle[] = [
  {
    id: 'release-15',
    title: 'Phinix Screens 1.5 veröffentlicht',
    tag: 'Update',
    summary:
      'Workflows wurden beschleunigt und das Appwrite Sync Interface erhält ein neues Layout.',
    updatedAt: 'Heute, 09:24',
    comments: [
      {
        author: 'Kevin Admin',
        role: 'CEO / COF',
        body: 'Ich bin stolz auf meine arbeit!',
        timestamp: 'vor 5 Min.',
      },
      {
        author: 'Lena Hofmann',
        role: 'QA',
        body: 'Smoke Tests für LiveKit Channels laufen, melde mich mit Report.',
        timestamp: 'vor 2 Min.',
      },
    ],
  },
  {
    id: 'livekit-scale',
    title: 'LiveKit Channels skalieren smarter',
    tag: 'Infrastructure',
    summary:
      'Neue Kapazitätsprofile erlauben automatische Lastspitzen für Live-Takeovers.',
    updatedAt: 'Gestern, 18:12',
    comments: [
      {
        author: 'Ilayda Kandemir',
        role: 'SRE',
        body: 'Monitoring Dashboards wurden aktualisiert, Feedback willkommen.',
        timestamp: 'vor 1 Std.',
      },
      {
        author: 'Sarah Yeong',
        role: 'Comms',
        body: 'Changelog ist vorbereitet, geht morgen live.',
        timestamp: 'vor 25 Min.',
      },
    ],
  },
  {
    id: 'appwrite-hooks',
    title: 'Appwrite Webhooks wieder aktiv',
    tag: 'Incident',
    summary: 'Webhook Queue wurde geleert, Automationen laufen stabil seit 4 Stunden.',
    updatedAt: 'Heute, 07:05',
    comments: [
      {
        author: 'Iris Patel',
        role: 'Support',
        body: 'Kund*innen wurden informiert, keine offenen Tickets mehr.',
        timestamp: 'vor 10 Min.',
      },
    ],
  },
]
