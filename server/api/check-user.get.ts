import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()

  if (!user?.email) {
    throw createError({ statusCode: 401, message: '관리자 로그인이 필요합니다.' })
  }

  const { data, error } = await client
    .from('allowed_users')
    .select('is_approved, role')
    .eq('email', user.email)
    .single()

  if (error || !data || !data.is_approved) {
    return { approved: false, role: null, isAdmin: false }
  }

  const isAdmin = data.role === 'admin'

  return { approved: true, role: data.role, isAdmin }
})
