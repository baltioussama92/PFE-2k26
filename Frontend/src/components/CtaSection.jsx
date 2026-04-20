import React from 'react'

const PRIMARY_LOGO_SRC = '/Maskan%20logo.svg'
const LOGO_FALLBACK_SRC = '/maskan%20with%20name%20logo.png'

export default function CtaSection({
  onPrimaryClick,
  onSecondaryClick,
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#A65B32]/10 bg-gradient-to-br from-[#FAF7F2] via-[#FDFBF8] to-[#F7F1E8] p-6 sm:p-10 lg:p-12 shadow-[0_24px_70px_rgba(166,91,50,0.16)]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <span className="mb-5 inline-flex rounded-full bg-[#A65B32] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(166,91,50,0.28)]">
                REJOIGNEZ MASKAN
              </span>

              <h2 className="text-3xl font-extrabold leading-tight text-[#2F241D] sm:text-4xl lg:text-5xl">
                Prêt à trouver votre maison idéale ?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5E4A3D] sm:text-base lg:mx-0">
                Inscrivez-vous gratuitement et accédez à des milliers d'annonces vérifiées. Aucune carte bancaire requise.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={onPrimaryClick}
                  className="inline-flex items-center justify-center rounded-xl bg-[#A65B32] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(166,91,50,0.30)] transition duration-300 hover:scale-105 hover:shadow-[0_18px_40px_rgba(166,91,50,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A65B32] focus-visible:ring-offset-2"
                >
                  S'inscrire gratuitement →
                </button>

                <button
                  type="button"
                  onClick={onSecondaryClick}
                  className="inline-flex items-center justify-center rounded-xl border border-[#A65B32] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#A65B32] transition duration-300 hover:scale-105 hover:bg-[#A65B32]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A65B32] focus-visible:ring-offset-2"
                >
                  Se connecter
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-[#A65B32]/10 blur-3xl" />
                <div className="mx-auto w-full max-w-[460px] transform-gpu animate-[float_5s_ease-in-out_infinite]">
                  <img
                    src={PRIMARY_LOGO_SRC}
                    alt="Logo Maskan"
                    onError={(event) => {
                      if (event.currentTarget.src.includes(LOGO_FALLBACK_SRC)) return
                      event.currentTarget.src = LOGO_FALLBACK_SRC
                    }}
                    className="mx-auto h-auto w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] object-contain drop-shadow-[0_24px_40px_rgba(47,36,29,0.22)]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
