'use client'

import Link from 'next/link'
import { Image, Video, Music, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Media Generator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Create stunning images, videos, and audio with the power of AI
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Link href="/generate/image">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Images</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create realistic images from text prompts using Stable Diffusion or DALL·E
            </p>
          </div>
        </Link>

        <Link href="/generate/video">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Videos</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Transform text or images into AI-generated videos with Runway or Pika
            </p>
          </div>
        </Link>

        <Link href="/generate/audio">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Audio</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create voice, music, and sound effects using advanced AI models
            </p>
          </div>
        </Link>

        <Link href="/generate/combine">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Combine Media</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Merge video, voice, and music into a single polished output
            </p>
          </div>
        </Link>
      </div>

      {/* Features List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Multiple AI models (Stable Diffusion, DALL·E, Runway, Pika)</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Text-to-speech with multiple voices</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Prompt enhancement with AI</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>History and re-generation</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Download in multiple formats</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Mobile-responsive design</span>
          </div>
        </div>
      </div>
    </div>
  )
}



