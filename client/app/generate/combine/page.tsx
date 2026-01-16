'use client'

import { useState, useEffect } from 'react'
import { mediaAPI, historyAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Loader2, Download } from 'lucide-react'

export default function CombineMediaPage() {
  const [videoId, setVideoId] = useState('')
  const [audioId, setAudioId] = useState('')
  const [musicId, setMusicId] = useState('')
  const [videos, setVideos] = useState<any[]>([])
  const [audios, setAudios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const [videoData, audioData] = await Promise.all([
        historyAPI.getAll({ type: 'video', limit: 50 }),
        historyAPI.getAll({ type: 'audio', limit: 50 })
      ])
      setVideos(videoData.media)
      setAudios(audioData.media)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleCombine = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoId) {
      toast.error('Please select a video')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await mediaAPI.combine({
        videoId,
        audioId: audioId || undefined,
        musicId: musicId || undefined
      })

      setResult(response.media)
      toast.success('Media combined successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Combination failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result?.fileUrl) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}${result.fileUrl}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Combine Media</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleCombine} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Video *
              </label>
              <select
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a video...</option>
                {videos.map((video) => (
                  <option key={video._id} value={video._id}>
                    {video.prompt} - {new Date(video.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Voice Audio (optional)
              </label>
              <select
                value={audioId}
                onChange={(e) => setAudioId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {audios.filter(a => a.voice).map((audio) => (
                  <option key={audio._id} value={audio._id}>
                    {audio.prompt} - {new Date(audio.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Background Music (optional)
              </label>
              <select
                value={musicId}
                onChange={(e) => setMusicId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {audios.filter(a => !a.voice).map((audio) => (
                  <option key={audio._id} value={audio._id}>
                    {audio.prompt} - {new Date(audio.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Combining...
                </>
              ) : (
                'Combine Media'
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          )}
          {result && !loading && (
            <div>
              <video
                src={`${process.env.NEXT_PUBLIC_API_URL}${result.fileUrl}`}
                controls
                className="w-full rounded-lg mb-4"
              />
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
          )}
          {!result && !loading && (
            <div className="text-center text-gray-500 py-16">
              Your combined media will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


