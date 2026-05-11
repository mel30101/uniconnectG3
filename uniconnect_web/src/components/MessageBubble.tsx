import type { Message } from '@uniconnect/shared'
import { Check, CheckCheck, FileText } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  isMine: boolean
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const isRead = message.readBy.length > 1

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isMine
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
        }`}
      >
        {/* File attachment */}
        {message.type !== 'text' && message.fileURL && (
          <div className="mb-1">
            {message.type === 'image' ? (
              <img
                src={message.fileURL}
                alt={message.fileName ?? 'image'}
                className="rounded-lg max-w-full max-h-48 object-cover"
              />
            ) : (
              <a
                href={message.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm underline ${isMine ? 'text-blue-100' : 'text-blue-600'}`}
              >
                <FileText size={16} />
                {message.fileName ?? 'File'}
                {message.fileSize != null && (
                  <span className="text-xs opacity-70">({Math.round(message.fileSize / 1024)}KB)</span>
                )}
              </a>
            )}
          </div>
        )}

        {/* Text content */}
        {message.content && (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        )}

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
            {formatTime(message.createdAt)}
          </span>
          {isMine && (
            isRead
              ? <CheckCheck size={12} className="text-blue-200" />
              : <Check size={12} className="text-blue-300" />
          )}
        </div>
      </div>
    </div>
  )
}
