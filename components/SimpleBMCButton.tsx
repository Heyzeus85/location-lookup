interface SimpleBMCButtonProps {
    username: string
    className?: string
  }
  
  export default function SimpleBMCButton({ username, className = "" }: SimpleBMCButtonProps) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <a 
          href={`https://www.buymeacoffee.com/${username}`}
          target="_blank"
          rel="noopener noreferrer" 
          className="flex items-center justify-center px-3 py-3 sm:px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full shadow-lg hover:shadow-xl transition-all group"
        >
          <svg className="w-5 h-5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/>
          </svg>
          <span className="hidden sm:inline whitespace-nowrap">Buy me a coffee</span>
        </a>
      </div>
    )
  }