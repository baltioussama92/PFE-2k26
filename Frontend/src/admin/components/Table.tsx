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
    <div className="overflow-x-auto rounded-xl border border-[#CBAD8D]/35">
      <table className="min-w-full border-collapse bg-[#FFFFFF]">
        <thead>
          <tr className="bg-[#EBE3DB] text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#3A2D28] ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[#3A2D28]/70">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[#3A2D28]/70">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-[#CBAD8D]/25">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 text-sm text-[#3A2D28] ${column.className || ''}`}>
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
