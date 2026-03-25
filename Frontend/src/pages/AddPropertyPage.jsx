import React, { useRef, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, MapPin, FileText, BedDouble, Bath, Users, DollarSign,
  Image as ImageIcon, Plus, X, Check, ArrowLeft, Sparkles,
} from 'lucide-react'
import { propertyService } from '../services/propertyService'

const PROPERTY_TYPES = ['Appartement', 'Villa', 'Studio', 'Penthouse', 'Chalet', 'Maison']

const AMENITIES_LIST = [
  'WiFi', 'Parking', 'Piscine', 'Climatisation', 'Cuisine équipée',
  'Sécurité 24/7', 'Ascenseur', 'Jardin', 'Terrasse', 'Vue mer',
  'Cheminée', 'Garage', 'Conciergerie', 'Calme absolu', 'Gardien',
]

export default function AddPropertyPage({ user }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')

  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    type: 'Appartement',
    price: 1000,
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    amenities: [],
    imagePreview: '',
  })

  if (!user || (user.role !== 'PROPRIETOR' && user.role !== 'ADMIN')) {
    return <Navigate to="/profile" replace />
  }

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const toggleAmenity = (a) =>
    set('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Veuillez sélectionner un fichier image valide.')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setImageError('Image trop volumineuse (max 3 MB).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageError('')
      set('imagePreview', String(reader.result || ''))
    }
    reader.readAsDataURL(file)
  }

  const canProceed =
    step === 1
      ? form.title.trim() && form.location.trim() && form.description.trim()
      : step === 2
      ? form.price > 0 && form.bedrooms > 0 && form.bathrooms > 0 && form.area > 0
      : !!form.imagePreview

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await propertyService.create({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        pricePerNight: Number(form.price),
        images: [form.imagePreview],
        type: form.type,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        amenities: form.amenities,
        available: true,
      })
      setSuccess(true)
    } catch (err) {
      setError('Publication échouée. Vérifiez les données puis réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-primary-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Propriété ajoutée !</h2>
          <p className="text-primary-500 mb-8">
            Votre annonce « {form.title} » a été publiée avec succès.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/my-properties')}
              className="flex-1 px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition"
            >
              Mes Propriétés
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setStep(1)
                setError('')
                setImageError('')
                setForm({
                  title: '',
                  location: '',
                  description: '',
                  type: 'Appartement',
                  price: 1000,
                  bedrooms: 2,
                  bathrooms: 1,
                  area: 80,
                  amenities: [],
                  imagePreview: '',
                })
              }}
              className="flex-1 px-5 py-3 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition"
            >
              Ajouter une autre
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-primary-50/40">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-primary-100 text-primary-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              Ajouter une propriété
            </h1>
            <p className="text-primary-500 text-sm">Publiez votre bien en quelques étapes</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <button
                onClick={() => s < step && setStep(s)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition
                  ${s === step ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' :
                    s < step ? 'bg-emerald-100 text-emerald-600 cursor-pointer' :
                    'bg-primary-100 text-primary-400'}`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </button>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${s < step ? 'bg-emerald-200' : 'bg-primary-100'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Basic info */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-primary-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Informations de base
              </h2>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-1">Titre de l'annonce *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Ex : Villa Contemporaine avec Piscine"
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-1">Localisation *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="Ex : La Marsa, Tunis"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-1">Type de bien *</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => set('type', t)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition border
                        ${form.type === t
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-primary-200 text-primary-600 hover:bg-primary-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Décrivez votre bien en détail…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-primary-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary-500" />
                Détails & Capacité
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-1">Prix / mois (TND) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => set('price', e.target.value)}
                      min={1}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-1">Surface (m²) *</label>
                  <input
                    type="number"
                    value={form.area}
                    onChange={e => set('area', e.target.value)}
                    min={1}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-1">Chambres *</label>
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-primary-400" />
                    <input
                      type="number"
                      value={form.bedrooms}
                      onChange={e => set('bedrooms', e.target.value)}
                      min={1}
                      max={20}
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-1">Salles de bain *</label>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary-400" />
                    <input
                      type="number"
                      value={form.bathrooms}
                      onChange={e => set('bathrooms', e.target.value)}
                      min={1}
                      max={10}
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition text-primary-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">Équipements</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map(a => (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border
                        ${form.amenities.includes(a)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-primary-200 text-primary-600 hover:bg-primary-50'}`}
                    >
                      {form.amenities.includes(a) && <Check className="inline w-3 h-3 mr-1" />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Image & Preview */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-primary-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-500" />
                Photo & Aperçu
              </h2>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">Téléverser votre photo *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition"
                  >
                    Choisir une image depuis mon appareil
                  </button>

                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}

                  {!form.imagePreview && !imageError && (
                    <p className="text-xs text-primary-500">Formats image acceptés. Taille max: 3 MB.</p>
                  )}
                </div>
              </div>

              {/* Preview card */}
              <div className="border border-primary-100 rounded-2xl overflow-hidden">
                <div className="aspect-video relative">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-400 text-sm">
                      Aucune image sélectionnée
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold">
                    Nouveau
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-primary-900">{form.title || 'Titre'}</h3>
                  <p className="text-primary-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {form.location || 'Localisation'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-primary-500">
                    <span>{form.bedrooms} ch.</span>
                    <span>{form.bathrooms} sdb.</span>
                    <span>{form.area} m²</span>
                  </div>
                  <p className="text-primary-900 font-bold mt-2">
                    {Number(form.price).toLocaleString('fr-TN')} TND<span className="text-primary-400 font-normal text-sm"> / mois</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition"
            >
              Précédent
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => canProceed && setStep(step + 1)}
              disabled={!canProceed}
              className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition
                         disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
              Suivant
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting || !canProceed}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition
                           disabled:opacity-60 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Publier l'annonce
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
