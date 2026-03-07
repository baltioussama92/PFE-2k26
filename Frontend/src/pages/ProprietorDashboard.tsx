import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, PlusSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProprietorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[280px,1fr] lg:px-8">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Proprietor Dashboard</h2>
          <nav className="space-y-2">
            <a className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700" href="#my-houses">
              <Building2 size={16} />
              My Houses
            </a>
            <Link
              to="/add-property"
              className="flex items-center gap-2 rounded-xl border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <PlusSquare size={16} />
              Add New Listing
            </Link>
          </nav>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" id="my-houses">
          <h1 className="text-2xl font-bold">My Houses</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your listings, update house details, and publish new properties from this dashboard.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ProprietorDashboard
