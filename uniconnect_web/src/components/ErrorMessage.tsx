import { AlertCircle } from 'lucide-react'
import Button from './Button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Reintentar
        </Button>
      )}
    </div>
  )
}
