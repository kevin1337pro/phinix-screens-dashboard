import type { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import { appwriteConfig, databases } from '../lib/appwrite'
import { fallbackUtilization } from '../data/fallbackUtilization'
import type { DisplayUtilizationPoint } from '../types/dashboard'

export const useDisplayUtilization = () => {
  const [points, setPoints] = useState<DisplayUtilizationPoint[]>(fallbackUtilization)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canQuery = Boolean(appwriteConfig.databaseId && appwriteConfig.utilizationCollectionId)

    if (!canQuery) {
      setLoading(false)
      return
    }

    const fetchUtilization = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.utilizationCollectionId,
        )

        const mapped = response.documents
          .map<DisplayUtilizationPoint | null>((doc: Models.Document) => {
            const data = doc as Models.Document & Record<string, unknown>

            if (!data.date || data.bookedSlots === undefined || data.totalSlots === undefined) {
              return null
            }

            const totalSlots = Number(data.totalSlots)
            const bookedSlots = Number(data.bookedSlots)
            const freeSlots = Number(data.freeSlots ?? Math.max(totalSlots - bookedSlots, 0))
            const utilizationPercent =
              Number(data.utilizationPercent ?? Math.round((bookedSlots / totalSlots) * 100))

            return {
              id: doc.$id,
              date: String(data.date),
              location: String(data.location ?? 'Unknown'),
              totalSlots,
              bookedSlots,
              freeSlots,
              utilizationPercent,
            }
          })
          .filter(Boolean) as DisplayUtilizationPoint[]

        if (mapped.length) {
          setPoints(mapped)
        }
      } catch (error) {
        console.warn('Konnte Display-Auslastung nicht aus Appwrite laden.', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUtilization()
  }, [])

  return { points, loading }
}
