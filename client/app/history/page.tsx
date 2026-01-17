'use client'

import { useState, useEffect } from 'react'
import { historyAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Image, Video, Music, Trash2, Download } from 'lucide-react'

export default function HistoryPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    loadHistory()
  }, [filter])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await historyAPI.getAll({ 
        type: filter || undefined,
        limit: 100 
      })
      setMedia(data.media)
    } catch (error: any) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await historyAPI.delete(id)
      toast.success('Deleted successfully')
      loadHistory()
    } catch (error: any) {
      toast.error('Failed to delete')
    }
  }

  const handleDownload = (fileUrl: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`
    window.open(url, '_blank')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'audio':
        return <Music className="w-5 h-5" />
      default:
        return <Video className="w-5 h-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">History</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="combined">Combined</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No media found. Start generating to see your history!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {item.type === 'image' && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.fileUrl}`}
                  alt={item.prompt}
                  className="w-full h-48 object-cover"
                />
              )}
              {item.type === 'video' && (
                <video
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.fileUrl}`}
                  className="w-full h-48 object-cover"
                  controls
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getIcon(item.type)}
                    <span className="text-sm font-semibold capitalize">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {item.prompt}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(item.fileUrl)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



