'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { imageAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Loader2, Download, Sparkles } from 'lucide-react'

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [resolution, setResolution] = useState('1024x1024')
  const [model, setModel] = useState('stable-diffusion')
  const [enhance, setEnhance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await imageAPI.generate({
        prompt,
        style,
        resolution,
        model,
        enhance
      })

      setResult(response.media)
      toast.success('Image generated successfully!')
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
      <h1 className="text-3xl font-bold mb-8">Generate Image</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over the ocean..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="realistic">Realistic</option>
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="artistic">Artistic</option>
                <option value="futuristic">Futuristic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1024x1024">1024x1024</option>
                <option value="512x512">512x512</option>
                <option value="256x256">256x256</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="stable-diffusion">Stable Diffusion</option>
                <option value="dalle">DALL·E 3</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enhance"
                checked={enhance}
                onChange={(e) => setEnhance(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="enhance" className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Enhance prompt with AI
              </label>
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
                'Generate Image'
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
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${result.fileUrl}`}
                alt={result.prompt}
                className="w-full rounded-lg mb-4"
              />
              {result.enhancedPrompt && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Enhanced Prompt:</strong> {result.enhancedPrompt}
                  </p>
                </div>
              )}
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
              Your generated image will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


