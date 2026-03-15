import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { messageService } from '../services/messageService'
import type { MessageResponse } from '../types/contracts'
import './MessagesPage.css'

interface ChatPreview {
  peerId: number | string
  name: string
  lastMessage: string
  createdAt: string
}

const peerNames: Record<string, string> = {
  '1': 'You',
  '2': 'Sarah T.',
  '3': 'Youssef A.',
  '4': 'Lina R.',
}

const getCurrentUserId = (): number | string => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return 1
    const parsed = JSON.parse(raw) as { id?: number | string }
    return parsed.id ?? 1
  } catch {
    return 1
  }
}

const sameId = (left: number | string, right: number | string): boolean => String(left) === String(right)

const formatTime = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MessagesPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allMessages, setAllMessages] = useState<MessageResponse[]>([])
  const [selectedPeerId, setSelectedPeerId] = useState<number | string | null>(null)
  const [receiverIdInput, setReceiverIdInput] = useState('')
  const [draft, setDraft] = useState('')

  const currentUserId = useMemo(() => getCurrentUserId(), [])

  useEffect(() => {
    let active = true

    const loadMessages = async () => {
      setLoading(true)
      setError('')

      try {
        const [inbox, outbox] = await Promise.all([messageService.inbox(), messageService.outbox()])
        if (!active) return

        const combined = [...inbox, ...outbox].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )

        setAllMessages(combined)

        if (combined.length > 0) {
          const first = combined[combined.length - 1]
          const firstPeer = sameId(first.senderId, currentUserId) ? first.receiverId : first.senderId
          setSelectedPeerId(firstPeer)
          setReceiverIdInput(String(firstPeer))
        }
      } catch {
        if (!active) return
        setError('Failed to load messages. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMessages()

    return () => {
      active = false
    }
  }, [currentUserId])

  const chats = useMemo<ChatPreview[]>(() => {
    const map = new Map<string, ChatPreview>()

    for (const msg of allMessages) {
      const peerId = sameId(msg.senderId, currentUserId) ? msg.receiverId : msg.senderId
      const key = String(peerId)

      map.set(key, {
        peerId,
        name: peerNames[key] || `User #${key}`,
        lastMessage: msg.content,
        createdAt: msg.createdAt,
      })
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [allMessages, currentUserId])

  const activePeerId = selectedPeerId ?? (receiverIdInput.trim() || null)

  const activeConversation = useMemo(() => {
    if (!activePeerId) return []

    return allMessages.filter((msg) => {
      const left = sameId(msg.senderId, currentUserId) && sameId(msg.receiverId, activePeerId)
      const right = sameId(msg.senderId, activePeerId) && sameId(msg.receiverId, currentUserId)
      return left || right
    })
  }, [allMessages, activePeerId, currentUserId])

  const activeChatName = activePeerId ? (peerNames[String(activePeerId)] || `User #${activePeerId}`) : 'Select a chat'

  const selectChat = (peerId: number | string) => {
    setSelectedPeerId(peerId)
    setReceiverIdInput(String(peerId))
  }

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()

    const content = draft.trim()
    const targetId = receiverIdInput.trim()

    if (!targetId) {
      setError('Add a receiver ID first (for example: 2).')
      return
    }

    if (!content) {
      setError('Message content cannot be empty.')
      return
    }

    try {
      setError('')

      const sent = await messageService.send({
        receiverId: Number.isNaN(Number(targetId)) ? targetId : Number(targetId),
        content,
      })

      setAllMessages((prev) => [...prev, sent])
      setSelectedPeerId(sent.receiverId)
      setReceiverIdInput(String(sent.receiverId))
      setDraft('')
    } catch {
      setError('Failed to send message. Please retry.')
    }
  }

  return (
    <div className="messages-page">
      <Navbar />

      <main className="messages-main">
        <section className="messages-hero">
          <div className="container messages-hero-inner">
            <p className="messages-eyebrow">Communication</p>
            <h1>Messages</h1>
            <p>Chat with property owners and tenants from one place.</p>
          </div>
        </section>

        <section className="messages-content container">
          <div className="messages-layout">
            <aside className="chat-list">
              <div className="panel-head">
                <h2>Conversations</h2>
              </div>

              {loading ? (
                <p className="panel-note">Loading chats...</p>
              ) : chats.length === 0 ? (
                <p className="panel-note">No conversations yet. Start by sending a message.</p>
              ) : (
                <div className="chat-items">
                  {chats.map((chat) => (
                    <button
                      key={String(chat.peerId)}
                      type="button"
                      className={`chat-item ${sameId(activePeerId || '', chat.peerId) ? 'active' : ''}`}
                      onClick={() => selectChat(chat.peerId)}
                    >
                      <div className="chat-avatar">{chat.name.charAt(0).toUpperCase()}</div>
                      <div className="chat-meta">
                        <strong>{chat.name}</strong>
                        <p>{chat.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <section className="chat-room">
              <div className="panel-head room-head">
                <div>
                  <h2>{activeChatName}</h2>
                  <p>Current user: #{String(currentUserId)}</p>
                </div>
                <label className="receiver-control">
                  Send to user ID
                  <input
                    value={receiverIdInput}
                    onChange={(e) => {
                      setReceiverIdInput(e.target.value)
                      setSelectedPeerId(e.target.value)
                    }}
                    placeholder="2"
                  />
                </label>
              </div>

              <div className="chat-messages">
                {activeConversation.length === 0 ? (
                  <p className="panel-note">No messages in this conversation yet.</p>
                ) : (
                  activeConversation.map((msg) => {
                    const mine = sameId(msg.senderId, currentUserId)
                    return (
                      <div key={String(msg.id)} className={`message-row ${mine ? 'mine' : ''}`}>
                        <div className="message-bubble">
                          <p>{msg.content}</p>
                          <span>{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="chat-compose">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write your message..."
                  rows={2}
                />
                <button type="submit">Send</button>
              </form>

              {error && <p className="panel-error">{error}</p>}
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default MessagesPage
