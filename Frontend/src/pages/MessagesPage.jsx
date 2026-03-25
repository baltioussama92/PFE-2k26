import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MessageSquare, Send, Search, Loader2 } from 'lucide-react'
import { messageService } from '../services/messageService'

const formatTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessagesPage({ user }) {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [activeContactId, setActiveContactId] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!user) return
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const [inbox, outbox] = await Promise.all([messageService.inbox(), messageService.outbox()])
        if (!active) return
        const combined = [...inbox, ...outbox]
          .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))
        setMessages(combined)

        if (!activeContactId && combined.length) {
          const first = combined[combined.length - 1]
          const currentUserId = String(user?.id)
          const counterpartId = String(first.senderId) === currentUserId ? String(first.receiverId) : String(first.senderId)
          setActiveContactId(counterpartId)
        }
      } catch {
        if (!active) return
        setMessages([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [user])

  if (!user) return <Navigate to="/" replace />

  const currentUserId = String(user?.id)

  const contacts = useMemo(() => {
    const map = new Map()
    messages.forEach((message) => {
      const counterpartId = String(message.senderId) === currentUserId
        ? String(message.receiverId)
        : String(message.senderId)

      const previous = map.get(counterpartId)
      if (!previous || new Date(message.createdAt) > new Date(previous.lastMessage.createdAt)) {
        map.set(counterpartId, {
          id: counterpartId,
          name: `Utilisateur #${counterpartId}`,
          lastMessage: message,
        })
      }
    })

    return Array.from(map.values())
      .sort((left, right) => new Date(right.lastMessage.createdAt) - new Date(left.lastMessage.createdAt))
  }, [messages, currentUserId])

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()))

  const activeMessages = messages.filter((message) => {
    if (!activeContactId) return false
    const sender = String(message.senderId)
    const receiver = String(message.receiverId)
    return (sender === currentUserId && receiver === String(activeContactId))
      || (receiver === currentUserId && sender === String(activeContactId))
  })

  const handleSend = async (event) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content || !activeContactId) return

    try {
      const sent = await messageService.send({ receiverId: activeContactId, content })
      setMessages((prev) => [...prev, sent])
      setDraft('')
    } catch {
      // no-op, keep UX simple
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
                      {String(contact.lastMessage.senderId) === currentUserId ? 'Vous: ' : ''}
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
            </div>

            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {!activeContactId ? (
                <p className="text-sm text-primary-500">Choisissez une conversation à gauche.</p>
              ) : activeMessages.length === 0 ? (
                <p className="text-sm text-primary-500">Aucun message pour cette conversation.</p>
              ) : (
                activeMessages.map((message) => {
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
                disabled={!activeContactId}
                className="flex-1 px-3 py-2 rounded-xl border border-primary-200 bg-primary-50 text-sm outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!activeContactId || !draft.trim()}
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
