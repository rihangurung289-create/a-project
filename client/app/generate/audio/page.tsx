'use client'

import { useState } from 'react'
import { audioAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Loader2, Download, Volume2, Music, Zap } from 'lucide-react'

type AudioType = 'tts' | 'music' | 'sound-effect'

export default function GenerateAudioPage() {
  const [audioType, setAudioType] = useState<AudioType>('tts')
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('default')
  const [provider, setProvider] = useState('elevenlabs')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [musicDuration, setMusicDuration] = useState(30)
  const [soundEffectPrompt, setSoundEffectPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerateTTS = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      toast.error('Please enter text')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await audioAPI.generateTTS({
        text,
        voice,
        provider
      })

      setResult(response.media)
      toast.success('Voice generated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!musicPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await audioAPI.generateMusic({
        prompt: musicPrompt,
        duration: musicDuration
      })

      setResult(response.media)
      toast.success('Music generated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSoundEffect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!soundEffectPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await audioAPI.generateSoundEffect({
        prompt: soundEffectPrompt
      })

      setResult(response.media)
      toast.success('Sound effect generated successfully!')
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
      <h1 className="text-3xl font-bold mb-8">Generate Audio</h1>

      {/* Type Selector */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setAudioType('tts')}
          className={`px-6 py-3 rounded-lg transition-colors ${
            audioType === 'tts' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <Volume2 className="w-5 h-5 inline mr-2" />
          Text-to-Speech
        </button>
        <button
          onClick={() => setAudioType('music')}
          className={`px-6 py-3 rounded-lg transition-colors ${
            audioType === 'music' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <Music className="w-5 h-5 inline mr-2" />
          Background Music
        </button>
        <button
          onClick={() => setAudioType('sound-effect')}
          className={`px-6 py-3 rounded-lg transition-colors ${
            audioType === 'sound-effect' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <Zap className="w-5 h-5 inline mr-2" />
          Sound Effect
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {audioType === 'tts' && (
            <form onSubmit={handleGenerateTTS} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to convert to speech..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Voice
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="default">Default (Female)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="british">British</option>
                  <option value="australian">Australian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI TTS</option>
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
                  'Generate Voice'
                )}
              </button>
            </form>
          )}

          {audioType === 'music' && (
            <form onSubmit={handleGenerateMusic} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Music Prompt
                </label>
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="Upbeat electronic music with synthesizers..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={musicDuration}
                  onChange={(e) => setMusicDuration(parseInt(e.target.value))}
                  min="10"
                  max="60"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                  'Generate Music'
                )}
              </button>
            </form>
          )}

          {audioType === 'sound-effect' && (
            <form onSubmit={handleGenerateSoundEffect} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sound Effect Prompt
                </label>
                <textarea
                  value={soundEffectPrompt}
                  onChange={(e) => setSoundEffectPrompt(e.target.value)}
                  placeholder="Thunder crash, rain, door slam..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={4}
                  required
                />
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
                  'Generate Sound Effect'
                )}
              </button>
            </form>
          )}
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
              <audio
                src={`${process.env.NEXT_PUBLIC_API_URL}${result.fileUrl}`}
                controls
                className="w-full mb-4"
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
              Your generated audio will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



