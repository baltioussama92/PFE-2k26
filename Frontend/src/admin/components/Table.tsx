import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyText?: string
  page?: number
  totalPages?: number
  onPageChange?: (nextPage: number) => void
}

export default function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyText = 'No data available.',
  page,
  totalPages,
  onPageChange,
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DCCCB8]/70 bg-[#FFFFFF] shadow-[0_10px_24px_rgba(58,45,40,0.06)]">
      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#F7EFE6] text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#3A2D28] ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-[#6D594D]">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-[#6D594D]">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-[#E8DCCD] transition-colors hover:bg-[#FFFAF3]">
                {columns.map((column) => (
                  <td key={`${rowKey(row)}-${column.key}`} className={`px-4 py-3 text-sm text-[#2F241F] ${column.className || ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {typeof page === 'number' && typeof totalPages === 'number' && onPageChange ? (
        <div className="flex items-center justify-between border-t border-[#E8DCCD] bg-[#FFFCF8] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7A6858]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[#DCCCB8] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A3A2E] transition hover:bg-[#F3E8DC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-[#DCCCB8] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A3A2E] transition hover:bg-[#F3E8DC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
