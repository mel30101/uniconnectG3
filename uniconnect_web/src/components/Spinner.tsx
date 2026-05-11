export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-4'
  }

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-blue-600 border-t-transparent`} />
    </div>
  )
}
