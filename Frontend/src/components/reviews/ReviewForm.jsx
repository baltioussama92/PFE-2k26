import React from 'react'
import { Star } from 'lucide-react'

export default function ReviewForm({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  submitting = false,
  error = '',
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4 rounded-xl border border-primary-200 bg-white p-4">
      <div>
        <label className="text-xs font-semibold text-primary-700">Note</label>
        <div className="mt-2 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => onRatingChange?.(value)}
              className="p-1"
              aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
            >
              <Star className={`w-5 h-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-primary-300'}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-primary-700">Commentaire</label>
        <textarea
          value={comment}
          onChange={(event) => onCommentChange?.(event.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Partagez votre expérience de séjour..."
          className="mt-1 w-full rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200 resize-none"
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-[#A65B32] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#8f4d2a] disabled:opacity-70"
      >
        {submitting ? 'Publication...' : "Publier l'avis"}
      </button>
    </form>
  )
}
