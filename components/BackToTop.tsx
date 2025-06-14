'use client'

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mt-8 text-center">
      <button 
        onClick={scrollToTop}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        Back to Top
      </button>
    </div>
  )
}