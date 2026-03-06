type QueryPrimitive = string | number | boolean

type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined

export const buildQueryString = (query: object): string => {
  const params = new URLSearchParams()

  Object.entries(query as Record<string, QueryValue>).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)))
      return
    }

    params.append(key, String(value))
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}
