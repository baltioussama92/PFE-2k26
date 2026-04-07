import React from 'react'
import { motion } from 'framer-motion'
import { Users, Home, ArrowRight } from 'lucide-react'

export default function RoleSwitcher({
  currentRole,
  isHost,
  onRoleChange,
  onBecomeHost,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      {isHost ? (
        // Both modes available - show tabs
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Switch Mode:</span>
          <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleChange('GUEST')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                currentRole === 'GUEST'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Guest Mode
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleChange('HOST')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                currentRole === 'HOST'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Host Mode
            </motion.button>
          </div>
        </div>
      ) : (
        // Not a host - show CTA to become one
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Ready to list your property?</h3>
            <p className="text-sm text-slate-600 mt-1">
              Unlock host features and start earning money by renting your space.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBecomeHost}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
          >
            Become a Host
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
