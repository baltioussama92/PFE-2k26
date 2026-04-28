import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Check, Star, Trash2, X } from 'lucide-react'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import ListingDetailsModal from '../components/ListingDetailsModal'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminListing } from '../services/adminApi'
import { EmptyState, FilterSelect, MetricCard, SearchField, SectionTabs, StatusBadge, SurfaceCard } from '../components/ui'

type ListingAction = 'approve' | 'reject' | 'remove' | 'feature'
type ListingView = 'cards' | 'table'

export default function Listings() {
  const { showToast } = useAdminToast()

  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<AdminListing[]>([])
  const [target, setTarget] = useState<AdminListing | null>(null)
  const [action, setAction] = useState<ListingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [view, setView] = useState<ListingView>('cards')

  const [viewingListingId, setViewingListingId] = useState<number | null>(null)
  const [viewingListingBackendId, setViewingListingBackendId] = useState<string | undefined>()
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    let active = true

    adminApi.getListings()
      .then((data) => {
        if (active) setListings(data)
      })
      .catch(() => showToast('Failed to load listings.', 'error'))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [showToast])

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(listings.map((listing) => listing.location))).filter(Boolean)
    return [{ label: 'All Cities', value: 'all' }, ...cities.map((city) => ({ label: city, value: city }))]
  }, [listings])

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      const lookup = `${listing.title} ${listing.host} ${listing.location}`.toLowerCase()
      const matchesSearch = lookup.includes(search.toLowerCase())
      const matchesCity = cityFilter === 'all' || listing.location === cityFilter
      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
      const inferredType = listing.bedrooms && listing.bedrooms > 2 ? 'villa' : 'apartment'
      const matchesType = typeFilter === 'all' || inferredType === typeFilter
      return matchesSearch && matchesCity && matchesStatus && matchesType
    })
  }, [listings, search, cityFilter, statusFilter, typeFilter])

  const columns = useMemo<TableColumn<AdminListing>[]>(() => [
    {
      key: 'listing',
      header: 'Listing',
      render: (row) => (
        <div>
          <p className="font-semibold text-[#2E241D]">{row.title}</p>
          <p className="text-xs text-[#756253]">{row.location}</p>
        </div>
      ),
    },
    { key: 'host', header: 'Host', render: (row) => row.host },
    {
      key: 'price',
      header: 'Price',
      render: (row) => `${row.pricePerNight || 95} DT/night`,
    },
    {
      key: 'status',
      header: 'Approval',
      render: (row) => (
        <StatusBadge tone={row.status === 'approved' ? 'success' : 'warning'}>
          {row.status}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <ListingActionButton label="Approve" icon={<Check size={13} />} onClick={() => { setTarget(row); setAction('approve') }} />
          <ListingActionButton label="Reject" icon={<X size={13} />} onClick={() => { setTarget(row); setAction('reject') }} tone="danger" />
          <ListingActionButton label="Feature" icon={<Star size={13} />} onClick={() => { setTarget(row); setAction('feature') }} />
          <ListingActionButton label="Remove" icon={<Trash2 size={13} />} onClick={() => { setTarget(row); setAction('remove') }} tone="danger" />
          <ListingActionButton label="View" icon={<Star size={13} />} onClick={() => { setViewingListingId(row.id); setViewingListingBackendId(row.backendId); setShowDetailsModal(true) }} />
        </div>
      ),
    },
  ], [])

  const onConfirmAction = async () => {
    if (!target || !action) return

    setActionLoading(true)
    try {
      if (action === 'approve') {
        const updated = await adminApi.approveListing(target.backendId || target.id)
        if (updated) {
          setListings((prev) => prev.map((listing) => (listing.id === updated.id ? updated : listing)))
          showToast('Listing approved successfully.')
        }
      }

      if (action === 'reject' || action === 'remove') {
        await adminApi.deleteListing(target.id)
        setListings((prev) => prev.filter((listing) => listing.id !== target.id))
        showToast(action === 'remove' ? 'Listing removed.' : 'Listing rejected.')
      }

      if (action === 'feature') {
        showToast('Listing marked as featured.')
      }
    } catch {
      showToast('Failed to apply listing action.', 'error')
    } finally {
      setActionLoading(false)
      setTarget(null)
      setAction(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Listings" value={listings.length} />
        <MetricCard label="Approved" value={listings.filter((l) => l.status === 'approved').length} tone="success" />
        <MetricCard label="Pending" value={listings.filter((l) => l.status !== 'approved').length} tone="warning" />
        <MetricCard label="Featured" value="24" tone="info" />
      </section>

      <SurfaceCard
        title="Property Management"
        subtitle="Review listings with table or card visualization"
        action={
          <SectionTabs
            options={[
              { key: 'cards', label: 'Card View' },
              { key: 'table', label: 'Table View' },
            ]}
            value={view}
            onChange={(next) => setView(next)}
          />
        }
      >
        <div className="mb-4 grid gap-2 md:grid-cols-[1.5fr,1fr,1fr,1fr]">
          <SearchField value={search} onChange={setSearch} placeholder="Search listings, host or city" />
          <FilterSelect value={cityFilter} onChange={setCityFilter} options={cityOptions} />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Approved', value: 'approved' },
              { label: 'Pending', value: 'pending' },
            ]}
          />
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Apartment', value: 'apartment' },
              { label: 'Villa', value: 'villa' },
            ]}
          />
        </div>

        {filtered.length === 0 && !loading ? (
          <EmptyState title="No listings found" body="No listing matches this filter set." />
        ) : view === 'table' ? (
          <Table
            columns={columns}
            rows={filtered}
            rowKey={(row) => row.id}
            loading={loading}
            emptyText="No listings found."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => (
              <article key={listing.id} className="overflow-hidden rounded-2xl border border-[#E2D2BE] bg-white shadow-[0_10px_22px_rgba(58,45,40,0.08)]">
                <div className="relative h-40 bg-gradient-to-br from-[#D1A777] via-[#C4935E] to-[#906A44] overflow-hidden">
                  {listing.images && listing.images.length > 0 && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setViewingListingId(listing.id)
                      setViewingListingBackendId(listing.backendId)
                      setShowDetailsModal(true)
                    }}
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20 flex items-center justify-center"
                  >
                    <span className="text-white font-semibold text-sm">View Details</span>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-bold text-[#2E241D]">{listing.title}</p>
                      <p className="text-sm text-[#6F5D4D]">{listing.location}</p>
                    </div>
                    <StatusBadge tone={listing.status === 'approved' ? 'success' : 'warning'}>{listing.status}</StatusBadge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#59483A]">
                    <p>Host: {listing.host}</p>
                    <p>Price: {listing.pricePerNight || 95} DT/night</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ListingActionButton label="Approve" icon={<Check size={13} />} onClick={() => { setTarget(listing); setAction('approve') }} />
                    <ListingActionButton label="Reject" icon={<X size={13} />} onClick={() => { setTarget(listing); setAction('reject') }} tone="danger" />
                    <ListingActionButton label="Feature" icon={<Star size={13} />} onClick={() => { setTarget(listing); setAction('feature') }} />
                    <ListingActionButton label="Remove" icon={<Trash2 size={13} />} onClick={() => { setTarget(listing); setAction('remove') }} tone="danger" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SurfaceCard>

      <Modal
        open={Boolean(target && action)}
        title={action ? `${action[0].toUpperCase()}${action.slice(1)} listing` : 'Listing action'}
        message={target ? `Confirm to ${action} "${target.title}"?` : ''}
        confirmLabel={action ? `${action[0].toUpperCase()}${action.slice(1)}` : 'Confirm'}
        onCancel={() => { setTarget(null); setAction(null) }}
        onConfirm={onConfirmAction}
        isLoading={actionLoading}
      />

      <ListingDetailsModal
        listingId={viewingListingId}
        backendId={viewingListingBackendId}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setViewingListingId(null)
          setViewingListingBackendId(undefined)
        }}
        onUpdate={(updated) => {
          setListings((prev) => prev.map((listing) => (listing.id === updated.id ? { ...listing, ...updated } : listing)))
        }}
      />
    </div>
  )
}

function ListingActionButton({
  label,
  icon,
  onClick,
  tone = 'neutral',
}: {
  label: string
  icon: ReactNode
  onClick: () => void
  tone?: 'neutral' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
        tone === 'danger'
          ? 'border-[#E3BBB5] bg-[#FAEBEA] text-[#8E2E29] hover:bg-[#F5DEDB]'
          : 'border-[#D8C8B3] bg-[#F9F3EA] text-[#4B3A2E] hover:bg-[#EFE2D5]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
