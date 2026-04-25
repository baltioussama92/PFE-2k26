import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileCheck, Loader2, ArrowLeft, Check, AlertCircle,
  FileText, Home, CreditCard, User, Camera, MapPin, Building2,
  ChevronRight, CheckCircle2, XCircle, Eye, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, getStoredAuthToken } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import { guestVerificationService } from '../services/guestVerificationService'

// ============= REUSABLE COMPONENTS =============

// Stepper Component
function Stepper({ steps, currentStep }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`flex flex-col items-center gap-2 flex-1 ${index > 0 ? 'relative' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  index < currentStep
                    ? 'bg-amber-600 text-white'
                    : index === currentStep
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white ring-2 ring-amber-300'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-xs font-medium text-center hidden sm:block ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                  index < currentStep ? 'bg-amber-600' : 'bg-gray-300'
                }`}
                style={{ marginBottom: '24px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
        />
      </div>
    </div>
  )
}

// Input Field Component
function InputField({ label, type = 'text', placeholder, value, onChange, error, required = false, readOnly = false, pattern, maxLength }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        pattern={pattern}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
        } ${readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white'}`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Select/Dropdown Component
function SelectField({ label, options, value, onChange, error, required = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
        }`}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// File Upload Component with Drag & Drop
function FileUpload({ label, icon: Icon, description, file, onFileChange, accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx', maxSize = 5242880, error }) {
  const fileInputId = `file-${label.replace(/\s+/g, '-')}`
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const selectedFile = files[0]
      if (selectedFile.size <= maxSize) {
        onFileChange({ target: { files: files } })
      } else {
        alert(`File size should be less than ${maxSize / 1024 / 1024}MB`)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-900">{label}</label>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          backgroundColor: isDragging ? 'rgb(254, 243, 235)' : 'transparent'
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 text-center ${
          error
            ? 'border-red-300 bg-red-50'
            : isDragging
            ? 'border-amber-500'
            : 'border-gray-300 hover:border-amber-400'
        }`}
      >
        <input
          id={fileInputId}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
        />
        <label htmlFor={fileInputId} className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Cliquez ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            {file && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mt-2 py-2 px-3 rounded-lg bg-green-100 border border-green-300 w-full"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-xs font-medium text-green-700 truncate">{file.name}</span>
              </motion.div>
            )}
          </div>
        </label>
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Multi File Upload for Images
function ImageUpload({ label, files, onFilesChange, error, minImages = 3 }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputId = `images-${label.replace(/\s+/g, '-')}`

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const newFiles = Array.from(e.dataTransfer.files)
    const validFiles = newFiles.filter(f => f.type.startsWith('image/'))
    onFilesChange([...files, ...validFiles])
  }

  const removeImage = (index) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        <span className="text-red-500 ml-1">*</span>
        <span className="text-gray-500 font-normal"> (minimum {minImages} images)</span>
      </label>

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          backgroundColor: isDragging ? 'rgb(254, 243, 235)' : 'transparent'
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 text-center ${
          error
            ? 'border-red-300 bg-red-50'
            : isDragging
            ? 'border-amber-500'
            : 'border-gray-300 hover:border-amber-400'
        }`}
      >
        <input
          id={fileInputId}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onFilesChange([...files, ...Array.from(e.target.files)])}
          className="hidden"
        />
        <label htmlFor={fileInputId} className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-amber-600" />
            <p className="text-sm font-bold text-gray-900">Ajouter des photos</p>
            <p className="text-xs text-gray-500">
              {files.length} image{files.length !== 1 ? 's' : ''} ajoutée{files.length !== 1 ? 's' : ''} - Ajoutez-en au moins {minImages}
            </p>
          </div>
        </label>
      </motion.div>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4"
        >
          {files.map((file, index) => {
            const preview = URL.createObjectURL(file)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Checkbox Component
function CheckBox({ label, checked, onChange, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`w-5 h-5 mt-1 rounded-lg cursor-pointer transition-all ${
            error
              ? 'accent-red-600 border-red-300'
              : 'accent-amber-600 border-gray-300'
          }`}
        />
        <label className="text-sm text-gray-700 cursor-pointer flex-1">{label}</label>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 ml-8"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Button Component
function Button({ label, onClick, variant = 'primary', disabled = false, loading = false, icon: Icon }) {
  const baseClass = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg disabled:opacity-50',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]}`}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {Icon && !loading && <Icon className="w-5 h-5" />}
      {label}
    </motion.button>
  )
}

// ============= MAIN COMPONENT =============

export default function HostVerificationPageNew() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')

  const steps = [
    'Infos',
    'Identité',
    'Propriété',
    'Détails',
    'Paiement',
    'Confirmation'
  ]

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: 'user@example.com',
    phone: '',
    otpVerified: false,
    otpCode: '',

    // Step 2: Identity
    governmentID: null,
    selfie: null,

    // Step 3: Address/Property
    propertyProof: null,
    proofType: '',

    // Step 4: Property Details
    propertyTitle: '',
    propertyAddress: '',
    propertyType: '',
    propertyImages: [],

    // Step 5: Payment
    iban: '',
    accountHolder: '',

    // Step 6: Terms
    confirmOwnership: false,
    acceptTerms: false
  })

  const [errors, setErrors] = useState({})

  // Validation Functions
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 0: // Basic Info
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone number must be valid'
        }
        break

      case 1: // Identity
        if (!formData.governmentID) newErrors.governmentID = 'Government ID is required'
        if (!formData.selfie) newErrors.selfie = 'Selfie is required'
        break

      case 2: // Property Proof
        if (!formData.propertyProof) newErrors.propertyProof = 'Property proof document is required'
        if (!formData.proofType) newErrors.proofType = 'Please select proof type'
        break

      case 3: // Property Details
        if (!formData.propertyTitle.trim()) newErrors.propertyTitle = 'Property title is required'
        if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Address is required'
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required'
        if (formData.propertyImages.length < 3) {
          newErrors.propertyImages = `You must upload at least 3 images (${formData.propertyImages.length}/3)`
        }
        break

      case 4: // Payment
        if (!formData.iban.trim()) newErrors.iban = 'IBAN is required'
        if (!formData.accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required'
        if (formData.accountHolder.toLowerCase() !== formData.fullName.toLowerCase()) {
          newErrors.accountHolder = 'Account holder name must match full name'
        }
        // Validate IBAN format (basic)
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(formData.iban.replace(/\s/g, ''))) {
          newErrors.iban = 'Invalid IBAN format'
        }
        break

      case 5: // Terms
        if (!formData.confirmOwnership) newErrors.confirmOwnership = 'You must confirm property ownership'
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept terms and conditions'
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Next Step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      } else {
        handleSubmit()
      }
    }
  }

  // Handle Back Step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle Submit
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = getStoredAuthToken()
      if (!token) {
        throw new Error('Session expired. Please sign in again.')
      }

      const body = new FormData()
      body.append('governmentID', formData.governmentID)
      body.append('selfie', formData.selfie)
      body.append('propertyProof', formData.propertyProof)
      formData.propertyImages.forEach((image) => {
        body.append('propertyImages', image)
      })
      body.append('fullName', formData.fullName)
      body.append('acceptTerms', String(formData.acceptTerms))
      body.append('confirmOwnership', String(formData.confirmOwnership))

      const response = await fetch(`${API_BASE_URL}/api${ENDPOINTS.verifications.submitHost}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      })

      if (!response.ok) {
        const payload = await response.text()
        throw new Error(payload || 'Submission failed')
      }

      setShowSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/profile')
      }, 3000)
    } catch (error) {
      console.error('❌ Submission error:', error)
      alert(error?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Render Steps
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de Base</h2>
              <p className="text-gray-600">Commencez par vos informations de base</p>
            </div>

            <InputField
              label="Nom Complet"
              placeholder="Jean Dupont"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              required
            />

            <InputField
              label="Email"
              type="email"
              value={formData.email}
              readOnly
              required
            />

            <InputField
              label="Numéro de Téléphone"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              required
            />

            {/* OTP Verification */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700 font-semibold mb-2">Vérification OTP</p>
              <p className="text-xs text-blue-600">Un code OTP a été envoyé à votre téléphone</p>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={formData.otpCode}
                  onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-blue-300 text-center font-mono"
                />
                <button
                  onClick={async () => {
                    try {
                      if (!otpRequestId) {
                        const sendResponse = await guestVerificationService.sendPhoneOtp({
                          phoneNumber: formData.phone,
                        })
                        setOtpRequestId(sendResponse.reqId)
                        alert('OTP sent to your phone. Enter the received code to verify.')
                        return
                      }

                      await guestVerificationService.verifyPhoneOtp({
                        reqId: otpRequestId,
                        code: formData.otpCode,
                      })

                      setFormData({ ...formData, otpVerified: true, otpCode: '' })
                    } catch (error) {
                      alert(error?.message || 'Code de vérification invalide')
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Vérifier
                </button>
              </div>
              {formData.otpVerified && (
                <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Vérifiée
                </p>
              )}
            </div>
          </motion.div>
        )

      case 1: // Identity Verification
        return (
          <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification d'Identité</h2>
              <p className="text-gray-600">Téléchargez vos documents d'identité</p>
            </div>

            <FileUpload
              label="Carte d'Identité ou Passeport"
              icon={FileText}
              description="PDF, JPG, PNG ou DOC (Max 5MB)"
              file={formData.governmentID}
              onFileChange={(e) => setFormData({ ...formData, governmentID: e.target.files[0] })}
              error={errors.governmentID}
            />

            <FileUpload
              label="Selfie (Photo d'Identité)"
              icon={Camera}
              description="Prenez une photo claire de vous avec votre document"
              file={formData.selfie}
              onFileChange={(e) => setFormData({ ...formData, selfie: e.target.files[0] })}
              error={errors.selfie}
              accept="image/*"
            />

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-900 font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Conseils de photographie
              </p>
              <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                <li>Assurez-vous que le document est clair et lisible</li>
                <li>Prenez une photo directe du visage</li>
                <li>Bonne luminosité, sans reflets</li>
              </ul>
            </div>
          </motion.div>
        )

      case 2: // Property Proof
        return (
          <motion.div key="step-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Preuve de Propriété</h2>
              <p className="text-gray-600">Téléchargez un document prouvant votre propriété</p>
            </div>

            <SelectField
              label="Type de Preuve"
              options={[
                { value: 'utility', label: 'Facture de Services (eau, électricité, gaz)' },
                { value: 'ownership', label: 'Document de Propriété' },
                { value: 'rental', label: 'Contrat de Location' }
              ]}
              value={formData.proofType}
              onChange={(e) => setFormData({ ...formData, proofType: e.target.value })}
              error={errors.proofType}
              required
            />

            <FileUpload
              label="Document de Preuve"
              icon={FileText}
              description="Téléchargez le document choisi (PDF, JPG, PNG)"
              file={formData.propertyProof}
              onFileChange={(e) => setFormData({ ...formData, propertyProof: e.target.files[0] })}
              error={errors.propertyProof}
            />

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900 font-semibold">📋 Exemples de documents acceptés:</p>
              <ul className="text-xs text-blue-800 mt-2 space-y-1">
                <li>• Facture d'électricité/gaz/eau comportant votre nom</li>
                <li>• Titre de propriété ou acte de vente</li>
                <li>• Contrat de location signé</li>
              </ul>
            </div>
          </motion.div>
        )

      case 3: // Property Details
        return (
          <motion.div key="step-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Détails de la Propriété</h2>
              <p className="text-gray-600">Describez votre propriété de location</p>
            </div>

            <InputField
              label="Titre de la Propriété"
              placeholder="ex. Appartement 2 chambres, vue sur la mer"
              value={formData.propertyTitle}
              onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
              error={errors.propertyTitle}
              required
            />

            <InputField
              label="Adresse Complète"
              placeholder="123 Rue de la Paix, 75000 Paris"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              error={errors.propertyAddress}
              required
            />

            <SelectField
              label="Type de Propriété"
              options={[
                { value: 'apartment', label: 'Appartement' },
                { value: 'house', label: 'Maison' },
                { value: 'room', label: 'Chambre' },
                { value: 'villa', label: 'Villa' },
                { value: 'studio', label: 'Studio' }
              ]}
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              error={errors.propertyType}
              required
            />

            <ImageUpload
              label="Photos de la Propriété"
              files={formData.propertyImages}
              onFilesChange={(files) => setFormData({ ...formData, propertyImages: files })}
              error={errors.propertyImages}
              minImages={3}
            />
          </motion.div>
        )

      case 4: // Payment Information
        return (
          <motion.div key="step-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de Paiement</h2>
              <p className="text-gray-600">Fournissez vos coordonnées bancaires</p>
            </div>

            <InputField
              label="IBAN"
              placeholder="FR1420041010050500013M02606"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
              error={errors.iban}
              pattern="[A-Z0-9\s]{15,34}"
              required
            />

            <InputField
              label="Titulaire du Compte"
              placeholder={formData.fullName || "Votre nom complet"}
              value={formData.accountHolder}
              onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
              error={errors.accountHolder}
              required
            />

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-900 font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Sécurité
              </p>
              <p className="text-xs text-yellow-800 mt-2">Votre IBAN est chiffré et protégé. Nous ne le stockons que pour les paiements.</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900 font-semibold">💳 Format IBAN</p>
              <p className="text-xs text-blue-800 mt-2">Vérifiez que votre IBAN commence par le code pays (ex: FR, DE, ES)</p>
            </div>
          </motion.div>
        )

      case 5: // Terms & Submission
        return (
          <motion.div key="step-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation & Conditions</h2>
              <p className="text-gray-600">Finalisez votre inscription en tant que propriétaire</p>
            </div>

            <CheckBox
              label="Je confirme que je suis le propriétaire de cette propriété ou que j'ai l'autorisation du propriétaire"
              checked={formData.confirmOwnership}
              onChange={(e) => setFormData({ ...formData, confirmOwnership: e.target.checked })}
              error={errors.confirmOwnership}
            />

            <CheckBox
              label="J'accepte les conditions d'utilisation et la politique de confidentialité"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              error={errors.acceptTerms}
            />

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Prêt à soumettre?
              </p>
              <p className="text-xs text-green-800 mt-2">
                Vos informations seront vérifiées dans les 24-48 heures. Vous recevrez un email de confirmation.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Résumé des Informations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-600">Nom:</p>
                  <p className="font-semibold text-gray-900">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type de Propriété:</p>
                  <p className="font-semibold text-gray-900 capitalize">{formData.propertyType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Photos versées:</p>
                  <p className="font-semibold text-gray-900">{formData.propertyImages.length}/3+</p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Succès!</h2>
          <p className="text-gray-600 mb-2">Votre demande de propriétaire a été soumise</p>
          <p className="text-sm text-amber-600 font-semibold">
            ⏱️ Redirection vers le profil dans 3 secondes...
          </p>

          <motion.div
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 3, ease: 'linear' }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-6"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Devenir Propriétaire</h1>
              <p className="text-gray-600">Étape {currentStep + 1} sur {steps.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <Stepper steps={steps} currentStep={currentStep} />
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8"
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-between"
        >
          <Button
            label="Retour"
            onClick={handleBack}
            variant="secondary"
            disabled={currentStep === 0}
            icon={ArrowLeft}
          />

          <Button
            label={currentStep === steps.length - 1 ? 'Soumettre' : 'Suivant'}
            onClick={handleNext}
            variant="primary"
            loading={loading}
            icon={currentStep === steps.length - 1 ? Check : ChevronRight}
          />
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center text-xs text-blue-800"
        >
          🔒 Vos données sont chiffées et stockées de manière sécurisée
        </motion.div>
      </div>
    </div>
  )
}
