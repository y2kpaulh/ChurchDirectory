/** 저장용 URL 정규화 — 빈 값은 null, 스킴 없으면 https:// 추가 */
export function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) {
    return null
  }

  let url = trimmed
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    return parsed.href
  }
  catch {
    return null
  }
}

export function normalizeWebsiteUrlOrThrow(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) {
    return null
  }
  const normalized = normalizeWebsiteUrl(trimmed)
  if (!normalized) {
    throw createError({ statusCode: 400, message: '올바른 URL 형식이 아닙니다. (예: https://example.com)' })
  }
  return normalized
}
