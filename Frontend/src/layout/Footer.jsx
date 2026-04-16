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
    <footer className="bg-primary-900 text-primary-300 pt-16 pb-8">
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6" direction="up" delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl
                              flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-primary-50" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl text-primary-50">Maskan</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-5">
              La plateforme immobilière premium de Tunisie. Trouvez, réservez et gérez
              vos biens en toute confiance.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:contact@maskan.tn" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4" /> contact@maskan.tn
              </a>
              <a href="tel:+21671000000" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4" /> +216 71 000 000
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Tunis, Tunisie
              </span>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-primary-50 font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm hover:text-primary-400 transition-colors duration-150"
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
        <div className="pt-8 border-t border-primary-800 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-xs">© 2026 Maskan. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center
                           hover:bg-primary-500 hover:text-primary-50 text-primary-400
                           transition-all duration-150"
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
