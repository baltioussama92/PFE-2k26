import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { MessageSquare, Send, Search, Loader2, UserPlus, CheckCircle2 } from 'lucide-react'
import { messageService } from '../services/messageService'
import { userService } from '../services/userService'
import { connectionService } from '../services/connectionService'
import { useNotifications } from '../context/NotificationContext'

const formatTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessagesPage({ user }) {
  const location = useLocation()
  const { notify } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [connections, setConnections] = useState([])
  const [draft, setDraft] = useState('')
  const [activeContactId, setActiveContactId] = useState(null)
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])

  // Handle navigation from bookings page
  useEffect(() => {
    if (location.state?.recipientId) {
      setActiveContactId(String(location.state.recipientId))
    }
  }, [location.state?.recipientId])

  const connectedIds = useMemo(() => {
    const currentUserId = String(user?.id)
    const ids = new Set()
    connections.forEach((request) => {
      if (String(request.requesterId) === currentUserId) {
        ids.add(String(request.receiverId))
      } else {
        ids.add(String(request.requesterId))
      }
    })
    return ids
  }, [connections, user])

  const loadConnections = async () => {
    const [allConnections, pending] = await Promise.all([
      connectionService.list(),
      connectionService.listPending(),
    ])
    setConnections(allConnections)
    setPendingRequests(pending)
  }

  const loadConversations = async () => {
    const data = await messageService.conversations()
    setConversations(data)
    if (!activeContactId && data.length) {
      setActiveContactId(String(data[0].userId))
    }
  }

  const loadActiveConversation = async (contactId) => {
    if (!contactId) {
      setMessages([])
      return
    }
    const data = await messageService.conversation(contactId)
    setMessages(data)
  }

  useEffect(() => {
    if (!user) return
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        await Promise.all([
          loadConnections(),
          loadConversations(),
        ])
        if (!active) return
      } catch {
        if (!active) return
        notify('Chargement des conversations impossible.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    const timer = window.setInterval(() => {
      if (!active) return
      loadConversations().catch(() => {})
      if (activeContactId) {
        loadActiveConversation(activeContactId).catch(() => {})
      }
    }, 5000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [user])

  useEffect(() => {
    if (!user || !activeContactId) return
    loadActiveConversation(activeContactId).catch(() => {
      setMessages([])
    })
  }, [activeContactId, user])

  useEffect(() => {
    if (!user || !userSearch.trim()) {
      setUserResults([])
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        const data = await userService.search(userSearch.trim())
        setUserResults(data)
      } catch {
        setUserResults([])
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [userSearch, user])

  if (!user) return <Navigate to="/" replace />

  const contacts = useMemo(() => conversations.map((conversation) => ({
    id: String(conversation.userId),
    name: `Utilisateur #${conversation.userId}`,
    lastMessage: {
      content: conversation.lastMessage || 'Conversation active',
      createdAt: conversation.lastMessageAt,
      senderId: conversation.userId,
    },
  })), [conversations])

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()))

  const handleSend = async (event) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content || !activeContactId) return

    try {
      const sent = await messageService.send({ receiverId: activeContactId, content })
      setMessages((prev) => [...prev, sent])
      setDraft('')
      loadConversations().catch(() => {})
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Envoi impossible.'
      notify(message, 'error')
    }
  }

  const handleAddConnection = async (targetUserId) => {
    try {
      await connectionService.request({ targetUserId: String(targetUserId) })
      notify('Demande de connexion envoyée.', 'success')
      setUserSearch('')
      setUserResults([])
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Demande impossible.'
      notify(message, 'error')
    }
  }

  const handleAcceptConnection = async (requestId) => {
    try {
      await connectionService.accept(requestId)
      notify('Connexion acceptée. Vous pouvez discuter.', 'success')
      await loadConnections()
    } catch {
      notify('Acceptation impossible.', 'error')
    }
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              <h1 className="text-lg font-extrabold text-primary-900">Messages</h1>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-primary-200 bg-primary-100 text-sm text-primary-900 outline-none"
              />
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Chercher un utilisateur (nom/email)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-primary-200 bg-white text-sm text-primary-900 outline-none"
              />
            </div>

            {userResults.length > 0 && (
              <div className="mb-3 space-y-2">
                {userResults.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-2 rounded-xl bg-white border border-primary-100 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-primary-900">{entry.fullName || entry.name || `Utilisateur #${entry.id}`}</p>
                      <p className="text-[11px] text-primary-500">{entry.email}</p>
                    </div>
                    <button
                      onClick={() => handleAddConnection(entry.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pendingRequests.length > 0 && (
              <div className="mb-3 space-y-2">
                {pendingRequests.map((entry) => (
                  <div key={entry.id} className="p-2 rounded-xl bg-white border border-primary-100 flex items-center justify-between gap-2">
                    <p className="text-xs text-primary-700">Nouvelle demande de contact: #{entry.requesterId}</p>
                    <button
                      onClick={() => handleAcceptConnection(entry.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <p className="text-sm text-primary-500 py-6 text-center">Aucune conversation</p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      String(activeContactId) === String(contact.id)
                        ? 'bg-primary-100 border-primary-300'
                        : 'bg-white border-primary-100 hover:bg-primary-100/60'
                    }`}
                  >
                    <p className="text-sm font-semibold text-primary-900">{contact.name}</p>
                    <p className="text-xs text-primary-500 truncate">
                      {contact.lastMessage.content}
                    </p>
                    <p className="text-[10px] text-primary-400 mt-1">{formatTime(contact.lastMessage.createdAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white border border-primary-200 rounded-2xl flex flex-col min-h-[520px]">
            <div className="px-4 py-3 border-b border-primary-200">
              <p className="text-sm font-bold text-primary-900">
                {activeContactId ? `Conversation avec Utilisateur #${activeContactId}` : 'Sélectionnez une conversation'}
              </p>
              {activeContactId && !connectedIds.has(String(activeContactId)) && (
                <p className="text-xs text-amber-700 mt-1">
                  En attente de connexion acceptée pour démarrer la conversation.
                </p>
              )}
            </div>

            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {!activeContactId ? (
                <p className="text-sm text-primary-500">Choisissez une conversation à gauche.</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-primary-500">Aucun message pour cette conversation.</p>
              ) : (
                messages.map((message) => {
                  const currentUserId = String(user?.id)
                  const mine = String(message.senderId) === currentUserId
                  return (
                    <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${mine ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-900'}`}>
                        <p>{message.content}</p>
                        <p className={`text-[10px] mt-1 ${mine ? 'text-primary-100' : 'text-primary-500'}`}>{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-primary-200 flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={activeContactId ? 'Écrire un message...' : 'Sélectionnez une conversation'}
                disabled={!activeContactId || !connectedIds.has(String(activeContactId))}
                className="flex-1 px-3 py-2 rounded-xl border border-primary-200 bg-primary-50 text-sm outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!activeContactId || !draft.trim() || !connectedIds.has(String(activeContactId))}
                className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold disabled:opacity-60 inline-flex items-center gap-1"
              >
                <Send className="w-4 h-4" /> Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
