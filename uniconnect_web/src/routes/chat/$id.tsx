import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore, useChatStore } from '@uniconnect/shared'
import {
  createChatSocketHandlers,
  joinChatRoom,
  leaveChatRoom,
  emitSendMessage,
  emitMarkAsRead,
} from '@uniconnect/shared/api'
import { chatApi } from '../../main'
import MessageBubble from '../../components/MessageBubble'
import Spinner from '../../components/Spinner'
import ErrorMessage from '../../components/ErrorMessage'
import { ArrowLeft, Send, Paperclip } from 'lucide-react'
import type { Message } from '@uniconnect/shared'

export default function ChatConversationPage() {
  const { id: chatId = '' } = useParams()
  const { user } = useAuthStore()
  const { messages, isLoading, error, setMessages, addMessage, setLoading, setError } = useChatStore()

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const chatMessages = messages[chatId] ?? []

  const loadMessages = () => {
    if (!chatId) return
    setLoading(true)
    setError(null)
    chatApi.getMessages(chatId)
      .then(res => {
        setMessages(chatId, res.data ?? [])
        emitMarkAsRead(chatId)
      })
      .catch(() => setError('Failed to load messages'))
      .finally(() => setLoading(false))
  }

  // Load history + join socket room
  useEffect(() => {
    loadMessages()
    if (!chatId) return

    joinChatRoom(chatId)

    // Subscribe to real-time messages
    let handlers: ReturnType<typeof createChatSocketHandlers> | null = null
    try {
      handlers = createChatSocketHandlers()
      handlers.onNewMessage((msg: Message) => {
        if (msg.chatId === chatId) {
          addMessage(chatId, msg)
          emitMarkAsRead(chatId)
        }
      })
    } catch {
      // Socket not yet connected — real-time unavailable, REST fallback is sufficient
    }

    return () => {
      leaveChatRoom(chatId)
      handlers?.offNewMessage()
    }
  }, [chatId])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages.length])

  const handleSend = async () => {
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText('')
    try {
      // Emit via socket for real-time delivery; REST as fallback
      emitSendMessage(chatId, content)
      const res = await chatApi.sendMessage({ chatId, content, type: 'text' })
      if (res.data) addMessage(chatId, res.data)
    } finally {
      setSending(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      // Upload via fetch directly — no shared endpoint defined yet
      const uploadRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatId}/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
          body: formData,
        }
      )
      if (uploadRes.ok) {
        const { url, name, size } = await uploadRes.json() as { url: string; name: string; size: number }
        const isImage = file.type.startsWith('image/')
        const res = await chatApi.sendMessage({
          chatId,
          content: name,
          type: isImage ? 'image' : 'file',
          fileURL: url,
          fileName: name,
          fileSize: size,
        })
        if (res.data) addMessage(chatId, res.data)
      }
    } finally {
      setUploadingFile(false)
      e.target.value = ''
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMessages} />
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
        <Link to="/chat" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-semibold text-gray-900 dark:text-white">Chat {chatId.slice(0, 8)}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {chatMessages.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No messages yet. Say hello!</p>
        )}
        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isMine={msg.senderId === user?.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingFile}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="p-2 bg-blue-600 dark:bg-blue-700 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        {uploadingFile && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-10">Uploading file…</p>}
      </div>
    </div>
  )
}
