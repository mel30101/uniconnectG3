import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from '@uniconnect/shared'
import { db } from '../../lib/firestore'
import { chatAxios } from '../../lib/chatClient'
import { apiClient } from '../../main'
import { ArrowLeft, Send, Users, Paperclip, X, Smile } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupMember {
  id: string
  name: string
  role: string
}

interface GroupInfo {
  id: string
  name: string
  subjectName?: string
  members: GroupMember[]
}

interface ArchivoMetadata {
  url: string
  fileName: string
  extension: string
  mimeType?: string
  tamano?: number
  icon?: string
  detectedType?: string
}

interface GroupMessage {
  id: string
  senderId?: string
  sender_id?: string
  text?: string
  content?: string
  type?: string
  createdAt?: { _seconds?: number; seconds?: number } | string
  reacciones?: Record<string, { count: number; users: string[] }>
  metadata?: {
    archivo?: ArchivoMetadata
    senderId?: string
    type?: string
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeconds(ts: GroupMessage['createdAt']): number {
  if (!ts) return 0
  if (typeof ts === 'string') return new Date(ts).getTime() / 1000
  return ts._seconds ?? ts.seconds ?? 0
}

function formatTime(ts: GroupMessage['createdAt']): string {
  const s = getSeconds(ts)
  if (!s) return ''
  return new Date(s * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatRelative(ts: GroupMessage['createdAt']): string {
  const s = getSeconds(ts)
  if (!s) return ''
  return formatDistanceToNow(new Date(s * 1000), { addSuffix: true })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupChatPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [group, setGroup] = useState<GroupInfo | null>(null)
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)

  // File attachment states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reaction states
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null)
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | null>(null)

  const groupSocketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load group info
  useEffect(() => {
    if (!groupId || !user?.uid) return
    apiClient.getAxiosInstance()
      .get<GroupInfo>(`/api/groups/${groupId}?userId=${user.uid}`)
      .then(res => setGroup(res.data))
      .catch(err => console.error('[GroupChat] Error cargando grupo:', err))
  }, [groupId, user?.uid])

  // Subscribe to message history via Firestore onSnapshot
  useEffect(() => {
    if (!groupId) return
    const q = query(
      collection(db, 'groups', groupId, 'messages'),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as GroupMessage))
    })
  }, [groupId])

  // Connect to chat-service room
  useEffect(() => {
    if (!groupId || !user?.uid) return

    const socket = io('http://localhost:3004', {
      transports: ['polling', 'websocket'],
      query: { userId: user.uid, study_group_id: groupId },
      reconnection: true,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log(`[GroupChat] Conectado a sala: ${groupId}`)
      setConnected(true)
    })

    // new_message emitted by GroupChatObserver to the room
    socket.on('new_message', (msg: GroupMessage) => {
      // Firestore onSnapshot already handles persistence; this handles optimistic display
      // for messages not yet in Firestore (race condition guard)
      setMessages(prev => {
        const exists = prev.some(m => m.id === msg.id)
        return exists ? prev : [...prev, msg]
      })
    })

    socket.on('connect_error', (err) => {
      console.warn('[GroupChat] Error de conexión:', err.message)
      setConnected(false)
    })

    socket.on('disconnect', () => setConnected(false))

    groupSocketRef.current = socket

    return () => {
      socket.disconnect()
      groupSocketRef.current = null
    }
  }, [groupId, user?.uid])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handler = () => {
      setReactionPickerFor(null)
      setPickerPosition(null)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const handleOpenPicker = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPickerPosition({
      x: Math.min(rect.left, window.innerWidth - 220),
      y: rect.top - 60,
    })
    setReactionPickerFor(messageId)
  }

  const handleReact = async (messageId: string, emoji: string) => {
    setReactionPickerFor(null)
    setPickerPosition(null)
    try {
      await chatAxios.post(
        `/api/group-chats/${groupId}/messages/${messageId}/reactions`,
        { emoji, userId: user?.uid }
      )
    } catch (err) {
      console.error('Error agregando reacción:', err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    e.target.value = ''
  }

  const handleSend = async () => {
    if ((!messageText.trim() && !selectedFile) || !groupId || !user?.uid || sending) return
    setSending(true)
    try {
      // Send file if selected
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('senderId', user.uid)
        if (messageText.trim()) {
          formData.append('text', messageText.trim())
        }

        await chatAxios.post(
          `/api/group-chats/${groupId}/files`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        setSelectedFile(null)
        setMessageText('')
      }
      // Send text message if no file
      else if (messageText.trim()) {
        const text = messageText.trim()
        setMessageText('')
        await chatAxios.post(`/api/group-chats/${groupId}/messages`, {
          senderId: user.uid,
          text,
        })
      }
    } catch (err) {
      console.error('[GroupChat] Error enviando mensaje:', err)
    } finally {
      setSending(false)
    }
  }

  const getSenderName = (msg: GroupMessage): string => {
    const sid = msg.senderId ?? msg.sender_id ?? ''
    return group?.members.find(m => m.id === sid)?.name ?? 'Usuario'
  }

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="h-16 px-4 border-b border-gray-200 bg-white flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(`/groups/${groupId}`)}
          className="p-2 hover:bg-[#F4F6F8] rounded-lg transition-colors"
          aria-label="Volver al grupo"
        >
          <ArrowLeft size={20} className="text-[#002344]" />
        </button>

        <div className="w-10 h-10 rounded-full bg-[#002344] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {group ? getInitials(group.name) : '?'}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#111827] truncate">{group?.name ?? '...'}</p>
          {group?.subjectName && (
            <p className="text-xs text-[#6b7280] truncate">{group.subjectName}</p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-[#6b7280]">
          <Users size={14} />
          <span>{group?.members.length ?? 0}</span>
        </div>

        {connected && (
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Conectado" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F6F8]">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[#6b7280] text-sm">
            No hay mensajes aún. ¡Sé el primero en escribir!
          </div>
        )}

        {messages.map((msg) => {
          const sid = msg.senderId ?? msg.sender_id ?? ''
          const isOwn = sid === user?.uid
          const senderName = getSenderName(msg)

          return (
            <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-[#002344] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-1">
                  {getInitials(senderName)}
                </div>
              )}
              <div className={`max-w-sm ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwn && (
                  <p className="text-xs text-[#6b7280] mb-1 px-1">{senderName}</p>
                )}
                <div className="relative group">
                  <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-[#002344] text-white' : 'bg-white border border-gray-200 text-[#111827]'}`}>
                    {(() => {
                      const archivo = msg.metadata?.archivo
                      const isFile = msg.type === 'file' || !!archivo

                      if (!isFile) {
                        // Mensaje de texto normal
                        const text = msg.text ?? msg.content ?? ''
                        return (
                          <>
                            <p className="text-sm">{text}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-gray-300' : 'text-gray-400'}`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </>
                        )
                      }

                      // Mensaje de archivo
                      const fileUrl = archivo?.url
                      const fileName = archivo?.fileName ?? 'Archivo'
                      const extension = archivo?.extension ?? ''
                      const icon = archivo?.icon ?? '📎'

                      return (
                        <div className="space-y-2">
                          {/* Header del archivo */}
                          <div className="flex items-center gap-2 p-2 bg-black/5 rounded-lg">
                            <div className="text-2xl">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {fileName}
                              </p>
                              <p className={`text-xs ${isOwn ? 'text-gray-300' : 'text-gray-500'}`}>
                                {extension}
                              </p>
                            </div>
                          </div>

                          {/* Botón descargar */}
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block text-center text-xs font-semibold py-1 px-3 rounded ${
                                isOwn ? 'bg-white text-[#002344]' : 'bg-[#002344] text-white'
                              } hover:opacity-90 transition-opacity`}
                            >
                              ⬇ Descargar
                            </a>
                          ) : (
                            <p className={`text-xs text-center ${isOwn ? 'text-gray-300' : 'text-gray-500'}`}>
                              URL no disponible
                            </p>
                          )}

                          {/* Timestamp */}
                          <p className={`text-xs mt-1 ${isOwn ? 'text-gray-300' : 'text-gray-400'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Reaction button - appears on hover */}
                  <button
                    onClick={(e) => handleOpenPicker(e, msg.id)}
                    className="absolute -top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md z-10"
                  >
                    <Smile size={14} />
                  </button>

                  {/* Existing reactions */}
                  {msg.reacciones && Object.keys(msg.reacciones).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {Object.entries(msg.reacciones).map(([emoji, data]) => {
                        if (!data.count) return null
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReact(msg.id, emoji)}
                            className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs hover:bg-gray-50 shadow-sm"
                          >
                            {emoji} {data.count}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        {/* File preview */}
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
            <div className="text-2xl">
              📎
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 bg-[#F4F6F8] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#002344]"
          />
          <button
            onClick={handleSend}
            disabled={(!messageText.trim() && !selectedFile) || sending}
            className="p-2 bg-[#002344] text-white rounded-full hover:bg-[#003355] disabled:bg-gray-300 transition-colors"
            aria-label="Enviar mensaje"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Floating reaction picker - outside message loop */}
      {reactionPickerFor && pickerPosition && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: `${pickerPosition.x}px`,
            top: `${pickerPosition.y}px`,
            zIndex: 9999,
          }}
          className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-lg flex gap-1"
        >
          {['👍', '❤️', '😂', '🔥', '😮', '😢'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReact(reactionPickerFor, emoji)}
              className="text-xl hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
