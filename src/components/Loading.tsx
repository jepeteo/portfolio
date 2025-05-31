import React from "react"

interface LoadingProps {
  message?: string
  className?: string
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      <div className="relative">
        {/* Animated spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
        {message}
      </p>
    </div>
  )
}

export default Loading
