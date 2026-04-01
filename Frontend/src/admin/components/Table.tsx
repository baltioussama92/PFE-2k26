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
}

export default function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyText = 'No data available.',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#D6BEA5]/55 bg-[#FFFFFF] shadow-[0_10px_24px_rgba(58,45,40,0.06)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#F2E5D8] text-left">
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
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[#6D594D]">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[#6D594D]">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-[#D6BEA5]/35 transition-colors hover:bg-[#FFF7EE]">
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
  )
}
