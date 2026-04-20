import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'

const LINKS = {
  Plateforme: [
    { label: 'Comment ça marche', to: '/how-it-works' },
    { label: 'Nos tarifs',         to: '/pricing' },
    { label: 'Explorer',           to: '/explorer' },
  ],
  Aide: [
    { label: "Centre d'aide",    to: '/help' },
    { label: 'Contacter support', to: '/contact' },
    { label: 'Signaler un bug',   to: '/report' },
  ],
  Légal: [
    { label: "Conditions d'utilisation", to: '/terms' },
    { label: 'Politique de conf.',       to: '/privacy' },
    { label: 'Cookies',                  to: '/cookies' },
  ],
}

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Linkedin,  href: '#', label: 'LinkedIn'  },
  { icon: Facebook,  href: '#', label: 'Facebook'  },
]

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F2] text-gray-700 border-t border-primary-100 py-20">
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" direction="up" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 text-primary-900">
              <div className="w-10 h-10 rounded-xl border border-primary-200 bg-primary-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#A65B32]" strokeWidth={2.2} />
              </div>
              <span className="font-semibold text-xl tracking-tight">Maskan</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-600 mb-6">
              La plateforme immobilière premium de Tunisie.
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <a href="mailto:contact@maskan.tn" className="inline-flex items-center gap-2.5 hover:text-[#A65B32] transition-colors duration-200">
                <Mail className="w-4 h-4 text-[#A65B32]" /> contact@maskan.tn
              </a>
              <a href="tel:+21671000000" className="inline-flex items-center gap-2.5 hover:text-[#A65B32] transition-colors duration-200">
                <Phone className="w-4 h-4 text-[#A65B32]" /> +216 71 000 000
              </a>
              <span className="inline-flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#A65B32]" /> Tunis, Tunisie
              </span>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[#A65B32] font-semibold text-sm uppercase tracking-wide mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-gray-700 hover:text-[#A65B32] hover:underline underline-offset-4 transition-all duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-primary-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">Copyright © 2026 Maskan</p>
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-primary-200 bg-primary-50 text-gray-600 flex items-center justify-center hover:text-[#A65B32] hover:border-[#A65B32] transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}
