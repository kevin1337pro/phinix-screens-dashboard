import type { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import { appwriteConfig, databases } from '../lib/appwrite'
import { fallbackExtensions } from '../data/fallbackExtensions'
import type { ExtensionCard, ExtensionStatus } from '../types/dashboard'

const isExtensionStatus = (value: string): value is ExtensionStatus =>
  ['enabled', 'disabled', 'maintenance'].includes(value)

export const useExtensions = () => {
  const [extensions, setExtensions] = useState<ExtensionCard[]>(fallbackExtensions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canQuery = Boolean(appwriteConfig.databaseId && appwriteConfig.extensionsCollectionId)

    if (!canQuery) {
      setLoading(false)
      return
    }

    const fetchExtensions = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.extensionsCollectionId,
        )

        // Expect Appwrite documents with name, vendor, status, metric*, ctaLabel fields
        const mapped = response.documents
          .map<ExtensionCard | null>((doc: Models.Document) => {
            const data = doc as Models.Document & Record<string, unknown>

            if (!data.name || !data.vendor || !data.metricLabel || !data.metricValue) {
              return null
            }

            const statusRaw = String(data.status ?? '')
            const status: ExtensionStatus = isExtensionStatus(statusRaw)
              ? statusRaw
              : 'disabled'

            return {
              id: doc.$id,
              name: String(data.name),
              vendor: data.vendor === 'LiveKit' ? 'LiveKit' : 'Appwrite',
              status,
              description: String(data.description ?? ''),
              metricLabel: String(data.metricLabel),
              metricValue: String(data.metricValue),
              metricHint: String(data.metricHint ?? ''),
              ctaLabel: String(data.ctaLabel ?? 'Manage'),
            }
          })
          .filter(Boolean) as ExtensionCard[]

        if (mapped.length) {
          setExtensions(mapped)
        }
      } catch (error) {
        console.warn('Konnte Erweiterungen nicht aus Appwrite laden.', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExtensions()
  }, [])

  return { extensions, loading }
}
