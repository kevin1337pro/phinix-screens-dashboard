import { useEffect, useState } from 'react'
import type { Models } from 'appwrite'
import { appwriteConfig, databases } from '../lib/appwrite'
import { fallbackDisplays } from '../data/fallbackDisplays'
import type { DisplaySlot } from '../types/dashboard'

export const useDisplays = () => {
  const [displays, setDisplays] = useState<DisplaySlot[]>(fallbackDisplays)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canQuery = Boolean(appwriteConfig.databaseId && appwriteConfig.displaysCollectionId)

    if (!canQuery) {
      setLoading(false)
      return
    }

    const fetchDisplays = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.displaysCollectionId,
        )

        const mapped = response.documents
          .map<DisplaySlot | null>((doc: Models.Document) => {
            const data = doc as Models.Document & Record<string, unknown>

            if (!data.location || !data.city) {
              return null
            }

            return {
              id: doc.$id,
              location: String(data.location),
              city: String(data.city ?? ''),
              mediaType: (data.mediaType as DisplaySlot['mediaType']) ?? 'Indoor',
              previewImage: String(data.previewImage ?? ''),
              durationSeconds: Number(data.durationSeconds ?? 15),
              ratePerSlot: Number(data.ratePerSlot ?? 89),
              availability: Number(data.availability ?? 0),
              tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
            }
          })
          .filter(Boolean) as DisplaySlot[]

        if (mapped.length) {
          setDisplays(mapped)
        }
      } catch (error) {
        console.warn('Konnte Display Daten nicht aus Appwrite laden.', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDisplays()
  }, [])

  return { displays, loading }
}
