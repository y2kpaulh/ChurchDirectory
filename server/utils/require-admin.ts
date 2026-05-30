import type { H3Event } from 'h3'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export async function requireAdmin(event: H3Event): Promise<{
  client: SupabaseClient
  user: User
}> {
  const client = await serverSupabaseClient(event)
  const { data: { user }, error: authError } = await client.auth.getUser()

  if (authError || !user?.email) {
    throw createError({ statusCode: 401, message: '관리자 로그인이 필요합니다.' })
  }

  const { data, error } = await client
    .from('allowed_users')
    .select('is_approved, role')
    .eq('email', user.email)
    .single()

  if (error || !data?.is_approved || data.role !== 'admin') {
    throw createError({ statusCode: 403, message: '관리자 권한이 없습니다.' })
  }

  return { client, user }
}
