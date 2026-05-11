import { useState } from 'react'
import { User } from 'lucide-react'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: number }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', icon: 16 },
  md: { container: 'w-12 h-12', text: 'text-base', icon: 24 },
  lg: { container: 'w-16 h-16', text: 'text-xl', icon: 32 },
}

function getInitials(name?: string): string {
  if (!name) return '?'
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const showImage = src && !imageError
  const initials = getInitials(name || alt)
  const { container, text, icon } = sizeClasses[size]

  return (
    <div
      className={`
        ${container}
        rounded-full overflow-hidden
        flex items-center justify-center
        bg-gradient-to-br from-blue-400 to-blue-600
        text-white font-semibold
        ${className}
      `}
    >
      {showImage ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoading(false)}
            className="w-full h-full object-cover"
          />
        </>
      ) : name || alt ? (
        <span className={text}>{initials}</span>
      ) : (
        <User size={icon} />
      )}
    </div>
  )
}
