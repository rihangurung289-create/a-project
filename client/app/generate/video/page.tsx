'use client'

import { useState } from 'react'
import { videoAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Loader2, Download, Upload } from 'lucide-react'

export default function GenerateVideoPage() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [duration, setDuration] = useState(5)
  const [model, setModel] = useState('runway')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim() && !image) {
      toast.error('Please enter a prompt or upload an image')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await videoAPI.generate({
        prompt: prompt || undefined,
        image: image || undefined,
        duration,
        model
      })

      setResult(response.media)
      toast.success('Video generated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Generation failed')
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
      <h1 className="text-3xl font-bold mb-8">Generate Video</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Prompt (optional if uploading image)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic scene of..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Or Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-700/50">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {image ? image.name : 'Click to upload image'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="runway">Runway Gen-2</option>
                <option value="pika">Pika</option>
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
                  Generating...
                </>
              ) : (
                'Generate Video'
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
              Your generated video will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



