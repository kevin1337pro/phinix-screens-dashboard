import type { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import { appwriteConfig, databases } from '../lib/appwrite'
import { fallbackNews } from '../data/fallbackNews'
import type { CommentThread, NewsArticle } from '../types/dashboard'

const normaliseComments = (comments: unknown): CommentThread[] => {
  if (!Array.isArray(comments)) {
    return []
  }

  return comments
    .map<CommentThread | null>((comment) => {
      if (typeof comment !== 'object' || comment === null) {
        return null
      }

      const data = comment as Record<string, unknown>
      if (!data.author || !data.body) {
        return null
      }

      return {
        author: String(data.author),
        role: String(data.role ?? ''),
        body: String(data.body),
        timestamp: String(data.timestamp ?? ''),
      }
    })
    .filter(Boolean) as CommentThread[]
}

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackNews)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canQuery = Boolean(appwriteConfig.databaseId && appwriteConfig.newsCollectionId)

    if (!canQuery) {
      setLoading(false)
      return
    }

    const fetchNews = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.newsCollectionId,
        )

        // Expect Appwrite documents with title, summary, tag, updatedAt, comments array
        const mapped = response.documents
          .map<NewsArticle | null>((doc: Models.Document) => {
            const data = doc as Models.Document & Record<string, unknown>

            if (!data.title || !data.summary) {
              return null
            }

            return {
              id: doc.$id,
              title: String(data.title),
              tag: String(data.tag ?? 'Update'),
              summary: String(data.summary),
              updatedAt: String(data.updatedAt ?? ''),
              comments: normaliseComments(data.comments),
            }
          })
          .filter(Boolean) as NewsArticle[]

        if (mapped.length) {
          setArticles(mapped)
        }
      } catch (error) {
        console.warn('Konnte News nicht aus Appwrite laden.', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return { articles, loading }
}
