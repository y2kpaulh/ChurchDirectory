/**
 * Magic Link가 Site URL(/)로만 오는 경우 ?code= 등을 잃지 않고 /confirm 으로 보냄.
 * Supabase Redirect URLs에 /confirm 이 없으면 redirectTo 가 무시되는 경우가 많음.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (url.pathname === '/confirm') {
    return
  }

  const hasCode = url.searchParams.has('code')
  const hasTokenHash = url.searchParams.has('token_hash')
  const hasAuthError = url.searchParams.has('error') || url.searchParams.has('error_description')

  if (!hasCode && !hasTokenHash && !hasAuthError) {
    return
  }

  const target = new URL('/confirm', url.origin)
  target.search = url.search
  return sendRedirect(event, target.toString(), 302)
})
