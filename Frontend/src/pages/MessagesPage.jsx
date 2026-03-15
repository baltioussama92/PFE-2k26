import React, { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Send, Search, X, Phone, Video,
  MoreVertical, Check, CheckCheck, Smile, Image,
  ArrowLeft,
} from 'lucide-react'

// ── Demo conversations ──────────────────────────────────────
const DEMO_CONTACTS = [
  {
    id: 'c1',
    name: 'Yasmine B.',
    avatar: 'https://i.pravatar.cc/40?img=47',
    role: 'Propriétaire',
    online: true,
  },
  {
    id: 'c2',
    name: 'Karim T.',
    avatar: 'https://i.pravatar.cc/40?img=12',
    role: 'Propriétaire',
    online: false,
    lastSeen: 'Il y a 2h',
  },
  {
    id: 'c3',
    name: 'Amal K.',
    avatar: 'https://i.pravatar.cc/40?img=23',
    role: 'Propriétaire',
    online: true,
  },
  {
    id: 'c4',
    name: 'Nour M.',
    avatar: 'https://i.pravatar.cc/40?img=55',
    role: 'Propriétaire',
    online: false,
    lastSeen: 'Il y a 1j',
  },
]

const DEMO_MESSAGES = {
  c1: [
    { id: 1, from: 'c1', text: 'Bonjour ! Merci pour votre intérêt pour l\'appartement aux Berges du Lac.', time: '10:30', date: 'Aujourd\'hui' },
    { id: 2, from: 'me', text: 'Bonjour Yasmine ! Est-ce que l\'appartement est encore disponible pour le mois d\'avril ?', time: '10:32', date: 'Aujourd\'hui' },
    { id: 3, from: 'c1', text: 'Oui, il est disponible à partir du 1er avril. Souhaitez-vous planifier une visite ?', time: '10:35', date: 'Aujourd\'hui' },
    { id: 4, from: 'me', text: 'Ce serait super ! Est-ce possible ce weekend ?', time: '10:36', date: 'Aujourd\'hui' },
    { id: 5, from: 'c1', text: 'Bien sûr ! Samedi à 14h ça vous convient ?', time: '10:38', date: 'Aujourd\'hui' },
    { id: 6, from: 'me', text: 'Parfait, c\'est noté. Merci beaucoup ! 🙏', time: '10:40', date: 'Aujourd\'hui' },
  ],
  c2: [
    { id: 1, from: 'c2', text: 'Bienvenue ! La villa est prête pour votre séjour.', time: '09:15', date: 'Hier' },
    { id: 2, from: 'me', text: 'Merci Karim ! Est-ce que la piscine est chauffée ?', time: '09:20', date: 'Hier' },
    { id: 3, from: 'c2', text: 'Oui, elle est chauffée toute l\'année. Le code du portail vous sera envoyé la veille.', time: '09:25', date: 'Hier' },
  ],
  c3: [
    { id: 1, from: 'me', text: 'Bonjour ! Le studio est-il meublé ?', time: '14:00', date: 'Mar 10' },
    { id: 2, from: 'c3', text: 'Oui, entièrement meublé avec cuisine équipée, machine à laver et WiFi fibre.', time: '14:15', date: 'Mar 10' },
    { id: 3, from: 'me', text: 'Génial ! Et pour le parking ?', time: '14:18', date: 'Mar 10' },
    { id: 4, from: 'c3', text: 'Il y a un parking souterrain inclus dans le loyer. 😊', time: '14:22', date: 'Mar 10' },
  ],
  c4: [
    { id: 1, from: 'c4', text: 'Bonjour, votre demande de réservation a été reçue.', time: '16:00', date: 'Mar 8' },
    { id: 2, from: 'me', text: 'Merci ! Quand sera-t-elle confirmée ?', time: '16:05', date: 'Mar 8' },
  ],
}

// ── Helpers ──────────────────────────────────────────────────
function getLastMessage(contactId) {
  const msgs = DEMO_MESSAGES[contactId]
  if (!msgs || msgs.length === 0) return null
  return msgs[msgs.length - 1]
}

function getUnread(contactId) {
  const msgs = DEMO_MESSAGES[contactId]
  if (!msgs) return 0
  // Simulate: last message from contact = 1 unread for c1 and c3
  const last = msgs[msgs.length - 1]
  if (last.from !== 'me' && (contactId === 'c1')) return 1
  return 0
}

// ── Main Component ──────────────────────────────────────────
export default function MessagesPage({ user }) {
  const [activeContact, setActiveContact] = useState('c1')
  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [draft, setDraft] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  if (!user) return <Navigate to="/" replace />

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeContact, messages])

  const handleSend = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return

    const newMsg = {
      id: Date.now(),
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }),
      date: 'Aujourd\'hui',
    }

    setMessages(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMsg],
    }))
    setDraft('')

    // Simulate reply after 1.5s
    setTimeout(() => {
      const contact = DEMO_CONTACTS.find(c => c.id === activeContact)
      const replies = [
        'D\'accord, je note ça ! 👍',
        'Merci pour votre message, je reviens vers vous rapidement.',
        'C\'est noté. N\'hésitez pas si vous avez d\'autres questions.',
        'Parfait ! Je vous envoie les détails par message.',
      ]
      const reply = {
        id: Date.now() + 1,
        from: activeContact,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }),
        date: 'Aujourd\'hui',
      }
      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), reply],
      }))
    }, 1500)
  }

  const selectContact = (id) => {
    setActiveContact(id)
    setShowMobileChat(true)
  }

  // Filter contacts
  let contacts = DEMO_CONTACTS
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    contacts = contacts.filter(c => c.name.toLowerCase().includes(q))
  }

  const currentContact = DEMO_CONTACTS.find(c => c.id === activeContact)
  const currentMessages = messages[activeContact] || []

  return (
    <section className="min-h-screen pt-20 pb-0 sm:pt-24 sm:pb-8 px-0 sm:px-6">
      <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] sm:h-[calc(100vh-8rem)]">
        <div className="flex h-full bg-primary-50 sm:rounded-3xl sm:border sm:border-primary-200 sm:shadow-glass overflow-hidden">

          {/* ── Sidebar: Contact list ──────────────────────── */}
          <div className={`${showMobileChat ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-80 lg:w-96 border-r border-primary-200 bg-primary-50`}>

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-4.5 h-4.5 text-primary-50" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-primary-900">Messages</h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
                    {DEMO_CONTACTS.length} conversations
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-primary-200 bg-primary-100 text-sm
                             text-primary-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-primary-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="text-sm text-primary-400 text-center py-8">Aucune conversation trouvée</p>
              ) : (
                contacts.map(contact => {
                  const last = getLastMessage(contact.id)
                  const unread = getUnread(contact.id)
                  const isActive = activeContact === contact.id

                  return (
                    <button
                      key={contact.id}
                      onClick={() => selectContact(contact.id)}
                      className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left transition-colors
                                  ${isActive
                                    ? 'bg-primary-100 border-r-2 border-primary-500'
                                    : 'hover:bg-primary-100/60'}`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-200"
                        />
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-primary-50" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm truncate ${isActive ? 'font-bold text-primary-900' : 'font-semibold text-primary-800'}`}>
                            {contact.name}
                          </p>
                          {last && (
                            <span className="text-[10px] text-primary-400 shrink-0">{last.time}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs text-primary-500 truncate">
                            {last
                              ? (last.from === 'me' ? 'Vous: ' : '') + last.text
                              : 'Pas de messages'}
                          </p>
                          {unread > 0 && (
                            <span className="shrink-0 w-5 h-5 rounded-full bg-primary-500 text-primary-50 text-[10px] font-bold flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* ── Chat area ─────────────────────────────────── */}
          <div className={`${showMobileChat ? 'flex' : 'hidden sm:flex'} flex-col flex-1 bg-white`}>

            {/* Chat header */}
            {currentContact && (
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-primary-200 bg-primary-50/50">
                {/* Back button (mobile) */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="sm:hidden p-1.5 -ml-1 rounded-lg hover:bg-primary-100 transition"
                >
                  <ArrowLeft className="w-5 h-5 text-primary-600" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={currentContact.avatar}
                    alt={currentContact.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200"
                  />
                  {currentContact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-primary-50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary-900">{currentContact.name}</p>
                  <p className="text-[10px] text-primary-500">
                    {currentContact.online
                      ? 'En ligne'
                      : currentContact.lastSeen || 'Hors ligne'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl hover:bg-primary-100 transition text-primary-500">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-primary-100 transition text-primary-500">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-primary-100 transition text-primary-500">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1">
              {currentMessages.map((msg, i) => {
                const isMine = msg.from === 'me'
                const showDate = i === 0 || currentMessages[i - 1]?.date !== msg.date

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400 bg-primary-100 px-3 py-1 rounded-full">
                          {msg.date}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-primary-50 rounded-br-md'
                            : 'bg-primary-100 text-primary-900 rounded-bl-md'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${isMine ? 'text-primary-200' : 'text-primary-400'}`}>
                            {msg.time}
                          </span>
                          {isMine && (
                            <CheckCheck className={`w-3 h-3 ${isMine ? 'text-primary-200' : 'text-primary-400'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose */}
            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 px-4 sm:px-6 py-3 border-t border-primary-200 bg-primary-50/50"
            >
              <button type="button" className="p-2.5 rounded-xl hover:bg-primary-100 transition text-primary-400 shrink-0">
                <Image className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(e)
                    }
                  }}
                  placeholder="Écrire un message..."
                  rows={1}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-primary-200 bg-white text-sm text-primary-900
                             outline-none resize-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                />
                <button type="button" className="absolute right-3 bottom-2.5 text-primary-400 hover:text-primary-500 transition">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!draft.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-primary-50 shadow-md
                           disabled:opacity-40 disabled:shadow-none transition-all shrink-0"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
