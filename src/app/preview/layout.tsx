'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()
  const template = pathname.split('/').pop()
  
  // Template information mapping
  const templateInfo = {
    basic: {
      name: 'Basic Template',
      rating: 4.7,
      isPro: false,
      price: 'Free'
    },
    axis: {
      name: 'Axis Template',
      rating: 4.8,
      isPro: true,
      price: '₹49'
    },
    eclipse: {
      name: 'Eclipse Template',
      rating: 4.9,
      isPro: true,
      price: '₹49'
    }
  }
  
  const currentTemplate = templateInfo[template as keyof typeof templateInfo] || templateInfo.basic

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {children}
      
      {/* Floating Sticky Footer */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl border border-gray-200 z-50 w-[90%] sm:w-4/5 max-w-6xl mx-2 sm:mx-4">
        <div className="px-6 py-3">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            {/* Template Info */}
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {currentTemplate.name}
                  {currentTemplate.isPro && (
                    <span className="ml-2 text-xs bg-gradient-to-r from-black to-black bg-clip-text text-transparent font-bold">
                      (Pro)
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-900 font-medium text-sm">{currentTemplate.rating}</span>
              </div>
            </div>
            
            {/* Price Card and Try Template Button Group */}
            <div className="flex items-center gap-3">
              {/* Price Card */}
              <div className="bg-gray-50 px-6 py-2 rounded-full border border-gray-200 min-w-[100px]">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">
                    {currentTemplate.price}
                    {currentTemplate.price !== 'Free' && (
                      <span className="text-xs text-gray-400 font-light">/month</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Try Template Button */}
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap text-sm"
              >
                <span>Try This Template</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex flex-col items-center gap-3">
              {/* Template Info - Name and Rating Side by Side */}
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {currentTemplate.name}
                  {currentTemplate.isPro && (
                    <span className="ml-2 text-xs bg-gradient-to-r from-black to-black bg-clip-text text-transparent font-bold">
                      (Pro)
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-medium text-sm">{currentTemplate.rating}</span>
                </div>
              </div>
              
              {/* Price and Button Row */}
              <div className="flex items-center gap-3">
                {/* Price Card */}
                <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {currentTemplate.price}
                      {currentTemplate.price !== 'Free' && (
                        <span className="text-xs text-gray-400 font-light">/month</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Try Template Button */}
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm"
                >
                  <span>Try Template</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
