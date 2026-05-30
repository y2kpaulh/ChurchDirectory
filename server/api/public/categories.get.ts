import { serverSupabaseClient } from '#supabase/server'

/** 비로그인 메인 화면용 카테고리 (RLS anon_read_categories 필요) */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.from('categories').select('id, name').order('name')

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
      data: { code: error.code, hint: '002_public_read.sql 및 004_grants_anon.sql 실행 확인' },
    })
  }

  return data ?? []
})
